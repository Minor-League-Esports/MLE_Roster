<script>
    import Body from "../components/layout/Body.svelte";
    import {Collection} from "sveltefire";
    import {Flex} from "svelte-uikit3";
    import LeagueButton from "../components/Standings/LeagueButton.svelte";
    import {flip} from "svelte/animate";
    import {fly} from "svelte/transition";
    import TeamRow from "../components/Standings/TeamRow.svelte";

    export let seasonNum;
    let _teams, teams = [];
    let league = "foundation";
    $:{
        if (_teams)
            teams = _teams.filter(t => {
                return t.name !== "RFA" && t.name !== "FA" && t.name !== "WW" && t.name !== "N/A" &&
                    Object.keys(t.standings["s"+seasonNum]).includes(league);
            }).sort((t1, t2) => {
                if (t1.standings["s"+seasonNum][league].win > t2.standings["s"+seasonNum][league].win) return -1;
                else if (t1.standings["s"+seasonNum][league].win < t2.standings["s"+seasonNum][league].win) return 1;
                else return 0;
            })
    }

</script>

<Body>
<Collection once={true} path="teams" on:data={(e)=>_teams = e.detail.data}>
    <h1>Season {seasonNum} standings</h1>
    <Flex wrap="wrap" justification="center">
        <LeagueButton selected={league} league="foundation" on:update={(e) => league = e.detail}/>
        <LeagueButton selected={league} league="academy" on:update={(e) => league = e.detail}/>
        <LeagueButton selected={league} league="champion" on:update={(e) => league = e.detail}/>
        <LeagueButton selected={league} league="master" on:update={(e) => league = e.detail}/>
        <LeagueButton selected={league} league="premier" on:update={(e) => league = e.detail}/>
    </Flex>
    {#each teams as team, i (team.name)}
        <div animate:flip={{duration:500}} in:fly={{x:-100}} out:fly={{x:100}} class="uk-width-1-1">
            <TeamRow {team} season={seasonNum} {league} mostWins={teams[0].standings["s"+seasonNum][league].win}/>
        </div>
    {/each}
</Collection>
</Body>

<style lang="scss">
</style>