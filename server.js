require('dotenv').config();
const express = require('express');
const session = require('express-session');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

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

// Ajout de la configuration de session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    }
}));

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

app.listen(process.env.PORT || 3000, () => console.log(`Server running on http://localhost:${process.env.PORT || 3000}`)); 