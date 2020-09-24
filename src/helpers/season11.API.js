/**
 *
 * @param team {string}
 * @param firestore {firebase.firestore.Firestore}
 * @returns {Promise<Any[]>}
 */
export const getGamesByTeam = async (team, firestore) => {
    let result = await firestore.collectionGroup("series").where("teams", "array-contains", team.name).get();
    let output = [];
    result.forEach(r => output.push(r.data()));
    return output;
}