"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMLEIDByName = void 0;
function getMLEIDByName(players, name) {
    let filtered = players.filter(p => p.PLAYERS.Player.toLowerCase() === name.toLowerCase());
    if (filtered.length > 0)
        return filtered[0].PLAYERS.MLEID || -1;
    return -1;
}
exports.getMLEIDByName = getMLEIDByName;
//# sourceMappingURL=mleMeta.js.map