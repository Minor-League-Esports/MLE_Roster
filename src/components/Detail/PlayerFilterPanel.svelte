<script>
    import {Tile, Flex} from "svelte-uikit3";
    import Button from "../uikit/Button.svelte";

    export let league = "", allPlayers = [], selectedPlayers = [], filterFunction = (a)=>a, emptyMessage = "No Players Found!";
    let leaguePlayers = [];
    function updateLeaguePlayers() {
        leaguePlayers = allPlayers.filter((player)=>
            player.PLAYERS.League.toLowerCase() === league
        ).filter(filterFunction)
        selectedPlayers = [];
    }

    function addOrRemovePlayer(player){
        if(selectedPlayers.includes(player)){
            selectedPlayers = selectedPlayers.filter(p => p!==player)
        } else {
            selectedPlayers = [...selectedPlayers, player];
        }
    }

    function selectAll(){
        selectedPlayers = leaguePlayers;
    }
    function selectNone(){
        selectedPlayers = [];
    }
</script>

<div class="uk-width-1-1 uk-margin-small">
    <Tile style="secondary" class="uk-flex uk-flex-top uk-flex-between uk-margin-small-top uk-flex-wrap uk-tile-xsmall"
          size="xsmall">
        <div class="uk-width-1-2@m uk-width-1-1 uk-padding uk-padding-remove-vertical">
            <h3>League</h3>
            <select class="uk-select" bind:value={league} on:change={updateLeaguePlayers}>
                <option value="">Select a League</option>
                <option value="premier">Premier League</option>
                <option value="master">Master League</option>
                <option value="champion">Champion League</option>
                <option value="academy">Academy League</option>
                <option value="foundation">Foundation League</option>
            </select>
        </div>
        <hr class="uk-hidden@m uk-width-1-1"/>
        <div class="uk-width-1-2@m uk-width-1-1 uk-padding uk-padding-remove-vertical">
            <div class="uk-width-1-1 uk-margin-small-bottom">
                <Flex width="1-1" justification="between">
                    <Button singleLine={true} on:click={selectAll} class="uk-width-2-5">Select All</Button>
                    <Button singleLine={true} on:click={selectNone} class="uk-width-2-5">Clear Selection</Button>
                </Flex>
            </div>
            <div class="uk-width-1-1 uk-child-width-1-3">
                {#each leaguePlayers as player, i (player.meta.MLEID)}
                    <label class="uk-display-inline-block">
                        <input class="uk-checkbox" type="checkbox" on:change={e => addOrRemovePlayer(player)}
                               checked={selectedPlayers.includes(player)}/>
                        {player.PLAYERS.Player}
                    </label>
                {/each}
                {#if league !== "" && leaguePlayers.length === 0}
                    <p>{emptyMessage}</p>
                {/if}
            </div>
        </div>
    </Tile>
</div>