// ══════════════════════════════════════════════════════════
// AUTHENTIFICATION (Gérant / Caissier) — vérifiée par le serveur
// ══════════════════════════════════════════════════════════
const CLE_JETON = 'binguiss_jeton';
let jetonSession = sessionStorage.getItem(CLE_JETON) || null;
let roleConnecte = null;          // 'gerant' ou 'caissier'
let profilSelectionne = 'caisse'; // profil choisi sur l'écran de connexion

function enteteAuth(extra) {
    const h = Object.assign({}, extra || {});
    if (jetonSession) h['Authorization'] = 'Bearer ' + jetonSession;
    return h;
}

function afficherEcran(nom) {
    // nom : 'login', 'caisse' ou 'gerant'
    document.getElementById('loginScreen').classList.toggle('active', nom === 'login');
    document.getElementById('dashboardScreen').classList.toggle('active', nom === 'caisse');
    document.getElementById('gerantScreen').classList.toggle('active', nom === 'gerant');
}

function ouvrirSessionLocale(role) {
    roleConnecte = role;
    if (role === 'gerant') {
        afficherEcran('gerant');
        changerOngletGerant('dashboard');
    } else {
        afficherEcran('caisse');
    }
    chargerCommandesDepuisBackend();
}

function fermerSessionLocale(message) {
    jetonSession = null;
    roleConnecte = null;
    sessionStorage.removeItem(CLE_JETON);
    document.getElementById('loginPass').value = '';
    document.getElementById('loginPass').type = 'password';
    document.getElementById('btnVoirMdp').innerHTML = ICONE_OEIL;
    document.getElementById('loginErreur').innerText = '';
    afficherEcran('login');
    if (message) afficherToast(message);
}

// Au chargement : si un jeton existe encore, on vérifie qu'il est valide
async function restaurerSession() {
    if (!jetonSession) { afficherEcran('login'); return; }
    try {
        const res = await fetch('/api/auth/moi', { headers: enteteAuth() });
        if (res.ok) {
            const data = await res.json();
            ouvrirSessionLocale(data.role);
            return;
        }
    } catch (e) { /* serveur injoignable : on retombe sur la connexion */ }
    fermerSessionLocale();
}

async function seConnecter(e) {
    e.preventDefault();
    const erreurEl = document.getElementById('loginErreur');
    const bouton = document.getElementById('btnConnexion');
    const motDePasse = document.getElementById('loginPass').value;
    const role = profilSelectionne === 'gerant' ? 'gerant' : 'caissier';

    erreurEl.innerText = '';
    bouton.disabled = true;
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: role, mot_de_passe: motDePasse })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            erreurEl.innerText = data.erreur || 'Connexion impossible.';
            return;
        }
        jetonSession = data.jeton;
        sessionStorage.setItem(CLE_JETON, jetonSession);
        document.getElementById('loginPass').value = '';
        ouvrirSessionLocale(data.role);
        afficherToast('Connecté — ' + (data.role === 'gerant' ? 'Espace gérant' : 'Espace caisse'));
    } catch (err) {
        erreurEl.innerText = 'Serveur injoignable. Vérifiez que le serveur est lancé.';
    } finally {
        bouton.disabled = false;
    }
}

function seDeconnecter() {
    fermerSessionLocale('Vous êtes déconnecté.');
}

function seDeconcterGerant() {
    fermerSessionLocale('Vous êtes déconnecté.');
}

const ICONE_OEIL = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
const ICONE_OEIL_BARRE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';

function basculerMotDePasse() {
    const champ = document.getElementById('loginPass');
    const bouton = document.getElementById('btnVoirMdp');
    const visible = champ.type === 'text';
    champ.type = visible ? 'password' : 'text';
    bouton.innerHTML = visible ? ICONE_OEIL : ICONE_OEIL_BARRE;
    bouton.title = visible ? 'Afficher le mot de passe' : 'Masquer le mot de passe';
    bouton.setAttribute('aria-label', bouton.title);
}

function selectionnerProfil(role) {
    const btnCaisse = document.getElementById('btnAccesCaisse');
    const btnGerant = document.getElementById('btnAccesGerant');
    const note = document.getElementById('toggleNote');
    const inputUser = document.getElementById('loginUser');

    profilSelectionne = role === 'gerant' ? 'gerant' : 'caisse';
    document.getElementById('loginErreur').innerText = '';

    if (profilSelectionne === 'caisse') {
        btnCaisse.classList.add('active');
        btnGerant.classList.remove('active');
        note.innerText = "Tables, commandes, chambres, paiements et stock.";
        inputUser.value = "caisse.binguiss";
    } else {
        btnGerant.classList.add('active');
        btnCaisse.classList.remove('active');
        note.innerText = "Consultation activité, entrées d'argent, stocks et export PDF.";
        inputUser.value = "gerant.binguiss";
    }
}

// ══════════════════════════════════════════════════════════
// DONNÉES FIDÈLES À LA MAQUETTE FIGMA 2
// ══════════════════════════════════════════════════════════
let donneesTables = [
    { id: 1, nom: "Parasol 1", statut: "unpaid", places: 4, numeroCommande: "128", heure: "12:40", type: "Sur place",
      articles: [
        { nom: "Poulet", quantite: 2, prix: 14000 },
        { nom: "Sucreries", quantite: 5, prix: 5000 },
        { nom: "Eau", quantite: 1, prix: 1000 }
      ] },
    { id: 2, nom: "Parasol 2", statut: "paid", places: 4, numeroCommande: "125", heure: "12:15", type: "Sur place",
      articles: [
        { nom: "Carpe braisée géante", quantite: 2, prix: 24000 },
        { nom: "Alloco supplémentaire", quantite: 3, prix: 4500 },
        { nom: "Bière locale & jus", quantite: 4, prix: 4000 }
      ] },
    { id: 3, nom: "Parasol 3", statut: "unpaid", places: 4, numeroCommande: "129", heure: "12:45", type: "Sur place",
      articles: [
        { nom: "Mérou braisé premium", quantite: 2, prix: 28000 },
        { nom: "Poulet kedjenou", quantite: 1, prix: 9000 },
        { nom: "Cocktails Binguiss", quantite: 2, prix: 4000 }
      ] },
    { id: 4, nom: "Parasol 4", statut: "reserved", places: 4, articles: [] },
    { id: 5, nom: "Parasol 5", statut: "free", places: 4, articles: [] },
    { id: 6, nom: "Parasol 6", statut: "free", places: 4, articles: [] },
    { id: 7, nom: "Table 1", statut: "free", places: 6, articles: [] },
    { id: 8, nom: "Table 2", statut: "free", places: 6, articles: [] },
    { id: 9, nom: "Table 3", statut: "reserved", places: 6, articles: [] },
    { id: 10, nom: "Table 4", statut: "free", places: 6, articles: [] },
    { id: 11, nom: "Table 5", statut: "paid", places: 6, numeroCommande: "122", heure: "11:50", type: "Sur place",
      articles: [
        { nom: "Kedjenou de poulet", quantite: 1, prix: 7000 },
        { nom: "Eau minérale", quantite: 1, prix: 1000 }
      ] },
    { id: 12, nom: "Table 6", statut: "free", places: 6, articles: [] }
];

let tableEnCoursId = null;

// Calcul du total d'une table
function calculerTotalTable(table) {
    if (!table.articles || table.articles.length === 0) return 0;
    return table.articles.reduce((acc, item) => acc + item.prix, 0);
}

function formatPrix(nombre) {
    return nombre.toLocaleString('fr-FR') + ' F';
}

// ── RENDU DE LA GRILLE DES TABLES ──
function afficherTables() {
    const container = document.getElementById('tablesContainer');
    container.innerHTML = '';

    donneesTables.forEach(table => {
        const card = document.createElement('div');
        card.className = `table-card ${table.statut}`;
        card.onclick = () => ouvrirTable(table.id);

        let statutHtml = '';
        const total = calculerTotalTable(table);

        if (table.statut === 'unpaid') {
            statutHtml = `
                <div class="table-status-label">Non payée</div>
                <div class="table-detail-text">${formatPrix(total)}</div>
            `;
        } else if (table.statut === 'paid') {
            statutHtml = `
                <div class="table-status-label">Payée</div>
                <div class="table-detail-text">${formatPrix(total)}</div>
            `;
        } else if (table.statut === 'reserved') {
            statutHtml = `
                <div class="table-status-label">Réservée</div>
                <div class="table-detail-text">${table.places} places</div>
            `;
        } else {
            statutHtml = `
                <div class="table-status-label">Libre</div>
                <div class="table-detail-text">${table.places} places</div>
            `;
        }

        card.innerHTML = `
            <div class="table-card-header">
                <span class="table-name">${table.nom}</span>
                <button type="button" class="btn-edit-table" title="Nommer la table" onclick="ouvrirModalNommer(event, ${table.id})">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </button>
            </div>
            <div class="table-status-info">
                ${statutHtml}
            </div>
        `;

        container.appendChild(card);
    });

    mettreAJourKPIs();
}

// ── MISE À JOUR DES CARTES KPI ──
function mettreAJourKPIs() {
    const tablesNonPayees = donneesTables.filter(t => t.statut === 'unpaid').length;
    const autresNonPayees = 2; // Commandes emporter / autres
    const totalNonPayees = tablesNonPayees + autresNonPayees;

    const totalTablesActives = donneesTables
        .filter(t => t.statut === 'paid' || t.statut === 'unpaid')
        .reduce((acc, t) => acc + calculerTotalTable(t), 0);

    const baseHistorique = 210500;
    const totalRestaurant = baseHistorique + totalTablesActives;
    const totalHotel = 174500;
    const caisseDuJour = totalRestaurant + totalHotel;

    document.getElementById('kpiNonPayees').innerText = totalNonPayees;
    document.getElementById('kpiRestaurant').innerText = formatPrix(totalRestaurant);
    document.getElementById('kpiCaisseJour').innerText = formatPrix(caisseDuJour);
}

// ── CATALOGUE DU RESTAURANT (FIGMA 2d) ──
const catalogueMenu = {
    plats: [
        { nom: "Poulet braisé", prix: 7000 },
        { nom: "Poisson braisé", prix: 6500 },
        { nom: "Riz sauce graine", prix: 4500 },
        { nom: "Alloco", prix: 2000 }
    ],
    boissons: [
        { nom: "Eau", prix: 1000 },
        { nom: "Sucreries", prix: 1000 },
        { nom: "Bière locale", prix: 1500 },
        { nom: "Jus de Bissap", prix: 1500 }
    ],
    desserts: [
        { nom: "Coupe de fruits", prix: 2500 },
        { nom: "Crêpes maison", prix: 2000 },
        { nom: "Glaces artisanales", prix: 2500 }
    ]
};

let categorieActive = 'plats';
let panierEnCours = [];

// ── OUVERTURE D'UNE TABLE (CLIC) ──
function ouvrirTable(id) {
    const table = donneesTables.find(t => t.id === id);
    if (!table) return;

    tableEnCoursId = id;

    if (table.articles.length === 0) {
        ouvrirTiroirInstallation(table);
    } else {
        ouvrirTiroirCommande(table);
    }
}

// ── FIGMA 2d : INSTALLER UN CLIENT / PANIER DE LA TABLE ──
function ouvrirTiroirInstallation(table) {
    document.getElementById('drawerTableTitle').innerText = table.nom;
    document.getElementById('drawerMetaInfo').innerText = "Table libre · un client s'installe";

    document.getElementById('drawerModeInstallation').style.display = 'block';
    document.getElementById('drawerModeConsultation').style.display = 'none';
    document.getElementById('drawerStatusSection').style.display = 'none';
    document.getElementById('drawerActionsInstallation').style.display = 'block';
    document.getElementById('drawerActionsConsultation').style.display = 'none';

    // Pour Parasol 5, pré-charger comme dans la maquette 2d Figma : 1 Poulet braisé + 1 Eau
    if (table.nom === "Parasol 5" && panierEnCours.length === 0) {
        panierEnCours = [
            { nom: "Poulet braisé", quantite: 1, prix: 7000 },
            { nom: "Eau", quantite: 1, prix: 1000 }
        ];
    } else if (panierEnCours.length === 0) {
        panierEnCours = [];
    }

    changerCategorieMenu('plats');
    afficherPanier();

    document.getElementById('drawerOverlay').classList.add('active');
    document.getElementById('orderDrawer').classList.add('active');
}

function changerCategorieMenu(cat) {
    categorieActive = cat;
    document.getElementById('tabCatPlats').className = `category-tab-btn ${cat === 'plats' ? 'active' : ''}`;
    document.getElementById('tabCatBoissons').className = `category-tab-btn ${cat === 'boissons' ? 'active' : ''}`;
    document.getElementById('tabCatDesserts').className = `category-tab-btn ${cat === 'desserts' ? 'active' : ''}`;

    const container = document.getElementById('catalogItemsContainer');
    container.innerHTML = '';

    const items = catalogueMenu[cat] || [];
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'catalog-item-card';
        card.innerHTML = `
            <div class="catalog-item-info">
                <span class="catalog-item-name">${item.nom}</span>
                <span class="catalog-item-price">${formatPrix(item.prix)}</span>
            </div>
            <button type="button" class="btn-add-item" title="Ajouter" onclick="ajouterAuPanier('${item.nom}', ${item.prix})">
                +
            </button>
        `;
        container.appendChild(card);
    });
}

function ajouterAuPanier(nom, prix) {
    const existant = panierEnCours.find(item => item.nom === nom);
    if (existant) {
        existant.quantite += 1;
        existant.prix += prix;
    } else {
        panierEnCours.push({ nom, quantite: 1, prix });
    }
    afficherPanier();
}

function retirerDuPanier(index) {
    panierEnCours.splice(index, 1);
    afficherPanier();
}

function afficherPanier() {
    const container = document.getElementById('cartItemsContainer');
    container.innerHTML = '';

    if (panierEnCours.length === 0) {
        container.innerHTML = '<div style="color: #94a3b8; font-size: 0.9rem; font-style: italic; padding: 6px 0;">Aucun article dans le panier. Cliquez sur + ci-dessus.</div>';
        document.getElementById('drawerTotalAmount').innerText = '0 F';
        return;
    }

    let total = 0;
    panierEnCours.forEach((item, index) => {
        total += item.prix;
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div class="cart-item-left">
                <button type="button" class="btn-remove-cart-item" title="Supprimer" onclick="retirerDuPanier(${index})">✕</button>
                <span class="cart-item-name">${item.quantite} × ${item.nom}</span>
            </div>
            <span class="cart-item-price">${formatPrix(item.prix)}</span>
        `;
        container.appendChild(row);
    });

    document.getElementById('drawerTotalAmount').innerText = formatPrix(total);
}

function enregistrerCommandeClient() {
    const table = donneesTables.find(t => t.id === tableEnCoursId);
    if (!table) return;

    if (panierEnCours.length === 0) {
        alert("Veuillez ajouter au moins un article au panier avant d'enregistrer.");
        return;
    }

    table.articles = JSON.parse(JSON.stringify(panierEnCours));
    table.statut = 'unpaid';
    table.numeroCommande = Math.floor(130 + Math.random() * 40);
    const maintenant = new Date();
    table.heure = `${maintenant.getHours().toString().padStart(2, '0')}:${maintenant.getMinutes().toString().padStart(2, '0')}`;
    table.type = "Sur place";

    panierEnCours = [];

    afficherTables();
    afficherToast(`Commande enregistrée pour ${table.nom} !`);

    ouvrirTiroirCommande(table);
}

function basculerVersAjoutArticles() {
    const table = donneesTables.find(t => t.id === tableEnCoursId);
    if (!table) return;
    panierEnCours = JSON.parse(JSON.stringify(table.articles));
    ouvrirTiroirInstallation(table);
}

// ── FIGMA 2c : TIROIR COMMANDE (CONSULTATION) ──
function ouvrirTiroirCommande(table) {
    document.getElementById('drawerTableTitle').innerText = `Commande ${table.nom}`;
    document.getElementById('drawerMetaInfo').innerText = `N° ${table.numeroCommande || '128'} · ${table.heure || '12:40'} · ${table.type || 'Sur place'}`;

    document.getElementById('drawerModeConsultation').style.display = 'block';
    document.getElementById('drawerModeInstallation').style.display = 'none';
    document.getElementById('drawerStatusSection').style.display = 'block';
    document.getElementById('drawerActionsConsultation').style.display = 'flex';
    document.getElementById('drawerActionsInstallation').style.display = 'none';

    const listEl = document.getElementById('drawerItemsList');
    listEl.innerHTML = '';
    table.articles.forEach(art => {
        const row = document.createElement('div');
        row.className = 'order-item-row';
        row.innerHTML = `
            <span class="order-item-name">${art.quantite} × ${art.nom}</span>
            <span class="order-item-price">${formatPrix(art.prix)}</span>
        `;
        listEl.appendChild(row);
    });

    const btnNonPayee = document.getElementById('btnStatutNonPayee');
    const btnPayee = document.getElementById('btnStatutPayee');

    if (table.statut === 'paid') {
        btnPayee.classList.remove('inactive');
        btnNonPayee.classList.add('inactive');
    } else {
        btnNonPayee.classList.remove('inactive');
        btnPayee.classList.add('inactive');
    }

    document.getElementById('drawerTotalAmount').innerText = formatPrix(calculerTotalTable(table));

    document.getElementById('drawerOverlay').classList.add('active');
    document.getElementById('orderDrawer').classList.add('active');
}

function fermerTiroirCommande() {
    document.getElementById('drawerOverlay').classList.remove('active');
    document.getElementById('orderDrawer').classList.remove('active');
    panierEnCours = [];
}

function changerStatutCommande(estPaye) {
    const table = donneesTables.find(t => t.id === tableEnCoursId);
    if (!table) return;

    table.statut = estPaye ? 'paid' : 'unpaid';

    const btnNonPayee = document.getElementById('btnStatutNonPayee');
    const btnPayee = document.getElementById('btnStatutPayee');

    if (estPaye) {
        btnPayee.classList.remove('inactive');
        btnNonPayee.classList.add('inactive');
        afficherToast(`Statut mis à jour : ${table.nom} est PAYÉE`);
    } else {
        btnNonPayee.classList.remove('inactive');
        btnPayee.classList.add('inactive');
        afficherToast(`Statut mis à jour : ${table.nom} est NON PAYÉE`);
    }

    afficherTables();
}

function imprimerFacture() {
    const table = donneesTables.find(t => t.id === tableEnCoursId);
    if (!table) return;
    afficherToast(`Impression du ticket pour ${table.nom} lancée...`);
    setTimeout(() => {
        window.print();
    }, 300);
}

// ── MODAL : NOMMER LA TABLE (FIGMA 2b) ──
function ouvrirModalNommer(e, id) {
    if (e) e.stopPropagation();
    const table = donneesTables.find(t => t.id === id);
    if (!table) return;

    tableEnCoursId = id;
    const input = document.getElementById('inputNomTable');
    input.value = table.nom;

    document.getElementById('modalNommerTable').classList.add('active');
    setTimeout(() => input.focus(), 50);
}

function ouvrirModalDepuisTiroir() {
    if (!tableEnCoursId) return;
    ouvrirModalNommer(null, tableEnCoursId);
}

function fermerModalNommer(e) {
    if (e && e.target !== e.currentTarget) return;
    document.getElementById('modalNommerTable').classList.remove('active');
}

function sauvegarderNomTable() {
    const table = donneesTables.find(t => t.id === tableEnCoursId);
    const input = document.getElementById('inputNomTable');
    const nouveauNom = input.value.trim();

    if (table && nouveauNom) {
        table.nom = nouveauNom;
        afficherTables();
        document.getElementById('drawerTableTitle').innerText = `Commande ${table.nom}`;
        afficherToast(`Table renommée en "${table.nom}"`);
    }

    fermerModalNommer();
}

// Permettre la validation par la touche Entrée dans la modale
document.getElementById('inputNomTable').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        sauvegarderNomTable();
    } else if (e.key === 'Escape') {
        fermerModalNommer();
    }
});

// Données du registre Commandes du jour (Figma 3)
let registreCommandes = [
    { num: '128', client: 'Parasol 1', type: 'Sur place', articles: [
        { nom: 'Poulet', qte: 2, prix: 14000 },
        { nom: 'Sucreries', qte: 5, prix: 5000 },
        { nom: 'Eau', qte: 1, prix: 1000 }
    ], statut: 'unpaid', heure: '12:40' },
    { num: '127', client: 'Parasol 2', type: 'Sur place', articles: [
        { nom: 'Carpe braisée', qte: 2, prix: 24000 },
        { nom: 'Alloco', qte: 2, prix: 4000 }
    ], statut: 'paid', heure: '12:25' },
    { num: '126', client: 'Koné Awa', type: 'À emporter', articles: [
        { nom: 'Poulet braisé', qte: 1, prix: 7000 },
        { nom: 'Eau', qte: 2, prix: 2000 }
    ], statut: 'paid', heure: '12:15' },
    { num: '125', client: 'Parasol 3', type: 'Sur place', articles: [
        { nom: 'Mérou braisé', qte: 2, prix: 28000 },
        { nom: 'Poulet kedjenou', qte: 1, prix: 9000 },
        { nom: 'Cocktails', qte: 2, prix: 4000 }
    ], statut: 'unpaid', heure: '12:05' },
    { num: '124', client: 'Traoré M.', type: 'Livraison', articles: [
        { nom: 'Riz sauce graine', qte: 2, prix: 9000 },
        { nom: 'Jus Bissap', qte: 1, prix: 1500 }
    ], statut: 'unpaid', heure: '11:50' },
    { num: '123', client: 'Yao K. (site)', type: 'À distance', articles: [
        { nom: 'Poulet braisé', qte: 1, prix: 7000 },
        { nom: 'Eau', qte: 4, prix: 4000 }
    ], statut: 'unpaid', heure: '11:40' },
    { num: '122', client: 'Table 5', type: 'Sur place', articles: [
        { nom: 'Kedjenou de poulet', qte: 1, prix: 7000 },
        { nom: 'Eau minérale', qte: 1, prix: 1000 }
    ], statut: 'paid', heure: '11:30' },
    { num: '121', client: 'Bamba S.', type: 'Livraison', articles: [
        { nom: 'Poisson braisé', qte: 2, prix: 13000 },
        { nom: 'Alloco', qte: 2, prix: 4000 },
        { nom: 'Sucreries', qte: 3, prix: 3000 },
        { nom: 'Eau', qte: 2, prix: 2000 }
    ], statut: 'paid', heure: '11:10' },
];

// ── INTÉGRATION API BACKEND (COMMANDES RÉELLES EN DIRECT) ──
// Indicateur pour savoir si on est déjà connecté au backend
let backendConnecte = false;

async function chargerCommandesDepuisBackend() {
    if (!jetonSession) return; // pas connecté : on n'appelle pas le serveur
    try {
        const res = await fetch('/api/caisse/commandes', { headers: enteteAuth() });
        if (res.ok) {
            const commandesDB = await res.json();

            if (!backendConnecte) {
                backendConnecte = true;
                console.log("Caisse connectée au backend SQLite");
                // Première connexion réussie : on efface les données de démo
                registreCommandes = [];
            }

            if (Array.isArray(commandesDB)) {
                const commandesFormatees = commandesDB.map(c => {
                    let heureStr = 'Récemment';
                    if (c.date_creation && c.date_creation.includes(' ')) {
                        heureStr = c.date_creation.split(' ')[1].substring(0, 5);
                    }
                    const typeLibelle = c.type_commande === 'livraison' ? 'Livraison'
                                      : c.type_commande === 'emporter'  ? 'À emporter'
                                      : 'Sur place';
                    const statutLibelle = (c.statut === 'payee' || c.statut === 'paid') ? 'paid' : 'unpaid';

                    return {
                        id_db: c.id,
                        num: c.reference ? c.reference.replace('CMD-', '') : String(c.id),
                        client: c.client_nom + (c.client_telephone ? ` (${c.client_telephone})` : ''),
                        type: typeLibelle,
                        articles: (c.articles && c.articles.length > 0) ? c.articles.map(a => ({
                            nom: a.plat_nom,
                            qte: a.quantite,
                            prix: a.sous_total
                        })) : [{ nom: 'Commande client', qte: 1, prix: c.total }],
                        statut: statutLibelle,
                        heure: heureStr,
                        provenance: 'site_client'
                    };
                });

                registreCommandes = commandesFormatees;
                afficherCommandes(filtreActifCommandes);
            }
        } else if (res.status === 401) {
            fermerSessionLocale('Session expirée, veuillez vous reconnecter.');
        } else {
            console.error("Erreur backend :", res.status);
        }
    } catch (err) {
        console.error("Connexion backend impossible :", err.message);
    }
}

let filtreActifCommandes = 'toutes';
let cmdEnCoursIndex = null;

function typeToFilter(type) {
    if (type === 'Sur place')   return 'surplace';
    if (type === 'À emporter')  return 'emporter';
    if (type === 'Livraison')   return 'livraison';
    if (type === 'À distance')  return 'adistance';
    return 'toutes';
}

function afficherCommandes(filtre) {
    filtreActifCommandes = filtre || filtreActifCommandes;
    const tbody = document.getElementById('commandesTbody');
    tbody.innerHTML = '';

    const liste = filtre === 'toutes'
        ? registreCommandes
        : registreCommandes.filter(c => typeToFilter(c.type) === filtre);

    const dateStr = '15 octobre';
    document.getElementById('commandesSoustitre').innerText =
        `Registre en direct · ${liste.length} commande${liste.length > 1 ? 's' : ''} · ${dateStr}`;

    liste.forEach((cmd, idx) => {
        const totalCmd = cmd.articles.reduce((s, a) => s + a.prix, 0);
        const tr = document.createElement('tr');
        tr.onclick = () => ouvrirDetailCommande(registreCommandes.indexOf(cmd));
        tr.innerHTML = `
            <td class="td-numero">#${cmd.num}</td>
            <td class="td-client-name">${cmd.client}</td>
            <td>${cmd.type}</td>
            <td>${cmd.articles.length} article${cmd.articles.length > 1 ? 's' : ''}</td>
            <td class="td-total">${formatPrix(totalCmd)}</td>
            <td><span class="badge-statut ${cmd.statut === 'paid' ? 'badge-payee' : 'badge-nonpayee'}">${cmd.statut === 'paid' ? 'Payée' : 'Non payée'}</span></td>
            <td class="td-heure">${cmd.heure}</td>
        `;
        tbody.appendChild(tr);
    });
}

function filtrerCommandes(filtre) {
    ['toutes','surplace','emporter','livraison','adistance'].forEach(f => {
        const btn = document.getElementById('fTab-' + f);
        if (btn) btn.className = 'filter-tab-btn' + (f === filtre ? ' active' : '');
    });
    afficherCommandes(filtre);
}

function ouvrirDetailCommande(idx) {
    cmdEnCoursIndex = idx;
    const cmd = registreCommandes[idx];
    const totalCmd = cmd.articles.reduce((s, a) => s + a.prix, 0);

    document.getElementById('cmdDrawerTitle').innerText = `Commande ${cmd.client}`;
    document.getElementById('cmdDrawerMeta').innerText = `N° ${cmd.num} · ${cmd.heure} · ${cmd.type}`;
    document.getElementById('cmdDrawerTotal').innerText = formatPrix(totalCmd);

    const list = document.getElementById('cmdItemsList');
    list.innerHTML = '';
    cmd.articles.forEach(art => {
        const row = document.createElement('div');
        row.className = 'cmd-item-row';
        row.innerHTML = `
            <span class="cmd-item-name">${art.qte} × ${art.nom}</span>
            <span class="cmd-item-price">${formatPrix(art.prix)}</span>
        `;
        list.appendChild(row);
    });

    const btnNP = document.getElementById('cmdBtnNonPayee');
    const btnP  = document.getElementById('cmdBtnPayee');
    if (cmd.statut === 'paid') {
        btnP.classList.remove('inactive');
        btnNP.classList.add('inactive');
    } else {
        btnNP.classList.remove('inactive');
        btnP.classList.add('inactive');
    }

    // Marquer la ligne sélectionnée
    document.querySelectorAll('#commandesTbody tr').forEach((tr, i) => {
        tr.classList.toggle('row-selected', registreCommandes.indexOf(registreCommandes.filter((c, ci) => ci === idx)[0]) === idx && i === idx);
    });

    document.getElementById('cmdDrawerOverlay').classList.add('active');
    document.getElementById('cmdDetailDrawer').classList.add('active');
}

function fermerDetailCommande() {
    document.getElementById('cmdDrawerOverlay').classList.remove('active');
    document.getElementById('cmdDetailDrawer').classList.remove('active');
    cmdEnCoursIndex = null;
    document.querySelectorAll('#commandesTbody tr').forEach(tr => tr.classList.remove('row-selected'));
}

async function changerStatutCmd(estPaye) {
    if (cmdEnCoursIndex === null) return;
    const cmd = registreCommandes[cmdEnCoursIndex];
    cmd.statut = estPaye ? 'paid' : 'unpaid';

    const btnNP = document.getElementById('cmdBtnNonPayee');
    const btnP  = document.getElementById('cmdBtnPayee');
    if (estPaye) {
        btnP.classList.remove('inactive');
        btnNP.classList.add('inactive');
    } else {
        btnNP.classList.remove('inactive');
        btnP.classList.add('inactive');
    }

    // Si la commande provient de SQLite, mettre à jour dans le backend
    if (cmd.id_db) {
        try {
            const res = await fetch(`/api/caisse/commandes/${cmd.id_db}/statut`, {
                method: 'POST',
                headers: enteteAuth({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({ statut: estPaye ? 'payee' : 'nouvelle' })
            });
            if (res.status === 401) {
                fermerSessionLocale('Session expirée, veuillez vous reconnecter.');
                return;
            }
        } catch (e) {}
    }

    afficherCommandes(filtreActifCommandes);
    afficherToast(`Statut mis à jour : ${cmd.client} est ${estPaye ? 'PAYÉE' : 'NON PAYÉE'}`);
}

function ouvrirFactureDepuisCmd() {
    if (cmdEnCoursIndex === null) return;
    const cmd = registreCommandes[cmdEnCoursIndex];
    ouvrirFactureModal(cmd);
}

function ouvrirFactureModal(cmd) {
    const totalCmd = cmd.articles.reduce((s, a) => s + a.prix, 0);
    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    document.getElementById('invoiceNum').innerText = `FACTURE N° ${cmd.num}`;
    document.getElementById('invoiceMeta').innerHTML =
        `Date : ${dateStr} · ${cmd.heure}<br>${cmd.client} · ${cmd.type} · Source : Restaurant`;
    document.getElementById('invoiceTotalAmount').innerText = formatPrix(totalCmd);

    const tbody = document.getElementById('invoiceItemsTbody');
    tbody.innerHTML = '';
    cmd.articles.forEach(art => {
        const prixUnit = Math.round(art.prix / art.qte);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${art.nom}</td>
            <td>${art.qte}</td>
            <td>${formatPrix(prixUnit)}</td>
            <td>${formatPrix(art.prix)}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('invoiceModal').classList.add('active');
}

function fermerFacture() {
    document.getElementById('invoiceModal').classList.remove('active');
}

function lancerImpression() {
    window.print();
}

// ── NAVIGATION CAISSE ──
function changerOnglet(onglet) {
    const items = document.querySelectorAll('.nav-item');
    items.forEach(el => el.classList.remove('active'));
    event.currentTarget.classList.add('active');

    const tablesGrid = document.getElementById('tablesContainer');
    const kpiGrid = document.querySelector('.kpi-grid');
    const pageHeader = document.querySelector('.page-header');
    const cmdScreen = document.getElementById('commandesScreen');
    const chScreen = document.getElementById('chambresScreen');
    const stScreen = document.getElementById('stockScreen');

    if (tablesGrid) tablesGrid.style.display = 'none';
    if (kpiGrid) kpiGrid.style.display = 'none';
    if (pageHeader) pageHeader.style.display = 'none';
    if (cmdScreen) cmdScreen.classList.remove('active');
    if (chScreen) chScreen.classList.remove('active');
    if (stScreen) stScreen.classList.remove('active');

    if (onglet === 'tables') {
        tablesGrid.style.display = 'grid';
        kpiGrid.style.display = 'grid';
        if (pageHeader) pageHeader.style.display = '';
    } else if (onglet === 'commandes') {
        cmdScreen.classList.add('active');
        chargerCommandesDepuisBackend();
        afficherCommandes('toutes');
        filtrerCommandes('toutes');
    } else if (onglet === 'chambres') {
        chScreen.classList.add('active');
        afficherPlanningChambres();
    } else if (onglet === 'stock') {
        stScreen.classList.add('active');
        afficherStock();
    }
}

// ── MODULE HÔTEL : PLANNING DES CHAMBRES (FIGMA 4) ──
const donneesPlanningChambres = [
    { id: 101, nom: "Chambre 101",
      jours: [
        { jour: "Lun", statut: "payee", label: "Payée" },
        { jour: "Mar", statut: "payee", label: "Payée" },
        { jour: "Mer", statut: "occupee", label: "Occupée" },
        { jour: "Jeu", statut: "occupee", label: "Occupée" },
        { jour: "Ven", statut: "libre", label: "Libre" },
        { jour: "Sam", statut: "libre", label: "Libre" },
        { jour: "Dim", statut: "libre", label: "Libre" }
      ],
      client: { nom: "M. Traoré", acompte: "35 000 F", solde: "0 F", paiement: "Carte bancaire", statut: "Payée" } },
    { id: 102, nom: "Chambre 102",
      jours: [
        { jour: "Lun", statut: "libre", label: "Libre" },
        { jour: "Mar", statut: "reservee", label: "Réservée" },
        { jour: "Mer", statut: "reservee", label: "Réservée" },
        { jour: "Jeu", statut: "occupee", label: "Occupée" },
        { jour: "Ven", statut: "occupee", label: "Occupée" },
        { jour: "Sam", statut: "occupee", label: "Occupée" },
        { jour: "Dim", statut: "libre", label: "Libre" }
      ],
      client: { nom: "Koné Awa", acompte: "25 000 F", solde: "40 000 F", paiement: "Mobile money", statut: "Réservée" } },
    { id: 201, nom: "Chambre 201",
      jours: [
        { jour: "Lun", statut: "occupee", label: "Occupée" },
        { jour: "Mar", statut: "occupee", label: "Occupée" },
        { jour: "Mer", statut: "payee", label: "Payée" },
        { jour: "Jeu", statut: "libre", label: "Libre" },
        { jour: "Ven", statut: "libre", label: "Libre" },
        { jour: "Sam", statut: "reservee", label: "Réservée" },
        { jour: "Dim", statut: "reservee", label: "Réservée" }
      ],
      client: { nom: "Dr. Bamba", acompte: "50 000 F", solde: "25 000 F", paiement: "Espèces", statut: "Occupée" } },
    { id: 301, nom: "Suite mer",
      jours: [
        { jour: "Lun", statut: "libre", label: "Libre" },
        { jour: "Mar", statut: "libre", label: "Libre" },
        { jour: "Mer", statut: "libre", label: "Libre" },
        { jour: "Jeu", statut: "reservee", label: "Réservée" },
        { jour: "Ven", statut: "reservee", label: "Réservée" },
        { jour: "Sam", statut: "occupee", label: "Occupée" },
        { jour: "Dim", statut: "occupee", label: "Occupée" }
      ],
      client: { nom: "M. & Mme Kouassi", acompte: "60 000 F", solde: "60 000 F", paiement: "Virement bancaire", statut: "Réservée" } }
];

let chambreActiveIndex = 1; // Chambre 102 par défaut (Figma)

function afficherPlanningChambres() {
    const tbody = document.getElementById('planningChambresTbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    donneesPlanningChambres.forEach((ch, idx) => {
        const tr = document.createElement('tr');

        let cellsHtml = `<td class="room-row-label">${ch.nom}</td>`;
        ch.jours.forEach(j => {
            cellsHtml += `
                <td class="cell-planning-slot">
                    <span class="slot-pill ${j.statut}" onclick="selectionnerChambre(${idx}, '${j.jour}')">
                        ${j.label}
                    </span>
                </td>
            `;
        });

        tr.innerHTML = cellsHtml;
        tbody.appendChild(tr);
    });

    mettreAJourBandeauClientChambre();
}

function selectionnerChambre(idx, jour) {
    chambreActiveIndex = idx;
    mettreAJourBandeauClientChambre();
    const ch = donneesPlanningChambres[idx];
    afficherToast(`${ch.nom} sélectionnée (${jour})`);
}

function mettreAJourBandeauClientChambre() {
    const ch = donneesPlanningChambres[chambreActiveIndex];
    const nameEl = document.getElementById('roomClientName');
    const metaEl = document.getElementById('roomClientMeta');
    if (ch && ch.client && nameEl && metaEl) {
        nameEl.innerText = `${ch.client.nom} · ${ch.nom}`;
        metaEl.innerText = `Acompte ${ch.client.acompte} · Solde restant ${ch.client.solde} · ${ch.client.paiement}`;
    }
}

function actionCheckIn() {
    const ch = donneesPlanningChambres[chambreActiveIndex];
    ch.client.solde = "0 F (Réglé)";
    mettreAJourBandeauClientChambre();
    afficherToast(`Check-in validé pour ${ch.client.nom} (${ch.nom})`);
}

function actionCheckOut() {
    const ch = donneesPlanningChambres[chambreActiveIndex];
    afficherToast(`Check-out effectué avec succès pour ${ch.client.nom} (${ch.nom})`);
}

function ouvrirNouvelleReservationChambre() {
    const client = prompt("Nom du client pour la réservation :", "Nouveau client");
    if (!client) return;
    afficherToast(`Réservation enregistrée pour ${client} !`);
}

// ── MODULE GESTION DU STOCK (FIGMA 5) ──
const donneesStock = [
    { id: 1, produit: "Poisson braisé", qte: 12, seuil: 1 },
    { id: 2, produit: "Alloco",         qte: 8,  seuil: 1 },
    { id: 3, produit: "Eau",            qte: 24, seuil: 1 },
    { id: 4, produit: "Riz",            qte: 15, seuil: 1 },
    { id: 5, produit: "Bissap",         qte: 1,  seuil: 1 },
    { id: 6, produit: "Bière locale",   qte: 0,  seuil: 1 }
];

function afficherStock() {
    const tbody = document.getElementById('stockTbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    donneesStock.forEach(item => {
        const estManquant = item.qte <= item.seuil;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="stock-prod-name">${item.produit}</td>
            <td>
                <span class="stock-badge-qte ${estManquant ? 'red' : 'green'}">
                    ${item.qte}
                </span>
            </td>
            <td>${item.seuil}</td>
            <td>
                <span class="stock-statut-pill ${estManquant ? 'manquant' : 'dispo'}">
                    ${estManquant ? 'Manquant' : 'Disponible'}
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function ajusterStock(id, diff) {
    const item = donneesStock.find(p => p.id === id);
    if (!item) return;
    item.qte = Math.max(0, item.qte + diff);
    afficherStock();
    if (item.qte <= item.seuil) {
        afficherToast(`Alerte stock : ${item.produit} est maintenant MANQUANT (${item.qte})`);
    } else {
        afficherToast(`Stock mis à jour : ${item.produit} (${item.qte})`);
    }
}

function signalerProduitManquantPrompt() {
    const prod = prompt("Quel produit souhaitez-vous signaler comme manquant ?", "Poisson braisé");
    if (!prod) return;
    const item = donneesStock.find(p => p.produit.toLowerCase().includes(prod.toLowerCase()));
    if (item) {
        item.qte = 0;
        afficherStock();
        afficherToast(`Alerte signalée : ${item.produit} est épuisé.`);
    } else {
        afficherToast(`Alerte transmise au gérant pour : ${prod}`);
    }
}

function afficherToast(message) {
    const toast = document.getElementById('toastNotif');
    document.getElementById('toastText').innerText = message;
    toast.style.display = 'flex';
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.style.display = 'none';
    }, 2500);
}

// ══════════════════════════════════════════════════════════
// ESPACE GÉRANT — JavaScript (réservé au compte gérant)
// ══════════════════════════════════════════════════════════

const donneesRapport = {
    semaine: [
        { jour: 'Lundi',    resto: 262000, hotel: 180000 },
        { jour: 'Mardi',    resto: 248000, hotel: 150000 },
        { jour: 'Mercredi', resto: 280000, hotel: 176000 },
        { jour: 'Jeudi',    resto: 290000, hotel: 168000 },
        { jour: 'Vendredi', resto: 310000, hotel: 190000 },
        { jour: 'Samedi',   resto: 320000, hotel: 210000 },
        { jour: 'Dimanche', resto: 270000, hotel: 186000 }
    ],
    jour: [
        { jour: 'Matin', resto: 48000,  hotel: 30000 },
        { jour: 'Midi',  resto: 95000,  hotel: 55000 },
        { jour: 'Soir',  resto: 137000, hotel: 95000 }
    ],
    mois: [
        { jour: 'Semaine 1', resto: 1750000, hotel: 1100000 },
        { jour: 'Semaine 2', resto: 1980000, hotel: 1260000 },
        { jour: 'Semaine 3', resto: 1820000, hotel: 1150000 },
        { jour: 'Semaine 4', resto: 2100000, hotel: 1400000 }
    ]
};
const titresRapport = {
    semaine: 'Rapport de ventes · semaine du 12 au 18 octobre',
    jour:    'Rapport de ventes · aujourd\'hui',
    mois:    'Rapport de ventes · octobre 2024'
};
let periodeRapportActive = 'semaine';

function formatF(n) {
    return n.toLocaleString('fr-FR') + ' F';
}

// Navigation espace gérant
function changerOngletGerant(onglet) {
    if (roleConnecte !== 'gerant') return; // sécurité d'affichage (le serveur vérifie aussi)

    ['gNavDashboard','gNavStock','gNavRapports'].forEach(id => {
        document.getElementById(id).classList.remove('active');
    });
    ['gScreenDashboard','gScreenStock','gScreenRapports'].forEach(id => {
        document.getElementById(id).classList.remove('active');
    });

    if (onglet === 'dashboard') {
        document.getElementById('gNavDashboard').classList.add('active');
        document.getElementById('gScreenDashboard').classList.add('active');
    } else if (onglet === 'stock') {
        document.getElementById('gNavStock').classList.add('active');
        document.getElementById('gScreenStock').classList.add('active');
        afficherStockGerant();
    } else if (onglet === 'rapports') {
        document.getElementById('gNavRapports').classList.add('active');
        document.getElementById('gScreenRapports').classList.add('active');
        afficherRapport(periodeRapportActive);
    }
}

// Changer période tableau de bord
function changerPeriodeDash(periode, btn) {
    document.querySelectorAll('#gDashTabs .periode-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// ── STOCK GÉRANT ──
function afficherStockGerant() {
    const tbody = document.getElementById('gStockTbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    donneesStock.forEach(item => {
        const estManquant = item.qte <= item.seuil;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="stock-prod-name">${item.produit}</td>
            <td>
                <span class="stock-badge-qte ${estManquant ? 'red' : 'green'}">${item.qte}</span>
            </td>
            <td>${item.seuil}</td>
            <td>
                <span class="stock-statut-pill ${estManquant ? 'manquant' : 'dispo'}">
                    ${estManquant ? 'Manquant' : 'Disponible'}
                </span>
            </td>
            <td>
                <button class="btn-stock-modifier" onclick="ouvrirModifierProduit(${item.id})">Modifier</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function ouvrirModifierProduit(id) {
    const item = donneesStock.find(p => p.id === id);
    if (!item) return;
    const nouvelleQte = prompt(`Modifier la quantité de "${item.produit}" (actuel : ${item.qte}) :`, item.qte);
    if (nouvelleQte === null) return;
    const qte = parseInt(nouvelleQte);
    if (!isNaN(qte) && qte >= 0) {
        item.qte = qte;
        afficherStockGerant();
        afficherStock();
        afficherToast(`Stock mis à jour : ${item.produit} → ${qte}`);
    }
}

// Modal ajouter produit
function ouvrirModalAjouterProduit() {
    document.getElementById('inputNomProduit').value = '';
    document.getElementById('inputQteProduit').value = '10';
    document.getElementById('inputSeuilProduit').value = '1';
    document.getElementById('modalAjouterProduit').classList.add('active');
}
function fermerModalAjouterProduit(e) {
    if (e && e.target !== document.getElementById('modalAjouterProduit')) return;
    document.getElementById('modalAjouterProduit').classList.remove('active');
}
function confirmerAjoutProduit() {
    const nom   = document.getElementById('inputNomProduit').value.trim();
    const qte   = parseInt(document.getElementById('inputQteProduit').value) || 0;
    const seuil = parseInt(document.getElementById('inputSeuilProduit').value) || 1;
    if (!nom) { alert('Veuillez saisir un nom de produit.'); return; }
    const newId = donneesStock.length ? Math.max(...donneesStock.map(p => p.id)) + 1 : 1;
    donneesStock.push({ id: newId, produit: nom, qte, seuil });
    document.getElementById('modalAjouterProduit').classList.remove('active');
    afficherStockGerant();
    afficherStock();
    afficherToast(`Produit ajouté : ${nom} (${qte} en stock)`);
}

// ── RAPPORTS ──
function changerPeriodeRapport(periode, btn) {
    document.querySelectorAll('#gRapportTabs .periode-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    periodeRapportActive = periode;
    afficherRapport(periode);
}

function afficherRapport(periode) {
    const lignes = donneesRapport[periode];
    const tbody = document.getElementById('rapportTbody');
    const titleEl = document.getElementById('rapportTableTitle');
    if (!tbody || !lignes) return;

    titleEl.textContent = titresRapport[periode];
    tbody.innerHTML = '';

    let totalResto = 0, totalHotel = 0;
    lignes.forEach(l => {
        totalResto += l.resto;
        totalHotel += l.hotel;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${l.jour}</td>
            <td>${formatF(l.resto)}</td>
            <td>${formatF(l.hotel)}</td>
            <td style="font-weight:700;">${formatF(l.resto + l.hotel)}</td>
        `;
        tbody.appendChild(tr);
    });

    const trTotal = document.createElement('tr');
    trTotal.className = 'total-row';
    trTotal.innerHTML = `
        <td>Total</td>
        <td>${formatF(totalResto)}</td>
        <td>${formatF(totalHotel)}</td>
        <td>${formatF(totalResto + totalHotel)}</td>
    `;
    tbody.appendChild(trTotal);

    const grand = totalResto + totalHotel;
    const pResto = grand > 0 ? Math.round(totalResto / grand * 100) : 0;
    const pHotel = grand > 0 ? Math.round(totalHotel / grand * 100) : 0;
    document.getElementById('rapportKpiTotal').textContent = formatF(grand);
    document.getElementById('rapportKpiResto').textContent = pResto + ' %';
    document.getElementById('rapportKpiHotel').textContent = pHotel + ' %';
}

// ── EXPORTS ──
function exporterPDF(source) {
    afficherToast('Génération du PDF en cours...');
    setTimeout(() => {
        window.print();
    }, 400);
}

function exporterExcel(source) {
    const lignes = donneesRapport[periodeRapportActive];
    if (!lignes) return;
    let csv = 'Jour,Restaurant (F),Hôtel (F),Total (F)\n';
    let tR = 0, tH = 0;
    lignes.forEach(l => {
        csv += `${l.jour},${l.resto},${l.hotel},${l.resto + l.hotel}\n`;
        tR += l.resto; tH += l.hotel;
    });
    csv += `Total,${tR},${tH},${tR + tH}\n`;

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rapport_binguiss_' + periodeRapportActive + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    afficherToast('Export Excel (CSV) téléchargé.');
}

// ══════════════════════════════════════════════════════════
// DÉMARRAGE : toujours l'écran de connexion d'abord
// ══════════════════════════════════════════════════════════
afficherTables();
afficherEcran('login');
restaurerSession();

// Synchronisation automatique des commandes toutes les 5 secondes (uniquement si connecté)
setInterval(chargerCommandesDepuisBackend, 5000);