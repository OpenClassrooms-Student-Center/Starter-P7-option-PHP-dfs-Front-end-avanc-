# kasa-app — plateforme de réservation de logements entre particuliers

Application web de Kasa : les voyageurs consultent les logements proposés par des hôtes particuliers et se connectent à leur compte. Le dépôt regroupe deux applications qui ne partagent qu'un contrat HTTP (routes, JSON, codes de réponse) : l'interface React construite avec Vite (`frontend/`) et l'API Symfony qui l'alimente (`backend/`). L'API ne rend pas de HTML, l'interface ne lit pas les données directement.

## Prérequis

| Outil | Version | Vérification |
| --- | --- | --- |
| PHP | 8.5.11, avec les extensions `ctype`, `iconv` et `mbstring` | `php --version` |
| Composer | 2.8 ou supérieure | `composer --version` |
| Symfony CLI (facultatif, pour `symfony server:start`) | 5.x | `symfony version` |
| Node.js | 24.21.0 | `node --version` |
| npm | 11.x (livré avec Node.js 24) | `npm --version` |
| Git | 2.40 ou supérieure | `git --version` |

Le fichier `frontend/.nvmrc` fixe la version majeure de Node.js (`24`) : avec nvm, `nvm use` lancé depuis `frontend/` sélectionne la bonne version.

Visual Studio Code est recommandé, avec les extensions PHP Debug (Xdebug), PHP Intelephense et ESLint. Le fichier `.vscode/launch.json` fournit une configuration d'écoute Xdebug pour l'API, une configuration Chrome pour l'interface et un lancement combiné « Kasa : API + Web ».

## Installation

```bash
git clone https://github.com/OpenClassrooms-Student-Center/Starter-P7-option-PHP-dfs-Front-end-avanc-.git kasa-app
cd kasa-app
```

### API — `backend/`

```bash
cd backend
composer install
```

Les valeurs par défaut de `backend/.env` suffisent pour un lancement en local. Pour les surcharger, créez un fichier `backend/.env.local` (ignoré par Git) ; ne modifiez pas `.env`, qui est versionné.

### Interface — `frontend/`

```bash
cd frontend
nvm use
npm install
cp .env.example .env.local
```

Les valeurs du fichier d'exemple suffisent pour un lancement en local.

## Variables d'environnement

Les fichiers `.env.local` sont ignorés par Git. Côté API, `backend/.env` est versionné et ne contient que des valeurs par défaut non secrètes (convention Symfony) ; côté interface, seul `frontend/.env.example` est versionné.

### API — `backend/.env`, surcharge dans `backend/.env.local`

| Variable | Valeur par défaut | Rôle |
| --- | --- | --- |
| `APP_ENV` | `dev` | Environnement d'exécution Symfony (`dev`, `test`, `prod`) |
| `APP_SECRET` | — | Secret applicatif, à générer dans `.env.local` avant toute mise en production |
| `DATA_FILE` | `../starter-kit/donnees-logements-utilisateurs-kasa.csv` | Fichier de données, chemin relatif à `backend/` |
| `CORS_ALLOW_ORIGIN` | `^https?://localhost:5173$` | Origine autorisée pour l'interface (expression régulière) |
| `JWT_SECRET`, `JWT_EXPIRES_IN`, `BCRYPT_ROUNDS`, `OAUTH_CLIENT_ID`, `OAUTH_CLIENT_SECRET` | — | Réservées à une évolution de l'API ; non lues par le code actuel |

### Interface — `frontend/.env.local`

| Variable | Valeur par défaut | Rôle |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:8000` | Adresse de l'API appelée par l'interface |
| `VITE_APP_NAME` | `Kasa` | Nom affiché dans l'en-tête |

Toute variable préfixée `VITE_` est embarquée dans le code envoyé au navigateur : elle ne doit jamais contenir de secret.

## Lancement

Deux terminaux, un par application.

### API (http://localhost:8000)

```bash
cd backend
symfony server:start --port=8000
# ou, sans la Symfony CLI :
php -S localhost:8000 -t public
```

Le cache et les journaux de Symfony sont écrits dans `backend/var/`, ignoré par Git.

### Interface (http://localhost:5173)

```bash
cd frontend
npm run dev
```

### Vérifier l'installation

1. `http://localhost:8000/api/sante` répond `{"statut":"ok"}`.
2. `http://localhost:5173` affiche les 12 logements du fichier de données, avec leur ville, leur type et leur prix par nuit.
3. Chaque logement a sa page de détail : titre, type, ville, prix par nuit et prénom de l'hôte.
4. La page `/connexion` accepte les comptes de démonstration du fichier de données (par exemple le voyageur `julien.morand@exemple-kasa.fr` / `azerty123`). Une fois connecté, l'en-tête affiche le prénom de l'utilisateur et un bouton de déconnexion.

### Construction de l'interface pour la production

```bash
cd frontend
npm run build      # fichiers statiques dans frontend/dist/
npm run preview    # sert le résultat de la construction en local
```

Pour l'API, définissez `APP_ENV=prod` et un `APP_SECRET` dans `backend/.env.local`, puis lancez `php bin/console cache:clear`.

## Débogage

- **API** : installez Xdebug et activez-le dans `php.ini` (`xdebug.mode=debug`, `xdebug.start_with_request=trigger` ou `yes`, `xdebug.client_port=9003`). Lancez « API Kasa (PHP, Xdebug) » dans VS Code, posez un point d'arrêt dans `backend/src/` et appelez la route concernée depuis l'interface ou un client HTTP : l'exécution s'arrête sur le point d'arrêt avec les variables de la requête.
- **Interface** : lancez « Web Kasa (Chrome) » avec `npm run dev` actif. Les points d'arrêt posés dans les fichiers TypeScript de `frontend/src/` sont résolus grâce aux cartes de source de Vite. L'onglet Réseau des outils de développement montre chaque appel vers l'API avec son corps et sa réponse.

## Stack technique

| Couche | Technologie |
| --- | --- |
| Exécution serveur | PHP 8.5.11 |
| API | Symfony 7.4 (FrameworkBundle, Console, Dotenv, Runtime, Yaml), NelmioCorsBundle |
| Exécution de l'outillage front | Node.js 24.21.0 |
| Interface | React 19.3.0, React Router 7, TypeScript en mode strict, Vite 7 |
| Qualité | PHPStan (niveau 6) et PHP-CS-Fixer (PSR-12 / Symfony) côté API ; ESLint 9 et Prettier 3 côté interface |
| Outillage | Composer pour l'API, npm pour l'interface |

## Structure du projet

```
kasa-app/
├── .vscode/launch.json          # configurations de débogage (Xdebug, Chrome)
├── starter-kit/                 # documents du projet et jeu de données de démonstration (CSV)
├── backend/                     # API Symfony
│   ├── composer.json
│   ├── .env                     # valeurs par défaut non secrètes
│   ├── bin/console              # console Symfony
│   ├── public/index.php         # point d'entrée HTTP
│   ├── config/
│   │   ├── bundles.php
│   │   ├── routes.yaml          # routes déclarées par attributs sur les contrôleurs
│   │   ├── services.yaml        # autowiring et chemin du fichier de données
│   │   └── packages/            # framework.yaml, nelmio_cors.yaml
│   └── src/
│       ├── Kernel.php
│       ├── Donnees/             # Utilisateur, Logement, JeuDeDonnees, ChargeurCsv
│       └── Controller/          # SanteController, LogementController, AuthController
└── frontend/                    # interface React / Vite
    ├── package.json
    ├── index.html
    ├── vite.config.ts
    └── src/
        ├── main.tsx             # montage de l'application
        ├── App.tsx              # routeur, en-tête, zone principale
        ├── pages/               # Accueil, DetailLogement, Connexion
        ├── components/          # Header, CarteLogement, FormulaireConnexion
        ├── lib/                 # types partagés, client HTTP de l'API, session navigateur
        └── styles/globals.css
```

Côté API, les contrôleurs sont minces : ils appellent le service `ChargeurCsv` et renvoient une `JsonResponse`. Les objets de `src/Donnees/` sont des objets valeur en lecture seule. Côté interface, les appels HTTP sont rassemblés dans `src/lib/api.ts` et la session du navigateur dans `src/lib/session.ts` ; les composants ne font que les utiliser.

## Données

L'API lit ses données depuis le fichier CSV désigné par `DATA_FILE` : 10 comptes (voyageurs, hôtes, administrateur), 12 logements et 2 séjours de démonstration. Chaque ligne porte un `type_enregistrement` (`utilisateur`, `logement` ou `sejour`) et les colonnes propres à ce type. Les logements sont rattachés à leur hôte et les séjours à leur voyageur et logement par leurs identifiants.

## Points d'entrée de l'API

Les routes d'API préfixées par `/api` renvoient du JSON. Le CORS n'autorise que l'origine définie par `CORS_ALLOW_ORIGIN`.

| Méthode et route | Description | Réponse |
| --- | --- | --- |
| `GET /api/sante` | État de l'API | `{ "statut": "ok" }` |
| `GET /api/logements` | Liste des logements, chacun complété par le prénom et le nom de son hôte | tableau de logements |
| `GET /api/logements/{id}` | Détail d'un logement | un logement |
| `GET /api/sejours?voyageurId=…` | Séjours associés à un voyageur | tableau de séjours |
| `GET /api/sejours/{id}` | Détail d'un séjour | un séjour |
| `GET /api/administration` | Indicateurs, réservations et annonces du tableau de bord | données du tableau de bord |
| `GET /api/logements/{id}/conciergerie` | Coordonnées du service de conciergerie associé au logement | informations du partenaire |
| `POST /api/auth/login` | Connexion ; corps `{ "email": "…", "motDePasse": "…" }` | `200` avec `{ id, role, prenom, nom, email }`, ou `401` avec `{ "message": "Identifiants invalides" }` |

L'aperçu d'avis est une page HTML utilisée depuis le détail du logement.

Forme d'un logement :

```json
{
  "id": "l-001",
  "titre": "Studio lumineux près du canal",
  "typeLogement": "appartement",
  "ville": "Paris",
  "prixParNuit": "89",
  "idHote": "u-002",
  "dateCreation": "2026-01-07",
  "hote": { "prenom": "Marc", "nom": "Lévesque" }
}
```

## Scripts

### API (`backend/`)

| Commande | Effet |
| --- | --- |
| `composer install` | Installe les dépendances PHP dans `vendor/` |
| `symfony server:start --port=8000` ou `php -S localhost:8000 -t public` | Lance l'API |
| `php bin/console cache:clear` | Vide le cache Symfony |
| `composer lint` | PHPStan puis PHP-CS-Fixer en vérification seule |
| `composer format` | Applique le style de code avec PHP-CS-Fixer |

### Interface (`frontend/`)

| Commande | Effet |
| --- | --- |
| `npm run dev` | Lance le serveur de développement Vite sur le port 5173 |
| `npm run build` | Vérifie les types (`tsc -b`) puis construit l'interface dans `dist/` |
| `npm run preview` | Sert l'interface construite en local |
| `npm run lint` | ESLint sur `src/` |
| `npm run format` | Prettier sur l'ensemble du dossier |

## Licence

Code propriétaire de Kasa. Tous droits réservés. Usage réservé aux équipes de Kasa et à ses prestataires sous contrat.
