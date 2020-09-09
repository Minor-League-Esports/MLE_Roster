import {writable} from "svelte/store";
import {readable} from "svelte/store";

export const ballchasingApiKey = writable(JSON.parse(localStorage.getItem("ballchasingApiKey")) || false);
ballchasingApiKey.subscribe(val => localStorage.setItem("ballchasingApiKey", JSON.stringify(val)));


function parseCached(cached, path) {
    if (cached) {
        try {
            cached = JSON.parse(cached);
        } catch {
            return [false, null];
        }
        if (new Date(cached.timeout) > new Date() && cached[path].length > 0) {
            return [true, cached];
        }
    }
    return [false, null];
}

function setCached(object, path) {
    let cacheObj = {
        [path]: object,
        timeout: new Date().setHours(new Date().getHours() + 1)
    };
    console.log(cacheObj);
    localStorage.setItem(path, JSON.stringify(cacheObj));
}

/**
 *
 * @param set {Function<void>}
 * @param query {firebase.firestore.Query}
 * @param path {string}
 * @param preprocess {Function<Object, Object>}
 * @returns {Promise<void>}
 */
async function setCache(set, query, path, preprocess= (v)=>v) {
    let data = [];
    let result = await query.get();
    result.forEach(r => data.push(preprocess(r.data())));
    setCached(data, path);
    set(data);
}

/**
 *
 * @param firestore {firebase.firestore.Firestore}
 * @returns {Readable<Object>}
 */
export const playersFactory = (firestore) => readable(
    localStorage.getItem("players")
        ? JSON.parse((localStorage.getItem("players"))).players
        : [],

    (set) => {
        let [valid, cached] = parseCached(localStorage.getItem("players"), "players");
        if (valid) {
            set(cached.players);
            return () => {};
        } else {
            setCache(set,
                firestore.collection("players")
                    .orderBy("PLAYERS.Player"),
                "players"
            )
            return () => {};
        }
    }
);

function resolvePlayerReferences(team){
    for(let i=0; i<team.players.length; i++){
        team.players[i] = team.players[i].id;
    }
    return team;
}

export const teamsFactory = (firestore) => readable(
    localStorage.getItem("teams")
        ? JSON.parse((localStorage.getItem("teams"))).teams
        : [],
    (set) => {
        let [valid, cached] = parseCached(localStorage.getItem("teams"), "teams");
        if (valid) {
            set(cached.teams);
            return () => {
            };
        } else {
            setCache(set,
                firestore.collection("teams"),
                "teams",
                resolvePlayerReferences
            )
            return () => {};
        }
    }
)