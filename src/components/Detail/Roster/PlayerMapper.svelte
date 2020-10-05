<script>
    import {getPlayers} from "../../Players/playersHelpers";

    export let players = [];
    export let league = "";
    let mappedPlayers = false;


    async function updateMap(){
        const teamPlayers = await getPlayers(players);
        mappedPlayers = teamPlayers.reduce(
            (r, c) => {
                if(c.games.League.toLowerCase() === league.toLowerCase()){
                    r[c.PLAYERS.Role] = c;
                }
                return r;
            }, {}
        )
    }
    $: if(players) updateMap()
</script>
{#if mappedPlayers}
    <slot players={mappedPlayers}/>
{/if}