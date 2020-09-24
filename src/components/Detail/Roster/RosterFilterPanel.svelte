<script>
    import Toggle from "../../uikit/Toggle.svelte";
    import Icon from "../../uikit/Icon.svelte";
    import {Tile} from "svelte-uikit3";

    export let league = "";
    export let selectedTeams, allTeams;
    let leagueTeams = [];

    function updateTeamMap(){
        leagueTeams = allTeams.filter((team) => {
            if (team && team.stats && team.stats.s11) {
                // Team exists and contains needed stats
                return Object.keys(team.stats.s11).includes(league);
            }
            return false;
        });
        selectedTeams = [];
    }

    function addOrRemoveTeam(team){
        if(selectedTeams.includes(team)){
            selectedTeams = selectedTeams.filter(t => t.name !== team.name);
        } else {
            selectedTeams = [...selectedTeams, team];
        }
    }

</script>
<div class="uk-width-1-1 uk-margin-small">
    <Tile style="secondary" class="uk-flex uk-flex-top uk-flex-between uk-margin-small-top uk-flex-wrap uk-tile-xsmall"
          size="xsmall">
        <div class="uk-width-1-2@m uk-width-1-1 uk-padding uk-padding-remove-vertical">
            <h3>League</h3>
            <select class="uk-select" bind:value={league} on:change={updateTeamMap}>
                <option value="">Select a League</option>
                <option value="premier">Premier League</option>
                <option value="master">Master League</option>
                <option value="champion">Champion League</option>
                <option value="academy">Academy League</option>
                <option value="foundation">Foundation League</option>
            </select>
        </div>
        <hr class="uk-hidden@m uk-width-1-1"/>
        <div class="uk-width-1-2@m uk-width-1-1 uk-padding uk-padding-remove-vertical uk-child-width-1-3">
            {#each leagueTeams as team, i (team.name)}
                <label class="uk-display-inline-block">
                    <input class="uk-checkbox" type="checkbox" on:change={e => addOrRemoveTeam(team)} checked={selectedTeams.includes(team)}/>
                    {team.name}
                </label>
            {/each}
        </div>
    </Tile>
</div>