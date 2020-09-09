<script>
    import {Flex} from "svelte-uikit3";
    import {Doc} from "sveltefire";
    import SeriesHeader from "../components/Series/SeriesHeader.svelte";
    import Body from "../components/layout/Body.svelte";
    import {sortLeaguesInOrder} from "../helpers/MLE_META";
    import SeriesLeague from "../components/Series/SeriesLeague.svelte";

    export let seasonNum;
    export let matchNum;
    export let seriesNum;
    let seriesMeta = {
        seasonNum,
        matchNum,
        seriesNum
    };
    let series;
</script>
<Body>
    <Doc once={true} path="s11/Match {matchNum}/series/{seriesNum}" on:data={(e)=>series = e.detail.data}>
        <SeriesHeader {series} {...seriesMeta}/>

        {#each Object.keys(series.stats).sort(sortLeaguesInOrder) as league}
            <SeriesLeague {league} {series} />
        {/each}

    </Doc>
</Body>