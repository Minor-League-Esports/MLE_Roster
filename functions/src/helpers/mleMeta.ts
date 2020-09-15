export function getMLEIDByName(players: any[], name: string){
    const filtered = players.filter(p => p.PLAYERS.Player.toLowerCase() === name.toLowerCase());
    if(filtered.length > 0)
        return filtered[0].PLAYERS.MLEID || -1;
    return -1;
}
