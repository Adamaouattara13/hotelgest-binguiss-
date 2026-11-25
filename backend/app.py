from dotenv import load_dotenv
load_dotenv()
"""
Backend Flask pour Le Binguiss (Restaurant & Hôtel à Grand-Bassam)
Architecture 3 blocs : Client (Frontend) <-> Backend (API + SQLite) <-> Caisse

NOUVEAU : connexion par rôle (Gérant / Caissier) avec jeton signé.
"""
import os
import time
import secrets
import sqlite3
from datetime import datetime
from functools import wraps
from flask import Flask, jsonify, request, send_from_directory, abort
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

# Chemins des dossiers
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(BACKEND_DIR)
CLIENT_DIR = os.path.join(BASE_DIR, "client")
CAISSE_DIR = os.path.join(BASE_DIR, "caisse")
DB_PATH = os.path.join(BACKEND_DIR, "binguiss.db")

# ── ANCIEN CODE D'ACCÈS UNIQUE (gardé pour que la caisse actuelle continue de marcher) ──
# Une fois la nouvelle page de connexion en place, mets ACCEPTER_ANCIEN_CODE à "0"
CODE_CAISSE_SECRET = os.environ.get("CODE_CAISSE_SECRET", "")
ACCEPTER_ANCIEN_CODE = os.environ.get("ACCEPTER_ANCIEN_CODE", "1") == "1"

# ── COMPTES DU PERSONNEL ──
# Mots de passe PROVISOIRES : change-les (ou définis les variables d'environnement).
MDP_CAISSIER = os.environ.get("MDP_CAISSIER", "")
MDP_GERANT = os.environ.get("MDP_GERANT", "")

UTILISATEURS = {
    "caisse.binguiss": {"role": "caissier", "hash": generate_password_hash(MDP_CAISSIER)},
    "gerant.binguiss": {"role": "gerant",   "hash": generate_password_hash(MDP_GERANT)},
}
ROLE_VERS_IDENTIFIANT = {"caissier": "caisse.binguiss", "gerant": "gerant.binguiss"}

# Clé de signature des jetons. Sans variable d'environnement, elle change à chaque
# redémarrage du serveur (tout le monde doit alors se reconnecter : c'est sans danger).
SECRET_KEY = os.environ.get("SECRET_KEY") or secrets.token_hex(32)
DUREE_SESSION_SECONDES = 12 * 3600  # 12 heures
serializer = URLSafeTimedSerializer(SECRET_KEY, salt="binguiss-caisse")

# Anti force brute : 5 échecs max par adresse IP sur 5 minutes
ECHECS = {}
MAX_ECHECS = 5
FENETRE_ECHECS = 300

app = Flask(__name__)

# ── INITIALISATION DE LA BASE DE DONNÉES SQLITE ──
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()

    # Table du Menu
    cur.execute("""
    CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY,
        nom TEXT NOT NULL,
        desc TEXT,
        prix INTEGER NOT NULL,
        categorie TEXT NOT NULL,
        emoji TEXT,
        img TEXT,
        disponible INTEGER DEFAULT 1,
        stock INTEGER DEFAULT 50
    );
    """)

    # Table des Commandes
    cur.execute("""
    CREATE TABLE IF NOT EXISTS commandes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reference TEXT UNIQUE NOT NULL,
        client_nom TEXT NOT NULL,
        client_telephone TEXT,
        type_commande TEXT NOT NULL,
        adresse_ou_table TEXT,
        total INTEGER NOT NULL,
        statut TEXT DEFAULT 'nouvelle',
        date_creation TEXT NOT NULL
    );
    """)

    # Table des Articles de Commande
    cur.execute("""
    CREATE TABLE IF NOT EXISTS commande_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        commande_id INTEGER NOT NULL,
        plat_id INTEGER NOT NULL,
        plat_nom TEXT NOT NULL,
        quantite INTEGER NOT NULL,
        prix_unitaire INTEGER NOT NULL,
        sous_total INTEGER NOT NULL,
        FOREIGN KEY (commande_id) REFERENCES commandes(id)
    );
    """)

    # Table des Réservations
    cur.execute("""
    CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_nom TEXT NOT NULL,
        client_telephone TEXT NOT NULL,
        type_reservation TEXT NOT NULL,
        detail TEXT NOT NULL,
        date_arrivee TEXT,
        date_depart TEXT,
        statut TEXT DEFAULT 'en_attente',
        date_creation TEXT NOT NULL
    );
    """)

    # Vérifier si le menu est déjà peuplé
    cur.execute("SELECT COUNT(*) FROM menu;")
    count = cur.fetchone()[0]

    if count == 0:
        plats_initiaux = [
            # Plats
            (1, "Capitaine / Bar / Daurade Braisé", "Poisson frais du jour braisé avec alloco", 8000, "plats", "", "poisson_braise.jpg", 1, 15),
            (2, "Poulet Braisé ou Kedjénou (Demi)", "Recette traditionnelle ivoirienne mijotée", 4000, "plats", "", "poulet_kedjenou.jpg", 1, 20),
            (3, "Poulet Braisé ou Kedjénou (Entier)", "Poulet entier assaisonné au canari", 7000, "plats", "", "poulet_kedjenou.jpg", 1, 15),
            (4, "Lapin Braisé ou Kedjénou (Demi)", "Spécialité locale savoureuse", 8500, "plats", "", "menu.png", 1, 10),
            (5, "Lapin Braisé ou Kedjénou (Entier)", "Plat généreux", 15000, "plats", "", "menu.png", 1, 8),
            (6, "Poulet Africain ou Pondeuse (Demi)", "Saveur authentique", 7500, "plats", "", "poulet_kedjenou.jpg", 1, 10),
            (7, "Pintade Braisée ou Kedjénou (Demi)", "Pintade braisée aux aromates", 7500, "plats", "", "poulet_kedjenou.jpg", 1, 10),
            (8, "Poulet Binguiss / Sauté", "Recette signature de la maison", 10000, "plats", "", "poulet_kedjenou.jpg", 1, 12),
            (9, "Brochettes de Filet de Bœuf", "Viande tendre marinée et grillée", 7000, "plats", "", "menu.png", 1, 15),
            (10, "Filet de Bœuf (Sauce au choix)", "Sauce poivre, roquefort ou échalote", 10000, "plats", "", "menu.png", 1, 10),
            (11, "Entrecôte Maître d'Hôtel", "Grillée minute au beurre persillé", 8000, "plats", "", "menu.png", 1, 10),
            (12, "Sole Meunière", "Sole fraîche dorée au beurre", 8000, "plats", "", "poisson_braise.jpg", 1, 10),
            (13, "Filet de Sole ou Mérou", "Filet fondant", 10000, "plats", "", "poisson_braise.jpg", 1, 8),
            (14, "Brochettes de Mérou", "Dés de mérou grillés aux oignons", 8000, "plats", "", "menu.png", 1, 12),
            (15, "Langouste Braisée", "Grande langouste grillée au feu de bois", 15000, "plats", "", "menu.png", 1, 6),
            (16, "Gambas Braisée ou Sautée", "Gambas fraîches relevées", 14000, "plats", "", "menu.png", 1, 8),
            (17, "Calamar Frit aux Légumes", "Calamars croustillants sautés", 7000, "plats", "", "menu.png", 1, 10),
            (18, "Brochettes d'Escargots", "Escargots géants épicés", 7000, "plats", "", "menu.png", 1, 12),
            (19, "Crabes de Mer Mayonnaise", "Crabes frais décortiqués", 8000, "plats", "", "menu.png", 1, 10),
            (20, "Marmite du Pêcheur", "Poissons et fruits de mer cuisinés", 15000, "plats", "", "menu.png", 1, 6),
            (21, "Spaghettis à la Milanaise", "Sauce tomate maison & parmesan", 5000, "plats", "", "menu.png", 1, 20),
            (22, "Spaghettis à la Bolognaise", "Bœuf haché mijoté aux herbes", 6000, "plats", "", "menu.png", 1, 20),
            (23, "Spaghettis aux Crevettes", "Crevettes sautées à l'ail", 7500, "plats", "", "menu.png", 1, 15),
            (24, "Spaghettis aux Écrevisses", "Spécialité aux écrevisses fraîches", 8500, "plats", "", "menu.png", 1, 12),

            # Entrées
            (40, "Avocat Crevettes", "Avocat frais et crevettes sauce cocktail", 6000, "entrees", "", "menu.png", 1, 15),
            (41, "Salade Niçoise", "Thon, œufs, légumes croquants", 6000, "entrees", "", "menu.png", 1, 15),
            (42, "Salade Composée", "Mélange de crudités fraîches", 3000, "entrees", "", "menu.png", 1, 20),
            (43, "Salade de foie ou gésier", "Gésiers de volailles confits tièdes", 3500, "entrees", "", "menu.png", 1, 15),
            (44, "Salade Verte", "Salade du marché et vinaigrette", 2500, "entrees", "", "menu.png", 1, 20),
            (45, "Crevette Sautée", "Crevettes sautées à l'ail et persil", 6500, "entrees", "", "menu.png", 1, 15),
            (46, "Beignets de Crevettes", "Beignets dorés croustillants", 6000, "entrees", "", "menu.png", 1, 15),
            (47, "Cuisses de Grenouilles Sautées", "Aux fines herbes", 7000, "entrees", "", "menu.png", 1, 10),
            (48, "Écrevisses Sautées", "Écrevisses fraîches sautées", 7000, "entrees", "", "menu.png", 1, 10),
            (49, "Écrevisses Bassamoises", "Spécialité locale de Grand-Bassam", 8000, "entrees", "", "menu.png", 1, 10),

            # Accompagnements
            (60, "Alloco", "Bananes plantains frites bien dorées", 1000, "accompagnements", "", "alloco_dore.jpg", 1, 50),
            (61, "Attiéké", "Semoule de manioc traditionnelle", 1000, "accompagnements", "", "menu.png", 1, 50),
            (62, "Frites de Pommes de Terre", "Frites croustillantes maison", 1000, "accompagnements", "", "menu.png", 1, 40),
            (63, "Frites d'Ignames", "Bâtonnets d'igname frits", 1500, "accompagnements", "", "menu.png", 1, 30),
            (64, "Frites de Patates Douces", "Patates douces dorées", 1500, "accompagnements", "", "menu.png", 1, 30),
            (65, "Riz", "Portion de riz blanc parfumé", 1000, "accompagnements", "", "menu.png", 1, 50),
            (66, "Haricot Vert", "Haricots verts sautés au beurre", 1500, "accompagnements", "", "menu.png", 1, 20),
            (67, "Pommes de Terre Sautées aux Herbes", "Pommes rissolées assaisonnées", 2500, "accompagnements", "", "menu.png", 1, 20),
            (68, "Pommes de Terre Vapeur", "Pommes fondantes à la vapeur", 1500, "accompagnements", "", "menu.png", 1, 20),

            # Boissons
            (80, "Bières locales fraîches", "Bock 65cl ou bières locales fraîches", 1500, "boissons", "", "menu.png", 1, 60),
            (81, "Sucreries classiques", "Coca, Fanta, Sprite, etc.", 1000, "boissons", "", "menu.png", 1, 80),
            (82, "Jus Naturel (Bissap / Gingembre)", "100% fruits frais pressés à la menthe", 3000, "boissons", "", "jus_bissap.jpg", 1, 30),
            (83, "Energy Red Bull", "Canette fraîche", 1500, "boissons", "", "menu.png", 1, 25),
            (84, "Eau Minérale 1.5L", "Fraîche", 1000, "boissons", "", "menu.png", 1, 100),
            (85, "Cocktails classiques", "Cocktail alcoolisé ou sans alcool", 3000, "boissons", "", "menu.png", 1, 30),
            (86, "Petit Déjeuner Complet", "Pain frais, café/chocolat, œufs, jus", 2500, "boissons", "", "menu.png", 1, 20),
            (87, "Café / Thé", "Tasse fumante", 1000, "boissons", "", "menu.png", 1, 40),
            (88, "Liqueur - Apéritif", "Le verre", 1500, "boissons", "", "menu.png", 1, 30),
            (89, "Digestif", "Le verre", 2000, "boissons", "", "menu.png", 1, 30),

            # Desserts
            (90, "Bananes Flambées ou Ananas", "Flambées au rhum", 3000, "desserts", "", "menu.png", 1, 20),
            (91, "Ananas Pirogue", "Découpé en pirogue rafraîchissante", 1500, "desserts", "", "menu.png", 1, 25),
            (92, "Assiette de Fruits Frais", "Fruits de saison découpés", 2000, "desserts", "", "menu.png", 1, 25),
            (93, "Salade de Fruits", "Mélange fruité frais", 2000, "desserts", "", "menu.png", 1, 25),
            (94, "Crêpe au Chocolat", "Crêpe maison nappée de chocolat", 3000, "desserts", "", "menu.png", 1, 20),

            # Chambres Hôtel
            (201, "Chambre vue mer", "Climatisée, grand lit, balcon vue mer", 35000, "chambres", "", "chambre.png", 1, 4),
            (202, "Suite mer prestige (N° 101)", "Chambre spacieuse 101, salon, vue océan", 60000, "chambres", "", "101img.png", 1, 2),
            (203, "Chambre standard confort", "Calme côté couloir jardin fleuri", 25000, "chambres", "", "couloir des chambres.png", 1, 4),
            (204, "Chambre confort N° 101 bis", "Avec salle de bain moderne équipée", 30000, "chambres", "", "101.png", 1, 2)
        ]

        cur.executemany("""
        INSERT INTO menu (id, nom, desc, prix, categorie, emoji, img, disponible, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, plats_initiaux)

    # Retire les emojis déjà enregistrés dans une base existante
    cur.execute("UPDATE menu SET emoji = '' WHERE emoji IS NOT NULL AND emoji <> '';")

    conn.commit()
    conn.close()

# Initialiser SQLite au démarrage
init_db()


# ══════════════════════════════════════════════════════════
# SÉCURITÉ : CONNEXION PAR RÔLE (GÉRANT / CAISSIER)
# ══════════════════════════════════════════════════════════
def _trop_d_echecs(ip):
    maintenant = time.time()
    ECHECS[ip] = [t for t in ECHECS.get(ip, []) if maintenant - t < FENETRE_ECHECS]
    return len(ECHECS[ip]) >= MAX_ECHECS

def _extraire_jeton():
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        return auth[7:].strip()
    return request.headers.get("X-Token-Caisse")

def identifier_utilisateur():
    """Renvoie le rôle ('gerant' ou 'caissier') de la personne connectée, ou None."""
    jeton = _extraire_jeton()
    if jeton:
        try:
            data = serializer.loads(jeton, max_age=DUREE_SESSION_SECONDES)
            if data.get("role") in ("gerant", "caissier"):
                return data["role"]
        except (BadSignature, SignatureExpired):
            return None
    # Ancien système : code unique (traité comme gérant tant qu'il est autorisé)
    if ACCEPTER_ANCIEN_CODE:
        code = request.headers.get("X-Code-Caisse") or request.args.get("code")
        if code and code == CODE_CAISSE_SECRET:
            return "gerant"
    return None

def acces_requis(*roles_autorises):
    """Décorateur : refuse l'accès si non connecté (401) ou si le rôle ne convient pas (403).
    Sans argument : tout membre du personnel connecté est accepté."""
    def decorateur(fonction):
        @wraps(fonction)
        def enveloppe(*args, **kwargs):
            role = identifier_utilisateur()
            if role is None:
                return jsonify({"erreur": "Connexion requise ou session expirée."}), 401
            if roles_autorises and role not in roles_autorises:
                return jsonify({"erreur": "Accès réservé au gérant."}), 403
            request.role_connecte = role
            return fonction(*args, **kwargs)
        return enveloppe
    return decorateur


@app.route("/api/auth/login", methods=["POST"])
def auth_login():
    """Corps JSON : {"role": "gerant" | "caissier", "mot_de_passe": "..."}
    ou bien       : {"identifiant": "gerant.binguiss", "mot_de_passe": "..."}"""
    ip = request.remote_addr or "inconnue"
    if _trop_d_echecs(ip):
        return jsonify({"erreur": "Trop de tentatives. Réessayez dans quelques minutes."}), 429

    data = request.get_json(silent=True) or {}
    mot_de_passe = data.get("mot_de_passe", "")
    identifiant = (data.get("identifiant") or "").strip().lower()
    if not identifiant:
        identifiant = ROLE_VERS_IDENTIFIANT.get((data.get("role") or "").strip().lower(), "")

    compte = UTILISATEURS.get(identifiant)
    if not compte or not check_password_hash(compte["hash"], mot_de_passe):
        ECHECS.setdefault(ip, []).append(time.time())
        return jsonify({"erreur": "Identifiant ou mot de passe incorrect."}), 401

    ECHECS.pop(ip, None)
    jeton = serializer.dumps({"role": compte["role"], "id": identifiant})
    return jsonify({
        "succes": True,
        "role": compte["role"],
        "identifiant": identifiant,
        "jeton": jeton,
        "expire_dans_secondes": DUREE_SESSION_SECONDES
    })


@app.route("/api/auth/moi", methods=["GET"])
def auth_moi():
    """Permet à la caisse de vérifier au chargement si la session est encore valide."""
    role = identifier_utilisateur()
    if role is None:
        return jsonify({"connecte": False}), 401
    return jsonify({"connecte": True, "role": role})


# ══════════════════════════════════════════════════════════
# 1. PAGES DU SITE
# ══════════════════════════════════════════════════════════

# Route réservée à la Caisse (doit être déclarée AVANT le catch-all)
@app.route("/caisse")
@app.route("/caisse/")
@app.route("/caisse.html")
def caisse_page():
    return send_from_directory(CAISSE_DIR, "caisse.html")

# Route racine : Site client
@app.route("/")
def index_client():
    return send_from_directory(CLIENT_DIR, "index.html")


# ══════════════════════════════════════════════════════════
# 2. API PUBLIQUE CLIENT
# ══════════════════════════════════════════════════════════

@app.route("/api/menu", methods=["GET"])
def get_menu():
    """Renvoie la liste des plats du menu depuis la base de données SQLite."""
    categorie = request.args.get("categorie")
    conn = get_db()
    cur = conn.cursor()

    if categorie:
        cur.execute("SELECT * FROM menu WHERE categorie = ? AND disponible = 1;", (categorie,))
    else:
        cur.execute("SELECT * FROM menu WHERE disponible = 1;")

    rows = cur.fetchall()
    menu_liste = [dict(row) for row in rows]
    conn.close()
    return jsonify(menu_liste)


# RÈGLE DE SÉCURITÉ STRICTE : Les prix ne viennent JAMAIS du navigateur.
# Le backend vérifie l'existence des plats et calcule lui-même le total.
@app.route("/api/commandes", methods=["POST"])
def creer_commande():
    data = request.get_json()
    if not data:
        return jsonify({"erreur": "Données manquantes"}), 400

    nom_client = data.get("client_nom", "").strip()
    telephone = data.get("client_telephone", "").strip()
    type_cmd = data.get("type_commande", "livraison").strip()
    adresse = data.get("adresse_ou_table", "").strip()
    articles = data.get("articles", [])

    # Validations de sécurité
    if not nom_client or len(nom_client) < 2:
        return jsonify({"erreur": "Le nom du client est requis (au moins 2 caractères)."}), 400
    if not telephone or len(telephone) < 6:
        return jsonify({"erreur": "Un numéro de téléphone valide est requis."}), 400
    if not articles or not isinstance(articles, list):
        return jsonify({"erreur": "Le panier est vide."}), 400

    conn = get_db()
    cur = conn.cursor()

    total_calcule = 0
    items_valides = []

    for art in articles:
        plat_id = art.get("id")
        qte = art.get("quantite", 0)

        # Validation quantité absurde ou négative
        if not isinstance(qte, int) or qte <= 0 or qte > 100:
            conn.close()
            return jsonify({"erreur": f"Quantité invalide pour l'article ID {plat_id} : doit être entre 1 et 100."}), 400

        cur.execute("SELECT id, nom, prix, disponible FROM menu WHERE id = ?;", (plat_id,))
        plat_db = cur.fetchone()
        if not plat_db:
            conn.close()
            return jsonify({"erreur": f"Le plat ID {plat_id} n'existe pas dans le menu."}), 400
        if plat_db["disponible"] == 0:
            conn.close()
            return jsonify({"erreur": f"Le plat '{plat_db['nom']}' n'est plus disponible."}), 400

        prix_reel = plat_db["prix"]  # Prix issu à 100% de la base SQLite
        sous_total = prix_reel * qte
        total_calcule += sous_total

        items_valides.append({
            "plat_id": plat_db["id"],
            "plat_nom": plat_db["nom"],
            "quantite": qte,
            "prix_unitaire": prix_reel,
            "sous_total": sous_total
        })

    # Génération d'une référence lisible
    now_str = datetime.now().strftime("%Y%m%d%H%M%S")
    ref = f"CMD-{now_str[-8:]}"
    date_crea = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cur.execute("""
    INSERT INTO commandes (reference, client_nom, client_telephone, type_commande, adresse_ou_table, total, statut, date_creation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """, (ref, nom_client, telephone, type_cmd, adresse, total_calcule, "nouvelle", date_crea))

    commande_id = cur.lastrowid

    for it in items_valides:
        cur.execute("""
        INSERT INTO commande_items (commande_id, plat_id, plat_nom, quantite, prix_unitaire, sous_total)
        VALUES (?, ?, ?, ?, ?, ?);
        """, (commande_id, it["plat_id"], it["plat_nom"], it["quantite"], it["prix_unitaire"], it["sous_total"]))

    conn.commit()
    conn.close()

    return jsonify({
        "succes": True,
        "message": "Commande enregistrée avec succès !",
        "reference": ref,
        "total": total_calcule,
        "statut": "nouvelle"
    }), 201


@app.route("/api/reservations", methods=["POST"])
def creer_reservation():
    data = request.get_json()
    if not data:
        return jsonify({"erreur": "Données manquantes"}), 400

    nom = data.get("client_nom", "").strip()
    tel = data.get("client_telephone", "").strip()
    type_res = data.get("type_reservation", "chambre").strip()
    detail = data.get("detail", "").strip()
    arrivee = data.get("date_arrivee", "")
    depart = data.get("date_depart", "")

    if not nom or not tel:
        return jsonify({"erreur": "Nom et téléphone obligatoires"}), 400

    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
    INSERT INTO reservations (client_nom, client_telephone, type_reservation, detail, date_arrivee, date_depart, statut, date_creation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """, (nom, tel, type_res, detail, arrivee, depart, "en_attente", datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
    conn.commit()
    res_id = cur.lastrowid
    conn.close()

    return jsonify({"succes": True, "id": res_id, "message": "Réservation enregistrée !"}), 201


# ══════════════════════════════════════════════════════════
# 3. API PRIVÉE CAISSE (PROTÉGÉE PAR CONNEXION ET PAR RÔLE)
# ══════════════════════════════════════════════════════════

# Gérant ET caissier : commandes, statuts, réservations
@app.route("/api/caisse/commandes", methods=["GET"])
@acces_requis()
def caisse_get_commandes():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM commandes ORDER BY id DESC LIMIT 50;")
    commandes = [dict(c) for c in cur.fetchall()]

    for cmd in commandes:
        cur.execute("SELECT plat_nom, quantite, prix_unitaire, sous_total FROM commande_items WHERE commande_id = ?;", (cmd["id"],))
        cmd["articles"] = [dict(it) for it in cur.fetchall()]

    conn.close()
    return jsonify(commandes)


@app.route("/api/caisse/commandes/<int:cmd_id>/statut", methods=["POST"])
@acces_requis()
def caisse_changer_statut(cmd_id):
    data = request.get_json() or {}
    nouveau_statut = data.get("statut")
    statuts_autorises = ["nouvelle", "en_preparation", "prete", "payee", "annulee"]

    if nouveau_statut not in statuts_autorises:
        return jsonify({"erreur": f"Statut non valide. Valeurs autorisées : {statuts_autorises}"}), 400

    # Seul le gérant peut annuler une commande (évite les annulations frauduleuses en caisse)
    if nouveau_statut == "annulee" and request.role_connecte != "gerant":
        return jsonify({"erreur": "Seul le gérant peut annuler une commande."}), 403

    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE commandes SET statut = ? WHERE id = ?;", (nouveau_statut, cmd_id))
    conn.commit()
    conn.close()

    return jsonify({"succes": True, "commande_id": cmd_id, "nouveau_statut": nouveau_statut})


# Réservé au GÉRANT : chiffre d'affaires
@app.route("/api/caisse/chiffre-affaires", methods=["GET"])
@acces_requis("gerant")
def caisse_ca_du_jour():
    today = datetime.now().strftime("%Y-%m-%d")
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
    SELECT COALESCE(SUM(total), 0) AS ca_jour, COUNT(*) as nb_commandes
    FROM commandes
    WHERE statut = 'payee' AND date_creation LIKE ?;
    """, (f"{today}%",))
    res = dict(cur.fetchone())
    conn.close()

    return jsonify({
        "date": today,
        "ca_paye_jour": res["ca_jour"],
        "nb_commandes_payees": res["nb_commandes"]
    })


@app.route("/api/caisse/reservations", methods=["GET"])
@acces_requis()
def caisse_get_reservations():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM reservations ORDER BY id DESC LIMIT 50;")
    res = [dict(r) for r in cur.fetchall()]
    conn.close()
    return jsonify(res)


# Routes dédiées aux fichiers statiques de la Caisse
@app.route("/caisse/css/<path:filename>")
def caisse_css(filename):
    return send_from_directory(os.path.join(CAISSE_DIR, "css"), filename)

@app.route("/caisse/js/<path:filename>")
def caisse_js(filename):
    return send_from_directory(os.path.join(CAISSE_DIR, "js"), filename)

# ══════════════════════════════════════════════════════════
# 4. FICHIERS STATIQUES DU SITE CLIENT (IMAGES, JS, CSS)
# (Placé en tout dernier pour ne jamais masquer les routes /caisse ou /api)
# ══════════════════════════════════════════════════════════
@app.route("/<path:filename>")
def client_assets(filename):
    # 1. Si c'est un asset caisse (css/caisse.css ou js/caisse.js)
    if filename.startswith("css/caisse.") or filename.startswith("js/caisse."):
        caisse_file = os.path.join(CAISSE_DIR, filename)
        if os.path.isfile(caisse_file):
            return send_from_directory(CAISSE_DIR, filename)

    # 2. Chercher dans le dossier client (css, js, images, html)
    client_path = os.path.join(CLIENT_DIR, filename)
    if os.path.isfile(client_path):
        return send_from_directory(CLIENT_DIR, filename)

    # 3. Image demandée sans le préfixe images/ (ex: /logo.png)
    img_fallback = os.path.join(CLIENT_DIR, "images", filename)
    if os.path.isfile(img_fallback):
        return send_from_directory(os.path.join(CLIENT_DIR, "images"), filename)

    # 4. Chercher dans le dossier caisse
    caisse_path = os.path.join(CAISSE_DIR, filename)
    if os.path.isfile(caisse_path):
        return send_from_directory(CAISSE_DIR, filename)

    abort(404)


if __name__ == "__main__":
    print("==================================================")
    print("Serveur Le Binguiss démarré !")
    print("   • Site client : http://127.0.0.1:5000/")
    print("   • Caisse      : http://127.0.0.1:5000/caisse")
    print("   • API Menu    : http://127.0.0.1:5000/api/menu")
    print("   • Comptes     : caisse.binguiss (caissier) / gerant.binguiss (gérant)")
    print("   • Ancien code : " + ("ACTIF (à désactiver plus tard)" if ACCEPTER_ANCIEN_CODE else "désactivé"))
    print("==================================================")
    app.run(host="127.0.0.1", port=5000, debug=False)
