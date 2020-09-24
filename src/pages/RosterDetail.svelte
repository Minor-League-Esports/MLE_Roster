<script>
    import Body from "../components/layout/Body.svelte";
    import RosterFilterPanel from "../components/Detail/Roster/RosterFilterPanel.svelte";
    import CachedQuery from "../components/firebase/CachedQuery.svelte";
    import {teamStoreFactory} from "../helpers/firebase/FirestoreCacheStoreFactory";
    import PlayerMapper from "../components/Detail/Roster/PlayerMapper.svelte";
    import TeamRosterRow from "../components/Detail/Roster/TeamRosterRow.svelte";


    let currentLeague = "";
    let selectedTeams = [];
</script>


<Body width="2-3">
<h1>Compare Team Rosters</h1>
<CachedQuery store={teamStoreFactory()} let:data={allTeams}>
    <RosterFilterPanel bind:league={currentLeague} {allTeams} bind:selectedTeams/>
    <table class="uk-table uk-width-1-1@m uk-width-3-4 uk-text-center uk-table-divider uk-table-responsive">
        <thead>
        <tr>
            <th class="uk-text-center"></th>
            <th class="uk-text-center">Player A</th>
            <th class="uk-text-center">Player B</th>
            <th class="uk-text-center">Player C</th>
            <th class="uk-text-center">Player D</th>
            <th class="uk-text-center">Reserve A</th>
            <th class="uk-text-center">Reserve B</th>
            <th class="uk-text-center">Reserve C</th>
        </tr>
        </thead>
        {#each selectedTeams as team, i (team.name)}
            <TeamRosterRow league={currentLeague} {team}/>
        {/each}

    </table>
</CachedQuery>
</Body>