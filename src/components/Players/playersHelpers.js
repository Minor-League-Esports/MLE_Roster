import {cache} from "../../helpers/firebase/cache.API";
import {attachId, getFirestoreFromContext} from "../../helpers/firestore";


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


export const getAllPlayers = async (firestore=false) => {
    if(!firestore) firestore = getFirestoreFromContext();
    await cache.checkValidity(firestore);
    if(cache.contains("all_players")){
        return cache.get("all_players");
    }


    // Failed to use cache
    let data = [];
    let result = await firestore.collection("players")
        .orderBy("PLAYERS.Player")
        .get();

    result.forEach(r=>data.push(attachId(r)));
    cache.set("all_players", data);

    return data;
}
export const getPlayer = async (player_id, firestore = false) => {
    // getPlayers will create the cache if needed
    let players = await getAllPlayers(firestore);
    return players.filter(p => p.id === player_id)[0] || undefined;
}

export const getPlayers = async (player_ids) => {
    const players = await getAllPlayers();
    return players.filter(p => player_ids.includes(p.id));
}