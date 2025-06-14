const cache = require('memory-cache');

class CacheService {
    constructor() {
        this.cache = new cache.Cache();
    }

    set(key, value, duration) {
        this.cache.put(key, value, duration);
    }

    get(key) {
        return this.cache.get(key);
    }

    clear(key) {
        this.cache.del(key);
    }

    clearAll() {
        this.cache.clear();
    }
}

module.exports = new CacheService();