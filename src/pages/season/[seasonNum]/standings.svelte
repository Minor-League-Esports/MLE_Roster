<script>
    import Body from "../../../components/layout/Body.svelte";
    import {Collection} from "sveltefire";
    import {Flex} from "svelte-uikit3";
    import LeagueButton from "../../../components/Standings/LeagueButton.svelte";
    import {flip} from "svelte/animate";
    import {fly} from "svelte/transition";
    import TeamRow from "../../../components/Standings/TeamRow.svelte";
    import CachedQuery from "../../../components/firebase/CachedQuery.svelte";
    import {teamStoreFactory} from "../../../helpers/firebase/FirestoreCacheStoreFactory";
    import StandingsMapper from "../../../components/Standings/StandingsMapper.svelte";
    import {getContext} from "svelte";

    const seasonNum = getContext("seasonNum");
    let _teams;
    let league = "foundation";


</script>

<Body>
<CachedQuery store={teamStoreFactory()} on:data={(e)=>_teams = e.detail.data}>
    <div class="uk-margin uk-text-center">
        <h1 class="uk-margin-remove">Season {seasonNum} standings</h1>
        <span class="uk-text-meta">Based on W% for each team</span>
    </div>
    <Flex wrap="wrap" justification="center">
        <LeagueButton selected={league} league="premier" on:update={(e) => league = e.detail}/>
        <LeagueButton selected={league} league="master" on:update={(e) => league = e.detail}/>
        <LeagueButton selected={league} league="champion" on:update={(e) => league = e.detail}/>
        <LeagueButton selected={league} league="academy" on:update={(e) => league = e.detail}/>
        <LeagueButton selected={league} league="foundation" on:update={(e) => league = e.detail}/>
    </Flex>
    <StandingsMapper {_teams} {seasonNum} {league} let:teams>
        {#each teams as team, i (team.name)}
            <div animate:flip={{duration:500}} in:fly={{x:-100}} out:fly={{x:100}} class="uk-width-1-1">
                <TeamRow position="#{team.standing}" {team} season={seasonNum} {league}
                         mostWins={teams[0].standings["s"+seasonNum][league].win}/>
            </div>
        {/each}
    </StandingsMapper>
</CachedQuery>
</Body>

<style lang="scss">
</style>