import { getEmbedding } from './embeddingService.js';

const searchHistory = new Map(); // userId -> [recent searches]

export async function trackSearch(userId, query) {
    if (!searchHistory.has(userId)) {
        searchHistory.set(userId, []);
    }
    const userHistory = searchHistory.get(userId);
    userHistory.unshift({ query, timestamp: Date.now() });
    // Keep last 10 searches
    searchHistory.set(userId, userHistory.slice(0, 10));
}

export async function getPersonalizedRecommendations(userId) {
    const userHistory = searchHistory.get(userId) || [];
    if (userHistory.length === 0) return [];

    // Combine recent search queries
    const combinedQuery = userHistory
        .slice(0, 3)
        .map(h => h.query)
        .join(' ');

    // Use the combined query to find recommendations
    const embedding = await getEmbedding(combinedQuery);
    const results = await productCollection.query({
        queryEmbeddings: [embedding],
        nResults: 4
    });
    
    return results.metadatas[0] || [];
} 