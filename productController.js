import { productCollection } from './chromaClient.js';
import { getEmbedding } from './embeddingService.js';
import fs from 'fs';

// Load initial product data
const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));

// Cache for embeddings to improve initialization speed
const embeddingCache = new Map();

export async function initializeProducts() {
    try {
        console.log(`Starting to initialize ${products.length} products...`);
        
        // Process embeddings in parallel with a limit of 3 concurrent requests
        const batchSize = 3;
        for (let i = 0; i < products.length; i += batchSize) {
            const batch = products.slice(i, i + batchSize);
            await Promise.all(batch.map(async (product) => {
                try {
                    const text = `${product.title} - ${product.description}`;
                    let embedding;
                    
                    // Check cache first
                    if (embeddingCache.has(text)) {
                        embedding = embeddingCache.get(text);
                    } else {
                        embedding = await getEmbedding(text);
                        embeddingCache.set(text, embedding);
                    }
                    
                    await productCollection.add({
                        ids: [product.id],
                        embeddings: [embedding],
                        metadatas: [product]
                    });
                    console.log(`Added product: ${product.title}`);
                } catch (error) {
                    console.error(`Failed to add product ${product.id}:`, error);
                }
            }));
        }
        console.log('Product initialization completed');
    } catch (error) {
        console.error('Product initialization failed:', error);
        throw error;
    }
}

// Search products with natural language query
export async function searchProducts(query) {
    try {
        const queryEmbedding = await getEmbedding(query);
        const results = await productCollection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: 4
        });
        return results.metadatas[0] || [];
    } catch (error) {
        console.error('Search failed:', error);
        throw error;
    }
}

export async function getSimilarProducts(productId) {
    try {
        const product = products.find(p => p.id === productId);
        if (!product) throw new Error('Product not found');

        const text = `${product.title} - ${product.description}`;
        const embedding = await getEmbedding(text);

        const results = await productCollection.query({
            queryEmbeddings: [embedding],
            nResults: 5,  // Get 5 similar products
            where: { id: { $ne: productId } }  // Exclude the current product
        });

        return results.metadatas[0] || [];
    } catch (error) {
        console.error('Failed to get similar products:', error);
        throw error;
    }
}
