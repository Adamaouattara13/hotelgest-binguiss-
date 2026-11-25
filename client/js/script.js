/* ══════════════════════════════════════════════════════════
           BASE DE DONNÉES DU MENU (CONFORME AUX VRAIS PRIX DU CLIENT)
           ══════════════════════════════════════════════════════════ */
        let CATALOGUE = [
            // ── PLATS (POISSONS, VIANDES & PÂTES) ──
            { id: 1, nom: "Capitaine / Bar / Daurade Braisé", desc: "Poisson frais du jour braisé avec alloco", prix: 8000, categorie: "plats", emoji: "🐟", img: "images/poisson_braise.jpg" },
            { id: 2, nom: "Poulet Braisé ou Kedjénou (Demi)", desc: "Recette traditionnelle ivoirienne mijotée", prix: 4000, categorie: "plats", emoji: "🍗", img: "images/poulet_kedjenou.jpg" },
            { id: 3, nom: "Poulet Braisé ou Kedjénou (Entier)", desc: "Poulet entier assaisonné au canari", prix: 7000, categorie: "plats", emoji: "🍗", img: "images/poulet_kedjenou.jpg" },
            { id: 4, nom: "Lapin Braisé ou Kedjénou (Demi)", desc: "Spécialité locale savoureuse", prix: 8500, categorie: "plats", emoji: "🍖", img: "images/menu.png" },
            { id: 5, nom: "Lapin Braisé ou Kedjénou (Entier)", desc: "Plat généreux", prix: 15000, categorie: "plats", emoji: "🍖", img: "images/menu.png" },
            { id: 6, nom: "Poulet Africain ou Pondeuse (Demi)", desc: "Saveur authentique", prix: 7500, categorie: "plats", emoji: "🍗", img: "images/poulet_kedjenou.jpg" },
            { id: 7, nom: "Pintade Braisée ou Kedjénou (Demi)", desc: "Pintade braisée aux aromates", prix: 7500, categorie: "plats", emoji: "🍗", img: "images/poulet_kedjenou.jpg" },
            { id: 8, nom: "Poulet Binguiss / Sauté", desc: "Recette signature de la maison", prix: 10000, categorie: "plats", emoji: "✨", img: "images/poulet_kedjenou.jpg" },
            { id: 9, nom: "Brochettes de Filet de Bœuf", desc: "Viande tendre marinée et grillée", prix: 7000, categorie: "plats", emoji: "🍢", img: "images/menu.png" },
            { id: 10, nom: "Filet de Bœuf (Sauce au choix)", desc: "Sauce poivre, roquefort ou échalote", prix: 10000, categorie: "plats", emoji: "🥩", img: "images/menu.png" },
            { id: 11, nom: "Entrecôte Maître d'Hôtel", desc: "Grillée minute au beurre persillé", prix: 8000, categorie: "plats", emoji: "🥩", img: "images/menu.png" },
            { id: 12, nom: "Sole Meunière", desc: "Sole fraîche dorée au beurre", prix: 8000, categorie: "plats", emoji: "🐟", img: "images/poisson_braise.jpg" },
            { id: 13, nom: "Filet de Sole ou Mérou", desc: "Filet fondant", prix: 10000, categorie: "plats", emoji: "🐠", img: "images/poisson_braise.jpg" },
            { id: 14, nom: "Brochettes de Mérou", desc: "Dés de mérou grillés aux oignons", prix: 8000, categorie: "plats", emoji: "🍢", img: "images/menu.png" },
            { id: 15, nom: "Langouste Braisée", desc: "Grande langouste grillée au feu de bois", prix: 15000, categorie: "plats", emoji: "🦞", img: "images/menu.png" },
            { id: 16, nom: "Gambas Braisée ou Sautée", desc: "Gambas fraîches relevées", prix: 14000, categorie: "plats", emoji: "🦐", img: "images/menu.png" },
            { id: 17, nom: "Calamar Frit aux Légumes", desc: "Calamars croustillants sautés", prix: 7000, categorie: "plats", emoji: "🦑", img: "images/menu.png" },
            { id: 18, nom: "Brochettes d'Escargots", desc: "Escargots géants épicés", prix: 7000, categorie: "plats", emoji: "🐌", img: "images/menu.png" },
            { id: 19, nom: "Crabes de Mer Mayonnaise", desc: "Crabes frais décortiqués", prix: 8000, categorie: "plats", emoji: "🦀", img: "images/menu.png" },
            { id: 20, nom: "Marmite du Pêcheur", desc: "Poissons et fruits de mer cuisinés", prix: 15000, categorie: "plats", emoji: "🍲", img: "images/menu.png" },
            { id: 21, nom: "Spaghettis à la Milanaise", desc: "Sauce tomate maison & parmesan", prix: 5000, categorie: "plats", emoji: "🍝", img: "images/menu.png" },
            { id: 22, nom: "Spaghettis à la Bolognaise", desc: "Bœuf haché mijoté aux herbes", prix: 6000, categorie: "plats", emoji: "🍝", img: "images/menu.png" },
            { id: 23, nom: "Spaghettis aux Crevettes", desc: "Crevettes sautées à l'ail", prix: 7500, categorie: "plats", emoji: "🍝", img: "images/menu.png" },
            { id: 24, nom: "Spaghettis aux Écrevisses", desc: "Spécialité aux écrevisses fraîches", prix: 8500, categorie: "plats", emoji: "🍝", img: "images/menu.png" },

            // ── ENTRÉES ──
            { id: 40, nom: "Avocat Crevettes", desc: "Avocat frais et crevettes sauce cocktail", prix: 6000, categorie: "entrees", emoji: "🥑", img: "images/menu.png" },
            { id: 41, nom: "Salade Niçoise", desc: "Thon, œufs, légumes croquants", prix: 6000, categorie: "entrees", emoji: "🥗", img: "images/menu.png" },
            { id: 42, nom: "Salade Composée", desc: "Mélange de crudités fraîches", prix: 3000, categorie: "entrees", emoji: "🥗", img: "images/menu.png" },
            { id: 43, nom: "Salade de foie ou gésier", desc: "Gésiers de volailles confits tièdes", prix: 3500, categorie: "entrees", emoji: "🥗", img: "images/menu.png" },
            { id: 44, nom: "Salade Verte", desc: "Salade du marché et vinaigrette", prix: 2500, categorie: "entrees", emoji: "🥬", img: "images/menu.png" },
            { id: 45, nom: "Crevette Sautée", desc: "Crevettes sautées à l'ail et persil", prix: 6500, categorie: "entrees", emoji: "🍤", img: "images/menu.png" },
            { id: 46, nom: "Beignets de Crevettes", desc: "Beignets dorés croustillants", prix: 6000, categorie: "entrees", emoji: "🍤", img: "images/menu.png" },
            { id: 47, nom: "Cuisses de Grenouilles Sautées", desc: "Aux fines herbes", prix: 7000, categorie: "entrees", emoji: "🐸", img: "images/menu.png" },
            { id: 48, nom: "Écrevisses Sautées", desc: "Écrevisses fraîches sautées", prix: 7000, categorie: "entrees", emoji: "🦐", img: "images/menu.png" },
            { id: 49, nom: "Écrevisses Bassamoises", desc: "Spécialité locale de Grand-Bassam", prix: 8000, categorie: "entrees", emoji: "🦐", img: "images/menu.png" },

            // ── ACCOMPAGNEMENTS (VRAIS PRIX CLIENT) ──
            { id: 60, nom: "Alloco", desc: "Bananes plantains frites bien dorées", prix: 1000, categorie: "accompagnements", emoji: "🍌", img: "images/alloco_dore.jpg" },
            { id: 61, nom: "Attiéké", desc: "Semoule de manioc traditionnelle", prix: 1000, categorie: "accompagnements", emoji: "🍚", img: "images/menu.png" },
            { id: 62, nom: "Frites de Pommes de Terre", desc: "Frites croustillantes maison", prix: 1000, categorie: "accompagnements", emoji: "🍟", img: "images/menu.png" },
            { id: 63, nom: "Frites d'Ignames", desc: "Bâtonnets d'igname frits", prix: 1500, categorie: "accompagnements", emoji: "🍟", img: "images/menu.png" },
            { id: 64, nom: "Frites de Patates Douces", desc: "Patates douces dorées", prix: 1500, categorie: "accompagnements", emoji: "🍠", img: "images/menu.png" },
            { id: 65, nom: "Riz", desc: "Portion de riz blanc parfumé", prix: 1000, categorie: "accompagnements", emoji: "🍚", img: "images/menu.png" },
            { id: 66, nom: "Haricot Vert", desc: "Haricots verts sautés au beurre", prix: 1500, categorie: "accompagnements", emoji: "🌱", img: "images/menu.png" },
            { id: 67, nom: "Pommes de Terre Sautées aux Herbes", desc: "Pommes rissolées assaisonnées", prix: 2500, categorie: "accompagnements", emoji: "🥔", img: "images/menu.png" },
            { id: 68, nom: "Pommes de Terre Vapeur", desc: "Pommes fondantes à la vapeur", prix: 1500, categorie: "accompagnements", emoji: "🥔", img: "images/menu.png" },

            // ── BOISSONS (VRAIS PRIX CLIENT) ──
            { id: 80, nom: "Bières", desc: "Bock 65cl ou bières locales fraîches", prix: 1500, categorie: "boissons", emoji: "🍺", img: "images/menu.png" },
            { id: 81, nom: "Sucreries classiques", desc: "Coca, Fanta, Sprite, etc.", prix: 1000, categorie: "boissons", emoji: "🥤", img: "images/menu.png" },
            { id: 82, nom: "Jus Naturel (Bissap / Gingembre)", desc: "100% fruits frais pressés à la menthe", prix: 3000, categorie: "boissons", emoji: "🍹", img: "images/jus_bissap.jpg" },
            { id: 83, nom: "Energy Red Bull", desc: "Canette fraîche", prix: 1500, categorie: "boissons", emoji: "⚡", img: "images/menu.png" },
            { id: 84, nom: "Eau Minérale 1.5L", desc: "Fraîche", prix: 1000, categorie: "boissons", emoji: "💧", img: "images/menu.png" },
            { id: 85, nom: "Cocktails classiques", desc: "Cocktail alcoolisé ou sans alcool", prix: 3000, categorie: "boissons", emoji: "🍸", img: "images/menu.png" },
            { id: 86, nom: "Petit Déjeuner Complet", desc: "Pain frais, café/chocolat, œufs, jus", prix: 2500, categorie: "boissons", emoji: "🥐", img: "images/menu.png" },
            { id: 87, nom: "Café / Thé", desc: "Tasse fumante", prix: 1000, categorie: "boissons", emoji: "☕", img: "images/menu.png" },
            { id: 88, nom: "Liqueur - Apéritif", desc: "Le verre", prix: 1500, categorie: "boissons", emoji: "🥃", img: "images/menu.png" },
            { id: 89, nom: "Digestif", desc: "Le verre", prix: 2000, categorie: "boissons", emoji: "🍷", img: "images/menu.png" },

            // ── DESSERTS (VRAIS PRIX CLIENT) ──
            { id: 90, nom: "Bananes Flambées ou Ananas", desc: "Flambées au rhum", prix: 3000, categorie: "desserts", emoji: "🍌", img: "images/menu.png" },
            { id: 91, nom: "Ananas Pirogue", desc: "Découpé en pirogue rafraîchissante", prix: 1500, categorie: "desserts", emoji: "🍍", img: "images/menu.png" },
            { id: 92, nom: "Assiette de Fruits Frais", desc: "Fruits de saison découpés", prix: 2000, categorie: "desserts", emoji: "🍉", img: "images/menu.png" },
            { id: 93, nom: "Salade de Fruits", desc: "Mélange fruité frais", prix: 2000, categorie: "desserts", emoji: "🍓", img: "images/menu.png" },
            { id: 94, nom: "Crêpe au Chocolat", desc: "Crêpe maison nappée de chocolat", prix: 3000, categorie: "desserts", emoji: "🥞", img: "images/menu.png" },

            // ── CHAMBRES HÔTEL (PHOTOS RÉELLES DU CLIENT) ──
            { id: 201, nom: "Chambre vue mer", desc: "Climatisée, grand lit, balcon vue mer", prix: 35000, categorie: "chambres", emoji: "🛏️", img: "images/chambre.png" },
            { id: 202, nom: "Suite mer prestige (N° 101)", desc: "Chambre spacieuse 101, salon, vue océan", prix: 60000, categorie: "chambres", emoji: "🌊", img: "images/101img.png" },
            { id: 203, nom: "Chambre standard confort", desc: "Calme côté couloir jardin fleuri", prix: 25000, categorie: "chambres", emoji: "🌴", img: "images/couloir des chambres.png" },
            { id: 204, nom: "Chambre confort N° 101 bis", desc: "Avec salle de bain moderne équipée", prix: 30000, categorie: "chambres", emoji: "🚿", img: "images/101.png" }
        ];

        /* ÉTAT INITIAL DU PANIER : VIDE PAR DÉFAUT (0 ARTICLE) */
        let panier = [];

        let modeCommande = 'livraison';
        let chambreSelectionnee = { nom: "Chambre vue mer", prixNuit: 35000, nuits: 2 };
        let typeReservation = 'chambre';
        const TELEPHONE_WHATSAPP = "2250707896106"; // Numéro officiel du restaurant

        /* ── CHARGEMENT DYNAMIQUE DU MENU DEPUIS LE BACKEND PYTHON ── */
        async function chargerMenuDepuisBackend() {
            try {
                const res = await fetch('/api/menu');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        CATALOGUE = data;
                        console.log("✅ Menu chargé depuis le backend SQLite :", data.length, "plats reçus");
                        afficherMenu('plats');
                    }
                }
            } catch (err) {
                console.log("Mode local autonome : catalogue local actif.");
            }
        }

        /* ── INITIALISATION ── */
        document.addEventListener("DOMContentLoaded", () => {
            // Charger le menu depuis le backend (API REST)
            chargerMenuDepuisBackend();

            // Charger éventuel panier existant en localStorage et synchroniser avec les vrais prix
            const saved = localStorage.getItem("panierBinguiss");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        panier = parsed.map(p => {
                            const found = CATALOGUE.find(c => c.id === p.id || c.nom === p.nom);
                            if (found) {
                                return { ...p, nom: found.nom, prix: found.prix };
                            }
                            return p;
                        });
                    }
                } catch(e) {}
            }

            afficherMenu('plats');
            mettreAJourInterfacePanier();
            calculerSejour();

            // Gestion du hash d'URL (#menu, #reserver, #commande)
            if (window.location.hash) {
                const target = window.location.hash.replace('#', '');
                if (['accueil', 'menu', 'reserver', 'commande', 'confirmation'].includes(target)) {
                    naviguerVers(target);
                }
            }
        });

        /* ── ROUTEUR / NAVIGATION ── */
        function naviguerVers(viewId) {
            document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
            const targetSec = document.getElementById('view-' + viewId);
            if (targetSec) {
                targetSec.classList.add('active');
            }

            // Mettre à jour les liens de navigation Desktop
            document.querySelectorAll('.desktop-nav .nav-link').forEach(link => {
                if (link.dataset.view === viewId) link.classList.add('active');
                else link.classList.remove('active');
            });

            // Mettre à jour la TabBar Mobile
            document.querySelectorAll('.bottom-nav-item').forEach(btn => {
                if (btn.dataset.view === viewId) btn.classList.add('active');
                else btn.classList.remove('active');
            });

            // Barre flottante du panier : visible uniquement sur l'écran Menu si le panier contient des articles
            gererVisibiliteBarreFlottante(viewId);

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        /* ── GESTION DE L'AFFICHAGE DU MENU ── */
        function filtrerMenu(categorie, btnElement) {
            document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
            if (btnElement) btnElement.classList.add('active');
            afficherMenu(categorie);
        }

        function afficherMenu(categorie) {
            const container = document.getElementById("menuItemsContainer");
            const items = CATALOGUE.filter(item => item.categorie === categorie);

            container.innerHTML = items.map(item => `
                <div class="menu-item-card">
                    <div class="item-visual">
                        <img src="${item.img}" alt="${item.nom}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <span class="item-visual-fallback" style="display:none;">${item.emoji}</span>
                    </div>
                    <div class="item-details">
                        <h4 class="item-title">${item.nom}</h4>
                        <p class="item-desc">${item.desc}</p>
                        <div class="item-price">${formatterPrix(item.prix)} F</div>
                    </div>
                    <button class="btn-add-item" onclick="ajouterAuPanier(${item.id})" title="Ajouter au panier">+</button>
                </div>
            `).join('');
        }

        /* ── GESTION DU PANIER ── */
        function ajouterAuPanier(itemId) {
            const item = CATALOGUE.find(i => i.id === itemId);
            if (!item) return;

            const existing = panier.find(p => p.id === itemId || p.nom === item.nom);
            if (existing) {
                existing.quantite += 1;
            } else {
                panier.push({
                    id: item.id,
                    nom: item.nom,
                    prix: item.prix,
                    quantite: 1
                });
            }

            sauvegarderPanier();
            mettreAJourInterfacePanier();
            afficherToast(`${item.nom} ajouté au panier`);
        }

        function modifierQuantite(index, delta) {
            if (!panier[index]) return;
            panier[index].quantite += delta;
            if (panier[index].quantite <= 0) {
                panier.splice(index, 1);
            }
            sauvegarderPanier();
            mettreAJourInterfacePanier();
        }

        function sauvegarderPanier() {
            localStorage.setItem("panierBinguiss", JSON.stringify(panier));
        }

        function viderPanier() {
            panier = [];
            localStorage.removeItem("panierBinguiss");
            mettreAJourInterfacePanier();
        }

        function mettreAJourInterfacePanier() {
            const nbArticles = panier.reduce((sum, item) => sum + item.quantite, 0);
            const total = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);

            // Badges Header & Nav
            const headerBadge = document.getElementById("headerCartCount");
            if (headerBadge) headerBadge.innerText = nbArticles;
            const bottomBadge = document.getElementById("bottomNavBadge");
            if (bottomBadge) {
                if (nbArticles > 0) {
                    bottomBadge.style.display = "flex";
                    bottomBadge.innerText = nbArticles;
                } else {
                    bottomBadge.style.display = "none";
                }
            }

            // Barre flottante du menu
            const floatText = document.getElementById("floatingCartText");
            if (floatText) floatText.innerText = `Voir le panier · ${nbArticles} article${nbArticles > 1 ? 's' : ''}`;
            const floatTotal = document.getElementById("floatingCartTotal");
            if (floatTotal) floatTotal.innerText = `${formatterPrix(total)} F`;

            // Écran "Votre commande" (Écran 10)
            const summaryList = document.getElementById("orderItemsSummaryList");
            if (summaryList) {
                if (panier.length === 0) {
                    summaryList.innerHTML = `
                        <div style="text-align:center; padding:30px 10px; color:var(--text-muted);">
                            <div style="font-size:2.2rem; margin-bottom:8px;">🛒</div>
                            <p style="font-weight:700; color:var(--navy); margin-bottom:4px; font-size:1rem;">Votre panier est vide</p>
                            <p style="font-size:0.85rem; margin-bottom:14px;">Parcourez notre carte et ajoutez vos plats préférés !</p>
                            <button onclick="naviguerVers('menu')" style="background:var(--navy); color:#fff; border:none; padding:9px 18px; border-radius:999px; cursor:pointer; font-weight:700; font-size:0.85rem;">Parcourir le menu</button>
                        </div>
                    `;
                } else {
                    const headerHTML = `
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #eee;">
                            <span style="font-size:0.85rem; font-weight:700; color:var(--navy);">${nbArticles} article${nbArticles > 1 ? 's' : ''} sélectionné${nbArticles > 1 ? 's' : ''}</span>
                            <button onclick="viderPanier()" style="background:none; border:none; color:#c0392b; font-size:0.8rem; font-weight:600; cursor:pointer; text-decoration:underline;">Tout vider</button>
                        </div>
                    `;
                    const rowsHTML = panier.map((item, index) => `
                        <div class="order-item-row">
                            <div class="order-item-left">
                                <span class="order-qty-tag">${item.quantite} ×</span>
                                <span>${item.nom}</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:10px;">
                                <span class="order-item-price">${formatterPrix(item.prix * item.quantite)} F</span>
                                <div style="display:flex; gap:4px;">
                                    <button style="width:24px; height:24px; border-radius:50%; border:1px solid #ddd; background:#f5f5f5; cursor:pointer;" onclick="modifierQuantite(${index}, -1)">-</button>
                                    <button style="width:24px; height:24px; border-radius:50%; border:1px solid #ddd; background:#f5f5f5; cursor:pointer;" onclick="modifierQuantite(${index}, 1)">+</button>
                                </div>
                            </div>
                        </div>
                    `).join('');
                    summaryList.innerHTML = headerHTML + rowsHTML;
                }
            }

            document.getElementById("orderCartTotalAmount").innerText = `${formatterPrix(total)} F`;

            // Déterminer la visibilité de la barre flottante
            const currentActive = document.querySelector('.view-section.active');
            if (currentActive) gererVisibiliteBarreFlottante(currentActive.id.replace('view-', ''));
        }

        function gererVisibiliteBarreFlottante(viewId) {
            const bar = document.getElementById("floatingCartBar");
            const nbArticles = panier.reduce((sum, item) => sum + item.quantite, 0);

            if (viewId === 'menu' && nbArticles > 0) {
                bar.classList.add('visible');
            } else {
                bar.classList.remove('visible');
            }
        }

        /* ── GESTION DES COMMANDES (ÉCRANS 10 & 11) ── */
        function toggleModeCommande(mode) {
            modeCommande = mode;
            document.getElementById("btnTabEmporter").classList.toggle('active', mode === 'emporter');
            document.getElementById("btnTabLivraison").classList.toggle('active', mode === 'livraison');

            const groupAdresse = document.getElementById("groupAdresse");
            if (mode === 'emporter') {
                groupAdresse.style.display = 'none';
            } else {
                groupAdresse.style.display = 'block';
            }
        }

        async function envoyerCommande() {
            if (panier.length === 0) {
                alert("Votre panier est vide. Veuillez ajouter un article du menu.");
                naviguerVers('menu');
                return;
            }

            const nom = document.getElementById("clientNom").value.trim() || "Client";
            const tel = document.getElementById("clientTel").value.trim() || "07 00 00 00 00";
            const adresse = document.getElementById("clientAdresse").value.trim() || (modeCommande === 'emporter' ? 'À emporter' : 'Non précisée');

            const totalLocal = panier.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
            let numeroCommande = Math.floor(100 + Math.random() * 900);
            let commandeEnvoyee = false;

            // 1. Envoi au Backend Flask / SQLite
            try {
                const payload = {
                    client_nom: nom,
                    client_telephone: tel,
                    type_commande: modeCommande,
                    adresse_ou_table: adresse,
                    articles: panier.map(item => ({ id: item.id, quantite: item.quantite }))
                };

                console.log("📤 Envoi commande au backend :", JSON.stringify(payload));

                const reponse = await fetch('/api/commandes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (reponse.ok) {
                    const data = await reponse.json();
                    if (data && data.reference) {
                        numeroCommande = data.reference;
                    }
                    commandeEnvoyee = true;
                    console.log("✅ Commande enregistrée dans la caisse :", data);
                } else {
                    const errTexte = await reponse.text();
                    console.error("❌ Erreur serveur (" + reponse.status + ") :", errTexte);
                    alert("Erreur serveur " + reponse.status + " : " + errTexte + "\n\nLa commande n'a pas été envoyée à la caisse.");
                }
            } catch (err) {
                console.error("❌ Connexion au serveur impossible :", err.message);
                alert("Impossible de joindre le serveur.\n\nVérifie que LANCER_LE_SERVEUR.bat est ouvert.\nErreur : " + err.message);
            }

            // 2. Mettre à jour l'écran de confirmation
            document.getElementById("confirmOrderNumber").innerText = `Commande ${numeroCommande}`;
            document.getElementById("confirmOrderDetails").innerText = `${modeCommande === 'livraison' ? 'Livraison' : 'À emporter'} · ${formatterPrix(totalLocal)} F`;

            // 3. Construire le message WhatsApp pré-rempli
            let message = `*COMMANDE LE BINGUISS (${numeroCommande})*\n\n`;
            message += `👤 *Nom :* ${nom}\n`;
            message += `📞 *Téléphone :* ${tel}\n`;
            message += `🛵 *Mode :* ${modeCommande === 'livraison' ? 'Livraison à domicile' : 'À emporter'}\n`;
            if (modeCommande === 'livraison' && adresse) {
                message += `📍 *Adresse :* ${adresse}\n`;
            }
            message += `\n*Détail de la commande :*\n`;
            panier.forEach(item => {
                message += `• ${item.quantite}x ${item.nom} (${formatterPrix(item.prix * item.quantite)} F)\n`;
            });
            message += `\n💰 *Total :* ${formatterPrix(totalLocal)} FCFA`;

            const urlWhatsApp = `https://wa.me/${TELEPHONE_WHATSAPP}?text=${encodeURIComponent(message)}`;
            document.getElementById("linkWhatsAppDirect").href = urlWhatsApp;

            // 4. VIDER LE PANIER ET RÉINITIALISER L'INTERFACE
            viderPanier();

            // 5. Aller à l'écran 5 de confirmation
            naviguerVers('confirmation');
            afficherToast("Commande transmise avec succès à la caisse !");
        }

        /* ── GESTION DES RÉSERVATIONS (ÉCRAN 9) ── */
        let tableSelectionnee = 'Terrasse panoramique vue mer';

        function toggleReservationType(type) {
            typeReservation = type;
            document.getElementById("btnTabChambre").classList.toggle('active', type === 'chambre');
            document.getElementById("btnTabTable").classList.toggle('active', type === 'table');

            document.getElementById("bookingChambreFields").style.display = type === 'chambre' ? 'block' : 'none';
            document.getElementById("bookingTableFields").style.display = type === 'table' ? 'block' : 'none';

            const container = document.getElementById("roomsContainer");
            const summaryNights = document.getElementById("summaryNightsText");
            const summaryTotal = document.getElementById("summaryBookingTotal");
            const btn = document.querySelector(".btn-submit-booking");

            if (type === 'table') {
                document.getElementById("labelDispoTitle").innerText = 'Emplacements disponibles';
                summaryNights.innerText = 'Table réservée';
                summaryTotal.innerText = 'Réservation sans frais';
                btn.innerText = 'Réserver cette table';

                container.innerHTML = `
                    <div class="room-card selected" onclick="selectionnerTable('Terrasse panoramique vue mer', this)">
                        <div class="room-visual">
                            <img src="place.png" alt="Terrasse vue mer">
                        </div>
                        <div class="room-info">
                            <h4 class="room-name">Terrasse panoramique vue mer</h4>
                            <div class="room-price">Face à l'océan</div>
                            <span class="badge-status">Disponible</span>
                        </div>
                    </div>
                    <div class="room-card" onclick="selectionnerTable('Paillote de plage privée', this)">
                        <div class="room-visual">
                            <img src="place4.png" alt="Paillote de plage">
                        </div>
                        <div class="room-info">
                            <h4 class="room-name">Paillote de plage privée</h4>
                            <div class="room-price">Ambiance cosy & intime</div>
                            <span class="badge-status">Disponible</span>
                        </div>
                    </div>
                    <div class="room-card" onclick="selectionnerTable('Table les pieds dans le sable', this)">
                        <div class="room-visual">
                            <img src="place6.png" alt="Table sur le sable">
                        </div>
                        <div class="room-info">
                            <h4 class="room-name">Table sur la plage</h4>
                            <div class="room-price">Coucher de soleil</div>
                            <span class="badge-status">Disponible</span>
                        </div>
                    </div>
                `;
            } else {
                document.getElementById("labelDispoTitle").innerText = 'Chambres disponibles';
                btn.innerText = 'Réserver cette chambre';
                container.innerHTML = `
                    <div class="room-card selected" onclick="selectionnerChambre('Chambre vue mer', 35000, this)">
                        <div class="room-visual">
                            <img src="chambre.png" alt="Chambre vue mer">
                        </div>
                        <div class="room-info">
                            <h4 class="room-name">Chambre vue mer</h4>
                            <div class="room-price">35 000 F / nuit</div>
                            <span class="badge-status">Libre</span>
                        </div>
                    </div>
                    <div class="room-card" onclick="selectionnerChambre('Suite mer prestige (N° 101)', 60000, this)">
                        <div class="room-visual">
                            <img src="101img.png" alt="Suite mer N° 101">
                        </div>
                        <div class="room-info">
                            <h4 class="room-name">Suite mer prestige (N° 101)</h4>
                            <div class="room-price">60 000 F / nuit</div>
                            <span class="badge-status">Libre</span>
                        </div>
                    </div>
                    <div class="room-card" onclick="selectionnerChambre('Chambre standard confort', 25000, this)">
                        <div class="room-visual">
                            <img src="couloir des chambres.png" alt="Chambre standard">
                        </div>
                        <div class="room-info">
                            <h4 class="room-name">Chambre standard confort</h4>
                            <div class="room-price">25 000 F / nuit</div>
                            <span class="badge-status">Libre</span>
                        </div>
                    </div>
                `;
                calculerSejour();
            }
        }

        function selectionnerTable(nom, element) {
            document.querySelectorAll(".room-card").forEach(c => c.classList.remove('selected'));
            element.classList.add('selected');
            tableSelectionnee = nom;
        }

        function selectionnerChambre(nom, prixNuit, element) {
            document.querySelectorAll(".room-card").forEach(c => c.classList.remove('selected'));
            element.classList.add('selected');
            chambreSelectionnee.nom = nom;
            chambreSelectionnee.prixNuit = prixNuit;
            calculerSejour();
        }

        function calculerSejour() {
            const nuits = 2; // Valeur maquette par défaut
            chambreSelectionnee.nuits = nuits;
            const total = chambreSelectionnee.prixNuit * nuits;

            document.getElementById("summaryNightsText").innerText = `${nuits} nuits`;
            document.getElementById("summaryBookingTotal").innerText = `${formatterPrix(total)} F`;
        }

        function confirmerReservation() {
            if (typeReservation === 'table') {
                const dateT = document.getElementById("dateTable").value || "Aujourd'hui";
                const heureT = document.getElementById("heureTable").value;
                const couvertsT = document.getElementById("couverts").value;

                let msg = `*RÉSERVATION DE TABLE LE BINGUISS*\n\n`;
                msg += `📍 *Emplacement :* ${tableSelectionnee}\n`;
                msg += `📅 *Date :* ${dateT}\n`;
                msg += `⏰ *Heure :* ${heureT}\n`;
                msg += `👥 *Couverts :* ${couvertsT} personne(s)\n\n`;
                msg += `Bonjour, je souhaite réserver une table chez vous s'il vous plaît.`;

                const url = `https://wa.me/${TELEPHONE_WHATSAPP}?text=${encodeURIComponent(msg)}`;
                window.open(url, '_blank');
                return;
            }

            const arrivee = document.getElementById("dateArrivee").value;
            const depart = document.getElementById("dateDepart").value;
            const personnes = document.getElementById("nbPersonnes").value;
            const total = chambreSelectionnee.prixNuit * chambreSelectionnee.nuits;

            let msg = `*RÉSERVATION DE SÉJOUR LE BINGUISS*\n\n`;
            msg += `🏨 *Chambre :* ${chambreSelectionnee.nom}\n`;
            msg += `📅 *Séjour :* Du ${arrivee} au ${depart} (${chambreSelectionnee.nuits} nuits)\n`;
            msg += `👥 *Occupants :* ${personnes} personne(s)\n`;
            msg += `💰 *Montant estimé :* ${formatterPrix(total)} FCFA\n\n`;
            msg += `Bonjour, je souhaite bloquer cette réservation de chambre s'il vous plaît.`;

            const url = `https://wa.me/${TELEPHONE_WHATSAPP}?text=${encodeURIComponent(msg)}`;
            window.open(url, '_blank');
        }



        /* ── NOTIFICATIONS TOAST ── */
        function afficherToast(message) {
            const toast = document.getElementById("toastNotify");
            document.getElementById("toastMessage").innerText = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }

        function formatterPrix(val) {
            return Number(val).toLocaleString('fr-FR');
        }