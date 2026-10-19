# Système de gestion de l'Hôtel Restaurant Le Binguiss

<<<<<<< HEAD
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
=======
## Présentation de l'entreprise

### Identification
>>>>>>> a68ee82 (Ajout du cahier des charges et du README)

| Information | Détail |
|---|---|
| **Nom** | Hôtel Restaurant Le Binguiss |
| **Type** | Restaurant classique en bord de mer avec service hôtelier intégré |
| **Activités** | Restauration et hébergement hôtelier, regroupés dans un même établissement |
| **Caisse** | Un seul poste de caisse, avec deux sources d'entrée d'argent : le restaurant et l'hôtel |

### Activités et services proposés

**Restaurant**
- Restauration sur place
- Vente à emporter
- Livraison et commandes à distance
- Réservation de tables

**Hôtel**
- Réservation et suivi des chambres d'hôtel
- Accueil des clients à l'arrivée et au départ, facturation et encaissement

> L'organisation d'événements (mariages, anniversaires) n'est pas retenue pour le moment.

### Organisation et fonctionnement

L'Hôtel Restaurant Le Binguiss est un établissement en bord de mer qui réunit un restaurant et un hôtel. Les deux activités partagent une caisse unique, ce qui permet de regrouper toutes les entrées d'argent au même endroit tout en distinguant leur source (restaurant ou hôtel).

Deux profils utilisent le futur système :

- **Le caissier** tient la caisse. Il gère les commandes, la facturation, les paiements et le statut des chambres.
- **Le gérant (le patron)** suit l'activité, les entrées d'argent de chaque activité et le stock, et exporte les rapports en PDF.

Les clients passent par le site internet de l'établissement pour consulter le menu, les chambres et les tarifs, réserver une chambre ou une table, et commander à distance.

## Présentation du projet

### Contexte

Dans le cadre de l'atelier de génie logiciel, ce projet consiste à concevoir un système de gestion pour l'Hôtel Restaurant Le Binguiss, à partir des besoins exprimés par l'établissement.

### Nature du projet

Conception d'une application de gestion avec interface web et base de données relationnelle.

### Objectif général

Concevoir une application de gestion simple, centralisée et sécurisée, comprenant quelques écrans adaptés aux situations de travail de l'établissement : gestion des tables et des commandes, et réservations hôtelières. Le système doit réduire les tâches manuelles, faciliter le suivi des paiements et des stocks, et rendre les informations disponibles aux utilisateurs autorisés.

L'application s'appuie sur une base de données relationnelle qui centralise les opérations du restaurant et de l'hôtel dans une caisse principale. Cette caisse est gérée par un tableau de bord sécurisé par l'identifiant et le mot de passe du caissier.

### Principes de fonctionnement

- Des écrans distincts selon les tâches : commandes, tables, chambres, paiements et stocks.
- Une base de données relationnelle commune au restaurant et à l'hôtel.
- Une caisse principale unique, avec un tableau de bord sécurisé.
- Une interface publique (site internet existant, à adapter) pour que les clients consultent les informations et fassent certaines demandes, sans accès à l'espace interne.
