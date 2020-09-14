<script>
    import {Flex} from "svelte-uikit3";
    import {Doc, Collection} from "sveltefire";
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
    let seriesData;
</script>
<Body>
    <Doc once={true} path="s11/Match {matchNum}/series/Series {seriesNum}" on:data={(e)=>seriesData = e.detail.data}>
        <SeriesHeader series={seriesData} {...seriesMeta}/>
        <Collection once={true} path="s11/Match {matchNum}/series/Series {seriesNum}/stats" let:data={data}>
            {#each data.sort(sortLeaguesInOrder) as league}
                <SeriesLeague {league}/>
            {/each}
        </Collection>

    </Doc>
</Body>