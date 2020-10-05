import * as sheets from "../helpers/sheets";
import {sheets_v4} from "googleapis";

export async function getStats(){
    const playerSheetId = "1hrWaUm4T_3cajBxMoLuAVOrLxgEX1fLmKrGznyj8UNE";
    const playerStatAllMeta = await sheets.sheetMeta(playerSheetId, ["Player Stats"]);
    const playerStatMeta:  sheets_v4.Schema$GridProperties | undefined = (playerStatAllMeta.sheets ?? [])[0].properties?.gridProperties;
    if(typeof playerStatMeta === "undefined"){
        throw new Error("Player Stat Sheet Metadata is undefined!");
    }
    const [playerStatSheet] = await sheets.sheetValues(
        playerSheetId,
        [
            `Player Stats!A2:${sheets.columnToLetter(<number>playerStatMeta.columnCount)}${playerStatMeta.rowCount ?? 2 + 1}` // Start at A2 because A1 just says "MLE"
        ]
    );
    const playerStatHeaders: string[][] = playerStatSheet.values?.splice(0, <number>playerStatMeta.frozenRowCount - 1).map(ha => ha.map(h => sheets.clean(h))) ?? [];
    const playerStatData = playerStatSheet.values ?? [];
    const rawStats = playerStatData.map(s => sheets.coalesce(s, ...playerStatHeaders));
    const stats = rawStats.reduce((r, c) => {
        r[c.MLEID] = sheets.attachColumnOrdinals(c);
        return r;
    }, {});
    return stats;
}