import express from 'express';
import cors from 'cors';
import { initializeProducts, searchProducts, getSimilarProducts } from './productController.js';
import { searchAnalytics } from './searchAnalytics.js';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize product data into vector DB
async function startServer() {
    try {
        console.log('Initializing products...');
        await initializeProducts();
        console.log('Products initialized successfully');

        app.post('/search', async (req, res) => {
            try {
                const { query } = req.body;
                if (!query) {
                    return res.status(400).json({ error: 'Query is required' });
                }
                const results = await searchProducts(query);
                
                // Track the search query
                searchAnalytics.trackSearch(query, null, Date.now());
                
                res.json(results);
            } catch (error) {
                console.error('Search error:', error);
                res.status(500).json({ error: 'Error processing search request' });
            }
        });

        app.get('/products/:id/similar', async (req, res) => {
            try {
                const similar = await getSimilarProducts(req.params.id);
                res.json(similar);
            } catch (error) {
                res.status(500).json({ error: 'Error finding similar products' });
            }
        });

        app.get('/trending-searches', (req, res) => {
            const trending = searchAnalytics.getTrendingSearches();
            res.json(trending);
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
