<script>
    import {Flex} from "svelte-uikit3";
    import {Doc, Collection} from "sveltefire";
    import SeriesHeader from "../components/Series/SeriesHeader.svelte";
    import Body from "../components/layout/Body.svelte";
    import {sortLeaguesInOrder} from "../helpers/MLE_META";
    import SeriesLeague from "../components/Series/SeriesLeague.svelte";
    import {seriesStoreFactory, seriesStatsStoreFactory} from "../helpers/firebase/FirestoreCacheStoreFactory";
    import CachedQuery from "../components/firebase/CachedQuery.svelte";

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
    <CachedQuery store={seriesStoreFactory(seasonNum, matchNum, seriesNum)} on:data={(e)=>seriesData = e.detail.data}>
        <SeriesHeader series={seriesData} {...seriesMeta}/>
        <CachedQuery store={seriesStatsStoreFactory(seasonNum, matchNum, seriesNum)} let:data={data}>
            {#each data.sort(sortLeaguesInOrder) as league}
                <SeriesLeague {league}/>
            {/each}
        </CachedQuery>

    </CachedQuery>
</Body>