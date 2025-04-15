const express = require('express');
const session = require('express-session');
const stripe = require('stripe')('sk_test_51RBzWrHKtM5eoiIK0SeGBaK8w2HYVBOLP69k88HYb0c1u1ovuoAYBzyByKFTxqnnKjwZQvEdYrw9KdVK5zjRp2qu00DRBoYzmt');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const app = express();

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/uploads';
        if (!fs.promises.access(uploadDir, fs.constants.F_OK)) {
            fs.promises.mkdir(uploadDir, { recursive: true });
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

// Ajout de la configuration de session
app.use(session({
    secret: 'cookie_bliss_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Mettre à true en production avec HTTPS
}));

// Remplacer les variables globales par des fonctions de lecture/écriture
async function readCookies() {
    const data = await fs.readFile(path.join(__dirname, 'data', 'cookies.json'), 'utf8');
    return JSON.parse(data);
}

async function writeCookies(cookies) {
    await fs.writeFile(
        path.join(__dirname, 'data', 'cookies.json'),
        JSON.stringify(cookies, null, 2)
    );
}

async function readSiteContent() {
    const data = await fs.readFile(path.join(__dirname, 'data', 'site-content.json'), 'utf8');
    return JSON.parse(data);
}

async function writeSiteContent(content) {
    await fs.writeFile(
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

app.use(express.json());
app.use(express.static('public'));

// Ajouter un middleware CORS global
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Gérer les requêtes OPTIONS
app.options('/create-checkout-session', (req, res) => {
    res.sendStatus(200);
});

app.post('/create-checkout-session', async (req, res) => {
    try {
        if (!req.body.items || !Array.isArray(req.body.items)) {
            return res.status(400).json({ error: 'Panier invalide' });
        }

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
            success_url: 'http://localhost:3000/success.html',
            cancel_url: 'http://localhost:3000',
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

        // Renvoyer l'URL directement
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
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // À remplacer par vos identifiants
    if (username === 'admin' && password === 'votreMotDePasse') {
        req.session.isAdmin = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Identifiants incorrects' });
    }
});

// Vérification de l'authentification
app.get('/admin/check-auth', requireAuth, (req, res) => {
    res.json({ authenticated: true });
});

// Déconnexion
app.post('/admin/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Liste des cookies
app.get('/admin/cookies', requireAuth, (req, res) => {
    // À remplacer par votre logique de base de données
    res.json(cookies);
});

// Modifier un cookie
app.put('/admin/cookies/:id', requireAuth, upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    
    const cookieIndex = cookies.findIndex(c => c.id === id);
    if (cookieIndex === -1) {
        return res.status(404).json({ error: 'Cookie non trouvé' });
    }

    const updatedCookie = {
        ...cookies[cookieIndex],
        name: name || cookies[cookieIndex].name,
        price: price ? parseFloat(price) : cookies[cookieIndex].price,
    };

    if (req.file) {
        // Supprimer l'ancienne image si elle existe
        const oldImagePath = path.join(__dirname, 'public', new URL(cookies[cookieIndex].image).pathname);
        if (fs.promises.access(oldImagePath, fs.constants.F_OK)) {
            fs.promises.unlink(oldImagePath);
        }
        updatedCookie.image = `/uploads/${req.file.filename}`;
    }

    cookies[cookieIndex] = updatedCookie;
    res.json(updatedCookie);
});

// Modifier la route d'ajout pour gérer l'upload
app.post('/admin/cookies', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const cookies = await readCookies();
        const newCookie = {
            id: Date.now().toString(),
            name: req.body.name,
            price: parseFloat(req.body.price),
            image: `/uploads/${req.file.filename}`
        };
        cookies.push(newCookie);
        await writeCookies(cookies);
        res.json(newCookie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Supprimer un cookie
app.delete('/admin/cookies/:id', requireAuth, (req, res) => {
    const { id } = req.params;
    cookies = cookies.filter(cookie => cookie.id !== id);
    res.json({ success: true });
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
        if (!req.body.content) {
            return res.status(400).json({ error: 'Contenu manquant' });
        }

        const content = JSON.parse(req.body.content);
        
        if (req.file) {
            content.hero.backgroundImage = `/uploads/${req.file.filename}`;
        }
        
        await writeSiteContent(content);
        res.json({ success: true, content });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000')); 