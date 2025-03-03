import { ChromaClient } from 'chromadb';

const chroma = new ChromaClient({
    path: "http://localhost:8000"  // Default ChromaDB server address
});

let productCollection;

async function initializeChroma() {
    try {
        // Try to get existing collection first
        const collections = await chroma.listCollections();
        const existingCollection = collections.find(c => c.name === 'products');

        if (existingCollection) {
            console.log('Using existing collection: products');
            productCollection = await chroma.getCollection({ name: 'products' });
            // Delete all documents instead of deleting the collection
            return await productCollection.delete({
                where: {},
                deleteAll: true
            });
        } else {
            // Create new collection only if it doesn't exist
            console.log('Creating new collection: products');
            productCollection = await chroma.createCollection({ name: 'products' });
        }

    } catch (error) {
        console.error('Error initializing ChromaDB:', error);
        throw error;
    }
}

await initializeChroma();
export { productCollection };
