/**
 *
 * @param input {Player[]}
 * @param order {string}
 * @param asc {boolean}
 * @param query {string}
 * @param pageSize {int}
 * @param pages {int}
 * @param page {int}
 * @param minSalary {int}
 * @param maxSalary {int}
 */
import {collectionStore} from "sveltefire/src";
import {readable, writable} from "svelte/store";

export const filterPlayers = (input, order, asc, query, pageSize, pages, page, minSalary, maxSalary, team) => {
    let output = input.filter(item => {
        try {
            return item.PLAYERS.Player.toLowerCase().startsWith(query.toLowerCase())
                && parseFloat(item.SALARY.Salary) >= minSalary && parseFloat(item.SALARY.Salary) <= maxSalary
                && (item.PLAYERS.Team === team || team === "")
        } catch (e) {
            console.debug(e);
            return false
        }
    });
    let mod = asc ? -1 : 1;
    switch (order) {
        case "salary":
            output = output.sort(
                (a, b) => parseFloat(a.SALARY.Salary) < parseFloat(b.SALARY.Salary)
                    ? -1 * mod
                    : parseFloat(a.SALARY.Salary) === parseFloat(b.SALARY.Salary)
                        ? 0
                        : mod
            );
            break;
        case "peakmmr":
            output = output.sort(
                (a, b) => parseInt(a.SALARY.Peak_MMR) < parseInt(b.SALARY.Peak_MMR)
                    ? -1 * mod
                    : parseInt(a.SALARY.Peak_MMR) === parseInt(b.SALARY.Peak_MMR)
                        ? 0
                        : mod
            );
            break;
        default:
            output = output.sort(
                (a, b) => a.PLAYERS.Player < b.PLAYERS.Player
                    ? -1 * mod
                    : a.PLAYERS.Player === b.PLAYERS.Player
                        ? 0
                        : mod
            );
            break;
    }
    pages = Math.floor(output.length / pageSize);
    return [output.slice(page * pageSize, (page + 1) * pageSize), pages];
}


/**
 *
 * @param firestore {firebase.firestore.Firestore}
 */
export const getPlayers = async (firestore) => {
    let cached = sessionStorage.getItem("players");
    try {
        if (cached) {
            cached = JSON.parse(cached);
            if (new Date(cached.timeout) > new Date() && cached.players.length > 0) {
                // Use Cache
                // While this store isn't really used as a store, it maintains compatibility in the non-cached case.
                return cached.players;
            }
        }
    } catch {
    }
    // Failed to use cache
    let data = [];
    let result = await firestore.collection("players")
        .orderBy("PLAYERS.Player")
        .get();

    result.forEach(r=>data.push(r.data()));

    let cacheObj = {
        players: data,
        timeout: new Date().setHours(new Date().getHours() + 1)
    }
    sessionStorage.setItem("players", JSON.stringify(cacheObj));
    return data;
}
export const getPlayer = async (firestore, player_id) => {
    // getPlayers will create the cache if needed
    let players = await getPlayers(firestore);
    return players.filter(p => p.PLAYERS.MLEID === player_id)[0] || undefined;
}