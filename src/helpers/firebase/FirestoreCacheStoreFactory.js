import {cache} from "./cache.API";
import {readable} from "svelte/store";
import {getFirestoreFromContext} from "../firestore";


function FirestoreCacheStoreFactory({queryFn, key, preprocessFn = (a)=>a, isDoc = false, parentCollectionKey, id}={}) {
    if (!key) throw new Error("'key' is required to use the FirestoreCaseStoreFactory");
    if (!queryFn) throw new Error("'queryFn' is required to use the FirestoreCaseStoreFactory");

    function extractFromParentCollection(set) {
        // We can look in another cache for this document before pulling it directly
        const parentCollection = cache.get(parentCollectionKey);
        if (parentCollection) {
            // Parent Collection exists
            const matches = parentCollection.filter(d => d.id === id);
            if (matches.length === 1) {
                console.debug("Successfully retrieved from parent collection!");
                set(matches[0]);
                return true;
            } else if (matches.length > 1) {
                console.debug("Possibly invalid id detected, multiple matching documents found!");
                console.debug(matches);
            }
            return false;
        }
    }
    function attachId(documentRef) {
        const output = Object.assign(
            {},
            {id: documentRef.id},
            documentRef.data()
        );
        console.log(output);
        return output;
    }

    return readable({loading: true},
        (set) => {
            (async () => {
                set({loading: true});
                // First, check cache to see if it is valid
                await cache.checkValidity();
                if (cache.contains(key)) {
                    set(cache.get(key))
                } else {
                    if(isDoc && parentCollectionKey){
                        if(extractFromParentCollection(set)){
                            return;
                        }
                    }

                    const result = await queryFn.get();
                    const data = [];
                    if (result.forEach) {
                        result.forEach(d => data.push(preprocessFn(attachId(d))));
                    } else {
                        data.push(preprocessFn(attachId(result)));
                    }
                    if (data.length === 1 && isDoc) {
                        cache.set(key, data[0]);
                        set(data[0]);
                    } else if (!isDoc) {
                        cache.set(key, data);
                        set(data);
                    } else {
                        throw new Error("Document expected but received multiple results!");
                    }
                }
            })() // In case of database call, place in async wrapper
            return () => {}
        }
    )
}

export const playerStoreFactory = () =>
    FirestoreCacheStoreFactory({
        queryFn: getFirestoreFromContext().collection("players").orderBy("PLAYERS.Player"),
        key: "all_players"
    });
export const teamStoreFactory = () =>
    FirestoreCacheStoreFactory({
            queryFn: getFirestoreFromContext().collection("teams"),
            key: "all_teams",
            preprocessFn: function (team) {
                // Team rosters contain references to player objects that break serialization
                // This will strip those references so we store the player ID in the cache
                for (let i = 0; i < team.players.length; i++) {
                    team.players[i] = team.players[i].id;
                }
                return team;
            }
        }
    );
export const seasonStoreFactory = (season) =>
    FirestoreCacheStoreFactory({
        queryFn: getFirestoreFromContext().collection(`s${season}`),
        key: `season${season}`
    });
export const matchStoreFactory = (season, match) =>
    FirestoreCacheStoreFactory({
            queryFn: getFirestoreFromContext().doc(`s${season}/Match ${match}`),
            key: `season${season}/match${match}`,
            isDoc: true
    });
export const matchSeriesStoreFactory = (season, match) =>
    FirestoreCacheStoreFactory({
        queryFn: getFirestoreFromContext().collection(`s${season}/Match ${match}/series`),
        key: `season${season}/match${match}/series`
});

export const seriesStoreFactory = (season, match, series) =>
    FirestoreCacheStoreFactory({
        queryFn: getFirestoreFromContext().doc(`s${season}/Match ${match}/series/Series ${series}`),
        key: `season${season}/match${match}/series${series}`,
        parentCollectionKey: `season${season}/match${match}/series`,
        id: `Series ${series}`,
        isDoc: true
})

export const seriesStatsStoreFactory = (season, match, series) =>
    FirestoreCacheStoreFactory({
        queryFn: getFirestoreFromContext().collection(`s${season}/Match ${match}/series/Series ${series}/stats`),
        key: `season${season}/match${match}/series${series}/stats`
    })