import * as sheets from "../helpers/sheets";
import {Sheet} from "../models/SheetModels";

export async function getPlayerDirectory(): Promise<[any, any, any]> {
    console.log("Getting Player Directory Information");
    const DIRECTORY_SHEET = "13yPS53Oe4B97pRsPM9bV4GFvs6b_nZ6KiqPqjCQDb6E";

    const sheetMetadata = await sheets.sheetMeta(DIRECTORY_SHEET, ["Player Directory", "Games Played", "Ineligible List"]);
    if(!sheetMetadata) throw new Error("Player directory came back null!");
    if(!sheetMetadata.sheets || sheetMetadata.sheets.length !== 3) throw new Error("Player directory missing sheets!");

    const directoryMeta = sheetMetadata?.sheets[0]?.properties?.gridProperties;
    const gamesMeta = sheetMetadata?.sheets[1]?.properties?.gridProperties;
    const ineligibleMeta = sheetMetadata?.sheets[2]?.properties?.gridProperties;
    const [directoryValues, gamesValues, ineligibleValues] = await sheets.sheetValues(DIRECTORY_SHEET, [
        `Player Directory!A1:${sheets.columnToLetter(directoryMeta?.columnCount ?? 0)}${directoryMeta?.rowCount ?? 1}`,
        `Games Played!A1:${sheets.columnToLetter(gamesMeta?.columnCount ?? 0)}${gamesMeta?.rowCount ?? 1}`,
        `Ineligible List!A4:A${ineligibleMeta?.rowCount ?? 1}`
    ]);

    if(!directoryValues || !directoryValues.values) throw new Error("Missing player directory values!")
    if(!gamesValues || !gamesValues.values) throw new Error("Missing games played values!");
    if(!ineligibleValues || !ineligibleValues.values) throw new Error("Missing ineligibility values");

    const directoryHeaders: string[][] = [
        directoryValues.values[0]?.map(v => v.split(" ")[0]),
        directoryValues.values[1]?.map(v => v.split(" ").join("_"))
    ];
    const directoryData: any[][] = directoryValues.values?.splice(2);

    const gamesHeaders: string[][] = (gamesValues.values ?? []).splice(0, 3).map((vs:string[]) => vs.map(v => v.split(" ").join("_").replace(/[^a-zA-Z0-9_]/g, "")));
    const gamesData: any[][] = gamesValues.values ?? [];

    const ineligibleHeaders = (ineligibleValues.values ?? []).splice(0,3).map((vs:string[]) => vs.map(v => v.split(" ").join("_").replace(/[^a-zA-Z0-9_]/g, "")));

    const directory = new Sheet(directoryHeaders, directoryData);
    const games = new Sheet(gamesHeaders, gamesData);
    const ineligible = new Sheet(ineligibleHeaders, ineligibleValues.values ?? []);

    // Ignoring overload because the reduce function does not need the additional parameters to function.
    return [
            // @ts-ignore
            directory.data.reduce(sheets.reductionFactory(directory.headers), {}),
            // @ts-ignore
            games.data.reduce(sheets.reductionFactory(games.headers), {}),
            // @ts-ignore
            ineligible.data.reduce(sheets.reductionFactory(ineligible.headers), {}),
        ];
}

export async function getReferenceData(): Promise<[any, any]> {
    console.log("Getting Reference Helper Data...");
    const REFERENCE_SHEET = "1fOSdkuXaITkkf09ePIK8QnEs4K1KZ0eUJRhZCgyY1VY";

    const referenceMeta = await sheets.sheetMeta(REFERENCE_SHEET, ["MLEIDs", "Current Ranks"]);
    if(!referenceMeta || !referenceMeta.sheets || referenceMeta.sheets.length !== 2) throw new Error("Reference Helper Data is incorrect");

    // Get MetaData
    const mleIdsMeta = referenceMeta?.sheets[0]?.properties?.gridProperties;
    const ranksMeta = referenceMeta?.sheets[1]?.properties?.gridProperties;

    // Get Values
    const [mleids, currentRanks] = await sheets.sheetValues(REFERENCE_SHEET,[
        `MLEIDs!A1:C${mleIdsMeta?.rowCount}`,
        `Current Ranks!A1:I${ranksMeta?.rowCount}`
    ]);

    if(!mleids.values || !currentRanks.values) throw new Error("Refernece helper data values are missing!");

    // Get Headers
    const mleid_labels = mleids.values.splice(0,1).map(a => a.map(v=> v.split(" ").join("_")));
    const currentRank_labels = currentRanks.values.splice(0,1).map(a => a.map(v => v.split(" ").join("_")));

    return Promise.all([
        // @ts-ignore
        mleids.values.reduce(sheets.asyncReductionFactory(mleid_labels), {}),
        // @ts-ignore
        currentRanks.values.reduce((p: any, c: string[])=>{
            const obj: any = sheets.coalesce(c, ...currentRank_labels)
            if(!Object.keys(p).includes(c[0])) p[c[0]] = {};
            p[c[0]][obj["Tracker_ID"]] = obj;
            return p;
        },{})
    ]);
}