export async function getSteamMeta(id) {
    let response = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?steamids=${id}&key=54A7A841D97DE6A3B2A86D68E2CE5906`)
    return await response.json();
}