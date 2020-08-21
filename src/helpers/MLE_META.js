export const SalaryCapByLeague = {
    "Foundation": 27,
    "Academy": 47.5,
    "Champion": 55,
    "Master": 63
}
export const rankTierLookup = [
    "Unranked",
    "Bronze 1", "Bronze 2", "Bronze 3",
    "Silver 1", "Silver 2", "Silver 3",
    "Gold 1", "Gold 2", "Gold 3",
    "Platinum 1", "Platinum 2", "Platinum 3",
    "Diamond 1", "Diamond 2", "Diamond 3",
    "Champion 1", "Champion 2", "Champion 3",
    "Grand Champion"
];

const leaguesInOrder = [
    "premier",
    "master",
    "champion",
    "academy",
    "foundation",
    "combined"
]
export const sortLeaguesInOrder = (a,b) => {
    a = a.toLowerCase();
    b = b.toLowerCase();

    let ai = leaguesInOrder.indexOf(a.split(" ")[0]);
    let bi = leaguesInOrder.indexOf(b.split(" ")[0]);

    if(ai < bi) return -1;
    if(ai > bi) return 1;
    return 0;

}