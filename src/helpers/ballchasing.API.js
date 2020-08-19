export async function getReplays(playerId, authToken) {
    if(localStorage.getItem(playerId) && new Date(JSON.parse(localStorage.getItem(playerId)).timeout) > new Date()){
        return JSON.parse(localStorage.getItem(playerId));
    } else {
        let url = `https://ballchasing.com/api/replays?player-id=${playerId}&count=5`;
        let response = await fetch("https://cors-anywhere.herokuapp.com/" + url,
            {
                headers: {
                    Authorization: authToken
                }
            });
        let data = await response.json();
        data.timeout = new Date().setDate(new Date().getDate() + 1);
        localStorage.setItem(playerId, JSON.stringify(data));
        return data;
    }


}