import {getFirestoreFromContext} from "../firestore";

export const cache = {
    /**
     * @param firebase {firebase.firestore.Firestore}
     * @returns {Promise<Date>}
     */
    async getLastUpdated() {
        const firestore = getFirestoreFromContext();
        const lastLookup = new Date(localStorage.getItem("mler_cache_check_ttl") || 0);
        if (lastLookup !== new Date(0) && lastLookup < new Date().setMinutes(new Date().getMinutes() - 1)) {
            // lastLookup is not epoch and is more than 1 minute in the past
            console.debug("MLER | CACHE | Getting last updated date...");
            const metadata = (await firestore.doc("metadata/metadata").get()).data();
            localStorage.setItem("mler_cache_check_ttl", JSON.stringify(new Date()));
            localStorage.setItem("mler_cached_lst_update", JSON.stringify(metadata.last_updated));
            return new Date(metadata.last_updated);
        } else {
            console.debug("MLER | CACHE | Using cached last updated date...");
            return new Date(JSON.parse(localStorage.getItem("mler_cached_lst_update")));
        }
    },

    /**
     * Ensures that the cache is valid before attempting to retrieve the data.
     * Cache validity is done by comparing the remote last updated to the local last updated, with remote being called at most once per minute
     * @returns {Promise<void>}
     */
    async checkValidity() {
        const localLastUpdated = new Date(JSON.parse(localStorage.getItem("mler_lst_updated")) || 0);
        const remoteLastUpdated = await this.getLastUpdated();
        if (localLastUpdated < remoteLastUpdated) {
            console.debug("MLER | CACHE | Cache is invalid!...");
            this.clear();
            localStorage.setItem("mler_lst_updated", JSON.stringify(remoteLastUpdated));
        } else {
            console.debug("MLER | CACHE | Cache is valid!...");
        }
    },



    /**
     * Removes all known cache keys
     */
    clear() {
        console.debug("MLER | CACHE | Clearing cache...");
        const cachedKeys = JSON.parse(localStorage.getItem("mler_cache_index") || "[]");
        for (const key of cachedKeys) {
            localStorage.removeItem(key);
        }
        localStorage.removeItem("mler_cache_index");
    },


    /**
     * Identifies if a cache contains the given key
     * @param key {string}
     * @returns boolean
     */
    contains(key) {
        let cacheIndex = JSON.parse(localStorage.getItem("mler_cache_index") || "[]");
        return cacheIndex.includes(`mler_${key}`);
    },

    /**
     * Retrieves an item from the cache
     * @param key {string}
     */
    get(key) {
        return JSON.parse(localStorage.getItem(`mler_${key}`));
    },

    /**
     * Stores an item in the cache
     * @param key {string}
     * @param value {any}
     */
    set(key, value) {
        key = "mler_" + key;
        localStorage.setItem(key, JSON.stringify(value));
        let previousCacheIndex = JSON.parse(localStorage.getItem("mler_cache_index") || "[]");
        if (!previousCacheIndex.includes(key)) previousCacheIndex.push(key);
        localStorage.setItem("mler_cache_index", JSON.stringify(previousCacheIndex));
    }
}



