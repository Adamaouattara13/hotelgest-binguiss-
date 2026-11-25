# Cahier des charges : Système de gestion de l'Hôtel Restaurant Le Binguiss

Projet d'atelier de génie logiciel 15 octobre 2026


| Élément | Information |
|---|---|
| **Client** | Hôtel Restaurant Le Binguiss |
| **Porteur du projet** | Ouattara Adama |
| **Encadrant** | M. Sedrick Gaël Kouagni |
| **Date de remise** | 15 octobre 2026 |

## Sommaire

1. [Présentation de l'entreprise](#1-présentation-de-lentreprise)
2. [Présentation du projet](#2-présentation-du-projet)
3. [Utilisateurs et rôles](#3-utilisateurs-et-rôles)
4. [Besoins fonctionnels retenus](#4-besoins-fonctionnels-retenus)
5. [Règles de gestion](#5-règles-de-gestion)
6. [Base de données, sécurité et contraintes](#6-base-de-données-sécurité-et-contraintes)
7. [Écrans à prévoir](#7-écrans-à-prévoir)
8. [Points de divergence entre les deux documents](#8-points-de-divergence-entre-les-deux-documents)
9. [Résultat attendu](#9-résultat-attendu)
10. [Validation](#10-validation)

---

## 1. Présentation de l'entreprise

### 1.1 Identification

| Information | Détail |
|---|---|
| **Nom** | Hôtel Restaurant Le Binguiss |
| **Type** | Restaurant classique en bord de mer avec service hôtelier intégré |
| **Activités** | Restauration et hébergement hôtelier, regroupés dans un même établissement |
| **Caisse** | Un seul poste de caisse, avec deux sources d'entrée d'argent : le restaurant et l'hôtel |

### 1.2 Activités et services proposés

**Restaurant**
- Restauration sur place
- Vente à emporter
- Livraison et commandes à distance
- Réservation de tables

**Hôtel**
- Réservation et suivi des chambres d'hôtel
- Accueil des clients à l'arrivée et au départ, facturation et encaissement

> L'organisation d'événements (mariages, anniversaires) n'est pas retenue pour le moment. Voir le point 4.5.

### 1.3 Organisation et fonctionnement

L'Hôtel Restaurant Le Binguiss est un établissement en bord de mer qui réunit un restaurant et un hôtel. Les deux activités partagent une caisse unique, ce qui permet de regrouper toutes les entrées d'argent au même endroit tout en distinguant leur source (restaurant ou hôtel).

Deux profils utilisent le futur système :

- **Le caissier** tient la caisse. Il gère les commandes, la facturation, les paiements et le statut des chambres.
- **Le gérant (le patron)** suit l'activité, les entrées d'argent de chaque activité et le stock, et exporte les rapports en PDF.

Les clients passent par le site internet de l'établissement pour consulter le menu, les chambres et les tarifs, réserver une chambre ou une table, et commander à distance.

---

## 2. Présentation du projet

### 2.1 Contexte

Dans le cadre de l'atelier de génie logiciel, ce projet consiste à concevoir un système de gestion pour l'Hôtel Restaurant Le Binguiss, à partir des besoins exprimés par l'établissement.

### 2.2 Nature du projet

Conception d'une application de gestion avec interface web et base de données relationnelle.

### 2.3 Objectif général

Concevoir une application de gestion simple, centralisée et sécurisée, comprenant quelques écrans adaptés aux situations de travail de l'établissement : gestion des tables et des commandes, et réservations hôtelières. Le système doit réduire les tâches manuelles, faciliter le suivi des paiements et des stocks, et rendre les informations disponibles aux utilisateurs autorisés.

L'application s'appuie sur une base de données relationnelle qui centralise les opérations du restaurant et de l'hôtel dans une caisse principale. Cette caisse est gérée par un tableau de bord sécurisé par l'identifiant et le mot de passe du caissier.

### 2.4 Principes de fonctionnement

- Des écrans distincts selon les tâches : commandes, tables, chambres, paiements et stocks.
- Une base de données relationnelle commune au restaurant et à l'hôtel.
- Une caisse principale unique, avec un tableau de bord sécurisé.
- Une interface publique (site internet existant, à adapter) pour que les clients consultent les informations et fassent certaines demandes, sans accès à l'espace interne.

### 2.5 Livrable

Prototype fonctionnel avec quelques écrans, et non un logiciel prêt pour la production.

---

## 3. Utilisateurs et rôles

Le système gère trois profils d'utilisateur, avec des droits d'accès définis afin de limiter l'accès aux données et aux opérations sensibles.

| Profil | Droits et actions |
|---|---|
| **Caissier** | Gestion des commandes, facturation et suivi des paiements (sur place, à emporter, livraison), y compris acomptes, paiements partiels et soldes restant dus. Suivi des paiements des réservations de chambre. Statut des chambres : libre, réservée, occupée, payée. Suivi du stock : disponible, manquant. Accès au tableau de bord de caisse par identifiant et mot de passe. |
| **Gérant (le patron)** | Consultation des activités de l'établissement et des entrées d'argent liées à chaque activité (restaurant et hôtel). Gestion du stock. Consultation des rapports de ventes, des historiques et des réservations. Export en PDF, pour calculer les KPI. Le gérant consulte l'activité mais ne passe pas par la caisse. |
| **Clients** | Accès au site internet (frontend) : consulter le menu, les chambres et les tarifs, réserver, commander à distance. Aucun accès au tableau de bord interne, aux données de caisse ni aux informations confidentielles. |

**Remarque.** Un seul compte de caissier est configuré pour toute la caisse : il n'y a donc pas d'écran de gestion des utilisateurs.

---

## 4. Besoins fonctionnels retenus

Liste de 19 fonctionnalités acceptées par le client à ce jour. Certaines descriptions sont complétées par des précisions issues du document de cadrage initial.

### 4.1 Partie hôtel

| N° | Fonctionnalité | Description |
|---|---|---|
| 1 | Se connecter | Identifiant et mot de passe. |
| 2 | Voir le calendrier des chambres | Chambres libres, réservées, occupées. |
| 3 | Rechercher une chambre libre | Selon les dates. |
| 4 | Créer, modifier et annuler une réservation | Réservation de chambre, avec dates d'arrivée et de départ et informations nécessaires au séjour. |
| 5 | Gérer le statut des chambres | Libre, réservée, occupée, payée. |
| 6 | Faire le check-in et le check-out | À l'arrivée et au départ du client. |
| 7 | Faire la facture | Total calculé automatiquement. |
| 8 | Enregistrer les paiements | Acompte, solde, mode de paiement. Historique des réservations et des règlements consultable. |
| 9 | Enregistrer et suivre les réclamations | Réclamations des clients. |

### 4.2 Partie caisse et gérant

| N° | Fonctionnalité | Description |
|---|---|---|
| 10 | Une seule caisse | Pour l'hôtel et le restaurant, avec la source de chaque paiement. |
| 11 | Consulter l'activité | Entrées d'argent de l'hôtel et du restaurant, avec historique des opérations de caisse. |
| 12 | Filtrer par période | Jour, semaine, mois. |
| 13 | Exporter en PDF | Pour calculer les KPI. |

### 4.3 Partie restaurant

| N° | Fonctionnalité | Description |
|---|---|---|
| 14 | Gérer les tables | Libre, occupée, réservée. Une réservation de table précise la date, l'heure, le nombre de personnes et les coordonnées du client. |
| 15 | Prendre les commandes | Sur place, à emporter, en livraison ou à distance. Une commande peut être associée à une table ou à un client, avec son détail, son montant et son statut. |
| 16 | Suivre le stock | Produits disponibles ou manquants. |

### 4.4 Partie site client (site existant à adapter)

| N° | Fonctionnalité | Description |
|---|---|---|
| 17 | Consulter | Le menu, les chambres et les tarifs. |
| 18 | Réserver | Une chambre ou une table en ligne. |
| 19 | Commander à distance | Commande transmise à la caisse. |

### 4.5 Non retenu pour le moment

**La gestion des événements** (mariages, anniversaires et autres). Le document de cadrage initial la prévoyait (saisie des demandes, type d'événement, nombre de participants, budget estimé, suivi du dossier, acomptes) ; elle n'a pas été retenue par le client. Elle pourra être ajoutée plus tard s'il le demande, et la base de données devra rester assez souple pour l'accueillir.

---

## 5. Règles de gestion

### 5.1 Règles confirmées

- Une chambre a un statut parmi : libre, réservée, occupée, payée.
- Une table a un statut parmi : libre, occupée, réservée.
- Chaque paiement porte une source : restaurant ou hôtel.
- Une commande est de l'un des types suivants : sur place, à emporter, livraison, à distance.
- Un produit en stock est « disponible » ou « manquant ».
- Le caissier utilise la caisse avec son identifiant et son mot de passe.
- Le gérant consulte les activités et exporte les rapports en PDF.

### 5.2 Règles complémentaires (document de cadrage)

- Statut de règlement d'une commande : non payé, partiellement payé, payé.
- Statut d'une réservation (table ou chambre) : en attente, confirmée, annulée, terminée.
- Les opérations sensibles (paiements, annulations, modifications importantes) laissent une trace.

---

## 6. Base de données, sécurité et contraintes

- **Base de données :** relationnelle, centralisant les opérations du restaurant et de l'hôtel. Elle relie notamment les clients, commandes, articles, tables, réservations, chambres, paiements, stocks et utilisateurs, chaque enregistrement important ayant un identifiant unique.
- **Sécurité :** tableau de bord protégé par l'identifiant et le mot de passe du caissier. Le mot de passe n'est jamais stocké en clair : il est protégé par une méthode de hachage adaptée.
- **Sauvegardes :** sauvegardes régulières des données.
- **Export :** rapports au format PDF pour le gérant.
- **Interface :** application web, utilisable sur ordinateur.
- **Site internet :** le site existant du client est adapté, et non refait.
- **Budget :** projet d'école, sans coût pour le client.
- **Livrable :** prototype fonctionnel avec quelques écrans, pas un logiciel prêt pour la production.

---

## 7. Écrans à prévoir

| Écran | Contenu |
|---|---|
| **Connexion** | Identifiant et mot de passe du caissier. |
| **Tableau de bord de caisse** | Entrées d'argent par source (restaurant, hôtel), filtre par période. |
| **Tables et commandes** | État des tables, prise de commande, facture et paiement. |
| **Chambres et réservations** | Calendrier, recherche par dates, réservation, check-in et check-out, statuts, facture, paiements, réclamations. |
| **Stock** | Produits disponibles ou manquants. |
| **Activité et rapports (gérant)** | Consultation par période et export PDF. |
| **Site client** | Consultation du menu, des chambres et des tarifs, réservation, commande à distance. |

*Le livrable se limite à quelques écrans de prototype.*

---

## 8. Points de divergence entre les deux documents

Les deux documents ne se contredisaient pas sur le fond, mais différaient sur le périmètre. Voici les arbitrages faits pour les unifier : en cas de conflit, la version validée par le client prévaut.

| Sujet | Document de cadrage | Cahier des charges validé | Retenu |
|---|---|---|---|
| **Événements** | Gestion complète des mariages et anniversaires | Non retenu pour le moment | Exclu du périmètre, extension possible |
| **Comptes du personnel** | Identifiants individuels, administration des comptes | Un seul compte caissier, pas d'écran de gestion des utilisateurs | Un seul compte caissier |
| **Statuts des chambres** | Libre, réservée, occupée, indisponible, en attente de paiement | Libre, réservée, occupée, payée | Statuts du cahier validé |
| **Stock** | Seuils bas, entrées et sorties, historique | Disponible ou manquant | Disponible ou manquant |
| **Types de commande** | Sur place, à emporter, livraison (commande à distance à part) | Quatre types dont à distance | Quatre types |
| **Accès du gérant** | Accès complet, y compris administration | Consultation et export PDF, sans passer par la caisse | Consultation et export PDF |
| **Compléments** (acomptes, réclamations, check-in/out, KPI, filtre par période) | Acomptes et paiements partiels seulement | Précisés en détail | Repris du cahier validé |
| **Sécurité technique** | Hachage des mots de passe, sauvegardes, traçabilité | Non détaillée | Reprise du document de cadrage |

---

## 9. Résultat attendu

À l'issue du projet, l'Hôtel Restaurant Le Binguiss disposera d'un prototype d'outil centralisé permettant de mieux organiser ses activités de restauration et d'hébergement, de suivre les commandes et réservations, de contrôler les stocks et de regrouper les paiements dans une caisse sécurisée. Le système restera simple à utiliser, adapté aux tâches quotidiennes et évolutif, pour intégrer plus tard de nouvelles fonctionnalités comme les événements.

---
