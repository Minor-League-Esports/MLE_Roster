<script>
    import {Flex} from "svelte-uikit3";
    import GeneralStats from "./Tables/GeneralStats.svelte";
    import BasicAverages from "./Tables/BasicAverages.svelte";

    export let league;
    export let leagueName;
</script>

<div class="uk-margin-small-top">
    <Flex justification="between">
        <h4>{leagueName}</h4>
        <span>
        League Ranking {league.TEAM_INFO.League_Placement}
    </span>
    </Flex>
    <GeneralStats {league}/>
    <hr class="uk-width-1-2 uk-margin-auto"/>
    <BasicAverages {league}/>


</div>