require('dotenv').config();
const express = require('express');
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis').default;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

// Middleware pour parser le JSON et les cookies
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Configuration CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://margueritecookie.fr', 'https://www.margueritecookie.fr']
        : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log('Initialisation de la connexion Redis...');
console.log('Configuration Redis:', {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD ? '***' : undefined
});

// Configuration Redis avec gestion d'erreur améliorée
const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    connectTimeout: 10000,
    retryStrategy: function(times) {
        const delay = Math.min(times * 100, 3000);
        console.log(`Tentative de reconnexion Redis #${times}, délai: ${delay}ms`);
        return delay;
    }
});

redisClient.on('connect', () => {
    console.log('Redis: Connexion établie');
});

redisClient.on('ready', () => {
    console.log('Redis: Prêt à recevoir des commandes');
});

redisClient.on('error', (err) => {
    console.error('Erreur Redis:', err);
});

redisClient.on('end', () => {
    console.log('Redis: Connexion terminée');
});

// Configuration de la session avec Redis
const sessionStore = new RedisStore({ 
    client: redisClient,
    prefix: 'margueritecookie:',
    logErrors: true
});

// Configuration de la session
app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'votre_secret',
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.margueritecookie.fr' : undefined,
        path: '/'
    }
}));

// Middleware pour logger les informations de session
app.use((req, res, next) => {
    console.log('=== Session Debug ===');
    console.log('Session ID:', req.sessionID);
    console.log('Session:', req.session);
    console.log('Cookies:', req.cookies);
    console.log('Headers:', req.headers);
    next();
});

// Démarrer le serveur une fois Redis connecté
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});

// Middleware pour logger les erreurs de session
app.use((req, res, next) => {
    const originalEnd = res.end;
    res.end = function() {
        if (req.session) {
            req.session.save((err) => {
                if (err) console.error('Erreur lors de la sauvegarde de la session:', err);
                originalEnd.apply(res, arguments);
            });
        } else {
            originalEnd.apply(res, arguments);
        }
    };
    next();
});

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/uploads';
        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Images uniquement!');
        }
    }
});

// Remplacer les variables globales par des fonctions de lecture/écriture
async function readCookies() {
    const data = await fs.promises.readFile(path.join(__dirname, 'data', 'cookies.json'), 'utf8');
    return JSON.parse(data).cookies;
}

async function writeCookies(cookies) {
    await fs.promises.writeFile(
        path.join(__dirname, 'data', 'cookies.json'),
        JSON.stringify({ cookies }, null, 2)
    );
}

async function readSiteContent() {
    const data = await fs.promises.readFile(path.join(__dirname, 'data', 'site-content.json'), 'utf8');
    return JSON.parse(data);
}

async function writeSiteContent(content) {
    await fs.promises.writeFile(
        path.join(__dirname, 'data', 'site-content.json'),
        JSON.stringify(content, null, 2)
    );
}

// Tableau pour stocker les cookies (à remplacer par une base de données en production)
let cookies = [
    {
        id: '1',
        name: 'Cookie Chocolat Noir',
        price: 3.50,
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e'
    },
    {
        id: '2',
        name: 'Cookie Caramel Beurre Salé',
        price: 3.80,
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35'
    },
    {
        id: '3',
        name: 'Cookie Praliné Noisettes',
        price: 3.80,
        image: 'https://images.unsplash.com/photo-1573074556015-71d2130f0e63'
    }
];

// Ajouter après la déclaration des cookies
let siteContent = {
    hero: {
        title: "Des cookies artisanaux, livrés chez toi",
        subtitle: "Ingrédients naturels. Faits maison. Livraison rapide.",
        buttonText: "Commander maintenant",
        backgroundImage: "/hero-cookies.jpg"
    },
    advantages: {
        title: "Pourquoi choisir Cookie Bliss ?",
        items: [
            {
                icon: "leaf",
                title: "100% naturels",
                description: "Des ingrédients soigneusement sélectionnés"
            },
            {
                icon: "hands",
                title: "Faits main chaque jour",
                description: "Une fabrication artisanale quotidienne"
            },
            {
                icon: "truck",
                title: "Livraison en 24h",
                description: "Rapidité et fraîcheur garanties"
            }
        ]
    },
    about: {
        title: "Notre histoire",
        content: "Depuis 2020, nous créons des cookies artisanaux avec passion. Tout a commencé dans notre petite cuisine familiale, où nous expérimentions différentes recettes pour créer le cookie parfait..."
    },
    testimonials: {
        title: "Ils en parlent mieux que nous",
        items: [
            {
                image: "https://randomuser.me/api/portraits/women/65.jpg",
                text: "Les meilleurs cookies que j'ai jamais goûtés !",
                author: "Marie L."
            },
            {
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                text: "La livraison est ultra rapide et les cookies sont divins.",
                author: "Thomas R."
            },
            {
                image: "https://randomuser.me/api/portraits/women/42.jpg",
                text: "Un goût authentique qui me rappelle mon enfance.",
                author: "Sophie M."
            }
        ]
    },
    newsletter: {
        title: "Reste informé(e) et gourmand(e)",
        buttonText: "S'inscrire"
    }
};

app.use(express.static('public'));

// Gérer les requêtes OPTIONS
app.options('/create-checkout-session', (req, res) => {
    res.sendStatus(200);
});

app.post('/create-checkout-session', async (req, res) => {
    try {
        if (!req.body.items || !Array.isArray(req.body.items)) {
            return res.status(400).json({ error: 'Panier invalide' });
        }

        const domain = process.env.NODE_ENV === 'production' 
            ? `https://${process.env.DOMAIN}`
            : 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.items.map(item => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: 1,
            })),
            mode: 'payment',
            success_url: `${domain}/success.html`,
            cancel_url: `${domain}`,
            locale: 'fr',
            shipping_address_collection: {
                allowed_countries: ['FR'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 490,
                            currency: 'eur',
                        },
                        display_name: 'Livraison standard',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 2,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 4,
                            },
                        },
                    },
                }
            ],
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Middleware d'authentification
const requireAuth = (req, res, next) => {
    if (!req.session?.isAdmin) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    next();
};

// Route de connexion admin
app.post('/admin/login', async (req, res) => {
    console.log('=== Début de la tentative de connexion ===');
    console.log('Corps de la requête:', req.body);
    console.log('État de la session avant connexion:', req.session);
    console.log('Headers:', req.headers);
    console.log('Environnement:', process.env.NODE_ENV);
    
    const { username, password } = req.body;
    
    if (!username || !password) {
        console.log('Erreur: username ou password manquant');
        return res.status(400).json({ error: 'Username et password requis' });
    }

    // Vérifier que les variables d'environnement sont définies
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
        console.error('Erreur: Variables d\'environnement ADMIN_USERNAME ou ADMIN_PASSWORD non définies');
        return res.status(500).json({ error: 'Configuration incorrecte du serveur' });
    }
    
    console.log('Tentative de connexion pour:', username);
    console.log('Username attendu:', process.env.ADMIN_USERNAME);
    
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        console.log('Authentification réussie pour:', username);
        
        try {
            req.session.isAdmin = true;
            req.session.username = username;
            req.session.lastLogin = new Date();
            
            console.log('Session après modification:', req.session);
            
            await new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err) {
                        console.error('Erreur lors de la sauvegarde de la session:', err);
                        reject(err);
                    } else {
                        console.log('Session sauvegardée avec succès');
                        resolve();
                    }
                });
            });
            
            console.log('ID de session final:', req.sessionID);
            res.json({ 
                success: true,
                sessionId: req.sessionID,
                isAdmin: req.session.isAdmin
            });
        } catch (error) {
            console.error('Erreur lors de la gestion de la session:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    } else {
        console.log('Échec de l\'authentification pour:', username);
        res.status(401).json({ error: 'Identifiants incorrects' });
    }
});

// Vérification de l'authentification
app.get('/admin/check-auth', (req, res) => {
    console.log('=== Vérification de l\'authentification ===');
    console.log('Session complète:', req.session);
    console.log('ID de session:', req.sessionID);
    console.log('Headers:', req.headers);
    
    if (!req.session) {
        console.log('Erreur: Pas de session');
        return res.status(401).json({ error: 'Pas de session' });
    }
    
    if (!req.session.isAdmin) {
        console.log('Erreur: Non autorisé - Session non admin');
        return res.status(401).json({ error: 'Non autorisé' });
    }
    
    console.log('Authentification réussie pour la session');
    res.json({ 
        authenticated: true,
        username: req.session.username,
        lastLogin: req.session.lastLogin
    });
});

// Déconnexion
app.post('/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Route pour mettre à jour le contenu "à propos"
app.post('/admin/update-about', requireAuth, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: 'Le titre et le contenu sont requis' });
        }

        const siteContent = await readSiteContent();
        siteContent.about = {
            title,
            content
        };
        
        await writeSiteContent(siteContent);
        res.json({ success: true, message: 'Contenu mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du contenu:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du contenu' });
    }
});

// Liste des cookies
app.get('/admin/cookies', requireAuth, async (req, res) => {
    try {
        const cookies = await readCookies();
        res.json(cookies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Modifier un cookie
app.put('/admin/cookies/:id', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const cookies = await readCookies();
        const cookieIndex = cookies.findIndex(c => c.id === id);
        
        if (cookieIndex === -1) {
            return res.status(404).json({ error: 'Cookie non trouvé' });
        }

        const updatedCookie = {
            ...cookies[cookieIndex],
            name: req.body.name || cookies[cookieIndex].name,
            price: req.body.price ? parseFloat(req.body.price) : cookies[cookieIndex].price,
            ingredients: req.body.ingredients ? JSON.parse(req.body.ingredients) : cookies[cookieIndex].ingredients,
            isBestSeller: req.body.isBestSeller === 'true'
        };

        if (req.file) {
            // Supprimer l'ancienne image si elle existe
            if (cookies[cookieIndex].image && cookies[cookieIndex].image.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, 'public', cookies[cookieIndex].image);
                try {
                    await fs.promises.access(oldImagePath);
                    await fs.promises.unlink(oldImagePath);
                } catch (error) {
                    console.log('Pas d\'ancienne image à supprimer');
                }
            }
            updatedCookie.image = `/uploads/${req.file.filename}`;
        }

        cookies[cookieIndex] = updatedCookie;
        await writeCookies(cookies);
        res.json(updatedCookie);
    } catch (error) {
        console.error('Erreur lors de la modification:', error);
        res.status(500).json({ error: error.message });
    }
});

// Modifier la route d'ajout pour gérer l'upload
app.post('/admin/cookies', requireAuth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Une image est requise' });
        }

        const cookies = await readCookies();
        const newCookie = {
            id: Date.now().toString(),
            name: req.body.name,
            price: parseFloat(req.body.price),
            image: `/uploads/${req.file.filename}`,
            ingredients: JSON.parse(req.body.ingredients || '[]'),
            isBestSeller: req.body.isBestSeller === 'true'
        };

        cookies.push(newCookie);
        await writeCookies(cookies);
        res.json(newCookie);
    } catch (error) {
        console.error('Erreur lors de l\'ajout:', error);
        res.status(500).json({ error: error.message });
    }
});

// Supprimer un cookie
app.delete('/admin/cookies/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const cookies = await readCookies();
        const cookieToDelete = cookies.find(c => c.id === id);
        
        if (cookieToDelete && cookieToDelete.image) {
            const imagePath = path.join(__dirname, 'public', cookieToDelete.image);
            try {
                await fs.promises.access(imagePath);
                await fs.promises.unlink(imagePath);
            } catch (error) {
                console.log('Image non trouvée');
            }
        }
        
        const updatedCookies = cookies.filter(cookie => cookie.id !== id);
        await writeCookies(updatedCookies);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ajouter une route pour obtenir les cookies publics
app.get('/api/cookies', async (req, res) => {
    const cookies = await readCookies();
    res.json(cookies);
});

// Ajouter ces nouvelles routes
app.get('/api/site-content', (req, res) => {
    res.json(siteContent);
});

app.put('/admin/site-content', requireAuth, upload.single('heroImage'), async (req, res) => {
    try {
        const content = JSON.parse(req.body.content);
        
        // Si une nouvelle image hero est uploadée
        if (req.file) {
            // Supprimer l'ancienne image si elle existe
            const oldImagePath = path.join(__dirname, 'public', content.hero.backgroundImage);
            try {
                await fs.promises.access(oldImagePath);
                await fs.promises.unlink(oldImagePath);
            } catch (error) {
                console.log('Pas d\'ancienne image à supprimer');
            }
            content.hero.backgroundImage = `/uploads/${req.file.filename}`;
        }

        // Mettre à jour le contenu dans le fichier
        await writeSiteContent(content);
        
        // Mettre à jour la variable globale
        siteContent = content;

        res.json({ success: true, content });
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        res.status(500).json({ error: error.message });
    }
});

// Nouvelle route pour obtenir uniquement les best-sellers
app.get('/api/best-sellers', async (req, res) => {
    try {
        const cookies = await readCookies();
        const bestSellers = cookies.filter(cookie => cookie.isBestSeller);
        res.json(bestSellers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour mettre à jour le statut best-seller
app.put('/admin/cookies/:id/best-seller', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const { isBestSeller } = req.body;
        
        const cookies = await readCookies();
        const cookieIndex = cookies.findIndex(c => c.id === id);
        
        if (cookieIndex === -1) {
            return res.status(404).json({ error: 'Cookie non trouvé' });
        }
        
        cookies[cookieIndex].isBestSeller = isBestSeller;
        await writeCookies(cookies);
        
        res.json(cookies[cookieIndex]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint pour récupérer la clé publique Stripe
app.get('/api/stripe-key', (req, res) => {
    res.json({ publicKey: process.env.STRIPE_PUBLIC_KEY });
}); 