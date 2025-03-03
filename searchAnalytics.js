class SearchAnalytics {
    constructor() {
        this.searchCounts = new Map();
        this.categoryStats = new Map();
        this.timeBasedStats = [];
    }

    trackSearch(query, category = null, timestamp = Date.now()) {
        // Track query frequency
        this.searchCounts.set(query, (this.searchCounts.get(query) || 0) + 1);
        
        // Track category popularity
        if (category) {
            this.categoryStats.set(category, (this.categoryStats.get(category) || 0) + 1);
        }

        // Track time-based stats
        this.timeBasedStats.push({ query, timestamp });
        
        // Keep only last 1000 searches to prevent memory issues
        if (this.timeBasedStats.length > 1000) {
            this.timeBasedStats = this.timeBasedStats.slice(-1000);
        }
    }

    getPopularSearches(limit = 10) {
        return Array.from(this.searchCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit);
    }

    getPopularCategories() {
        return Array.from(this.categoryStats.entries())
            .sort((a, b) => b[1] - a[1]);
    }

    getTrendingSearches(hours = 24) {
        const cutoff = Date.now() - (hours * 60 * 60 * 1000);
        
        // Get recent searches
        const recentSearches = this.timeBasedStats.filter(s => s.timestamp >= cutoff);
        
        // Count occurrences
        const trending = new Map();
        recentSearches.forEach(s => {
            trending.set(s.query, (trending.get(s.query) || 0) + 1);
        });

        // Convert to array and sort by count
        const sortedTrending = Array.from(trending.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Return top 5 trending searches

        return sortedTrending.length > 0 ? sortedTrending : [['No trending searches yet', 0]];
    }
}

export const searchAnalytics = new SearchAnalytics(); 