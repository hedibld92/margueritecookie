# 🍪 Marguerite Cookie

Une application e-commerce de vente de cookies artisanaux développée avec Vue.js et Node.js.

## 🚀 Fonctionnalités

- Catalogue de cookies avec descriptions et prix
- Panier d'achat interactif
- Interface utilisateur moderne et responsive
- Système de commande simplifié
- Gestion des sessions utilisateur

## 🛠 Technologies Utilisées

### Frontend
- Vue.js 3
- Vue Router
- Pinia (State Management)
- SCSS
- Axios

### Backend
- Node.js
- Express.js
- Redis (Session Management)
- Multer (Upload de fichiers)
- Stripe (Paiement)

## 📦 Installation

1. Clonez le repository :
```bash
git clone https://github.com/hedibld92/margueritecookie.git
cd margueritecookie
```

2. Installez les dépendances du frontend :
```bash
cd frontend
npm install
```

3. Installez les dépendances du backend :
```bash
cd ../backend
npm install
```

4. Configurez les variables d'environnement :
- Créez un fichier `.env` dans le dossier backend
- Créez un fichier `.env` dans le dossier frontend
- Ajoutez les variables nécessaires (voir `.env.example`)

5. Démarrez le serveur de développement :

Backend :
```bash
cd backend
npm run dev
```

Frontend :
```bash
cd frontend
npm run dev
```

## 🌐 Structure du Projet

```
margueritecookie/
├── frontend/           # Application Vue.js
│   ├── src/
│   │   ├── assets/    # Images, styles, etc.
│   │   ├── components/# Composants Vue
│   │   ├── views/     # Pages de l'application
│   │   ├── stores/    # State management (Pinia)
│   │   └── router/    # Configuration des routes
│   └── public/        # Fichiers statiques
└── backend/           # Serveur Node.js
    ├── src/
    │   ├── routes/    # Routes API
    │   ├── data/      # Données mockées
    │   └── server.js  # Point d'entrée
    └── public/        # Fichiers uploadés
```

## 🔒 Variables d'Environnement Requises

### Backend (.env)
```
NODE_ENV=development
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
SESSION_SECRET=votre_secret_tres_securise
STRIPE_SECRET_KEY=votre_cle_stripe
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLIC_KEY=votre_cle_publique_stripe
```

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## 📝 License

MIT 