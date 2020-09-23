import {cache} from "./cache.API";
import {readable} from "svelte/store";
import {getFirestoreFromContext} from "../firestore";

function FirestoreCacheStoreFactory(queryFn, key, preprocessFn) {
    if (!preprocessFn) preprocessFn = (a) => a;
    if (!key) throw new Error("'key' is required to use the FirestoreCaseStoreFactory");
    if (!queryFn) throw new Error("'queryFn' is required to use the FirestoreCaseStoreFactory");

    return readable({loading: true},
        (set) => {
            (async () => {
                set({loading: true});
                // First, check cache to see if it is valid
                await cache.checkValidity();
                if (cache.contains(key)) {
                    set(cache.get(key))
                } else {
                    const result = await queryFn.get();
                    const data = [];
                    result.forEach(d => data.push(preprocessFn(d.data())));
                    cache.set(key, data);
                    set(data);
                }
            })() // In case of database call, place in async wrapper
            return () => {
                // TODO: Determine needs of unsub function
            }
        }
    )
}

export const playerStoreFactory = () =>
    FirestoreCacheStoreFactory(
        getFirestoreFromContext().collection("players").orderBy("PLAYERS.Player"),
        "all_players"
    )
export const teamStoreFactory = () =>
    FirestoreCacheStoreFactory(
        getFirestoreFromContext().collection("teams"),
        "all_teams",
        function (team) {
            // Team rosters contain references to player objects that break serialization
            // This will strip those references so we store the player ID in the cache
            for (let i = 0; i < team.players.length; i++) {
                team.players[i] = team.players[i].id;
            }
            return team;
        }
    )