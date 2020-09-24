<script>
    import PlayerMapper from "./PlayerMapper.svelte";
    import {fade} from "svelte/transition";
    import TeamRosterCell from "./TeamRosterCell.svelte";

    export let team;
    export let league;
</script>


<PlayerMapper players={team.players} {league} let:players>
    <tr transition:fade class="{team.name.toLowerCase()}">
        <th class="uk-text-right">{team.name}</th>
        <TeamRosterCell player={players["Player A"]}/>
        <TeamRosterCell player={players["Player B"]}/>
        <TeamRosterCell player={players["Player C"]}/>
        <TeamRosterCell player={players["Player D"]}/>

        <TeamRosterCell player={players["Reserve A"]}/>
        <TeamRosterCell player={players["Reserve B"]}/>
        <TeamRosterCell player={players["Reserve C"]}/>
    </tr>
</PlayerMapper>

<style lang="scss">
    tr{
        background-color: var(--background-color);
        color: var(--color);
        th{
            color: var(--color);
            font-weight:bold;
        }
    }
</style>