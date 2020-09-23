<script>
    import {Flex, Tile, Button} from "svelte-uikit3";
    import {Doc, Collection} from "sveltefire";
    import {link} from "svelte-routing";
    import Body from "../components/layout/Body.svelte";
    import TeamCard from "../components/Players/TeamCard.svelte";
    import TeamLogo from "../components/TeamLogo.svelte";
    import Spinner from "../components/uikit/Spinner.svelte";
    import Icon from "../components/uikit/Icon.svelte";
    import CachedQuery from "../components/firebase/CachedQuery.svelte";
    import {matchStoreFactory, matchSeriesStoreFactory} from "../helpers/firebase/FirestoreCacheStoreFactory";

    export let seasonNum;
    export let matchNum;

    let weekMeta;
    let series;
</script>


<Body>
<!-- TODO: Write CachedDoc -->
<CachedQuery store={matchStoreFactory(seasonNum, matchNum)} on:data={(e)=>weekMeta = e.detail.data}>
    <h1 class="uk-margin-remove">Season {seasonNum} | Match {weekMeta.match}</h1>
    <span class="uk-text-large">{weekMeta.days}</span>
    <hr class="uk-width-1-2"/>
    <Flex width="1-1" direction="column" class="uk-text-center">
        <CachedQuery once={true} store={matchSeriesStoreFactory(seasonNum, matchNum)} on:data={(e)=>series = e.detail.data}>
            <div slot="loading">
                <Spinner show={true}/>
            </div>
            {#each series as match}
                <Flex width="1-1" justification="between" alignment="middle">
                    <a use:link href="/team/{match.away}" class="{match.away.toLowerCase()} team uk-width-2-5">
                        <div class="{match.away.toLowerCase()} team uk-width-1-1">
                            <TeamLogo height="4em" includeBorder="true"/>
                            <span class="uk-text-large">{match.away}</span>
                        </div>
                    </a>
                    <Tile width="auto">at.</Tile>
                    <a use:link href="/team/{match.home}" class="{match.home.toLowerCase()} team uk-width-2-5">
                        <div class="{match.home.toLowerCase()} team">
                            <TeamLogo height="4em" includeBorder="true"/>
                            <span class="uk-text-large">{match.home}</span>
                        </div>
                    </a>
                    <!--
                    <TeamCard width="expand" team={match.home} logoHeight="5em"/>
                    -->
                </Flex>
                {#if match.hasStats}
                        <a use:link href="/season/{seasonNum}/{matchNum}/{match.matchNum}" class="uk-width-2-5@m uk-width-1-1 uk-margin-auto"><Button width="1-1" style="primary"><Icon icon="search"/> View Series Stats</Button></a>
                {:else}
                    <div>
                        <span class="uk-text-large uk-text-meta uk-text-right">Series stats unavailable</span>
                    </div>
                {/if}
                <hr class="uk-width-1-1"/>
            {/each}
        </CachedQuery>
    </Flex>
</CachedQuery>
</Body>

<style lang="scss">
    a.team {
        text-decoration-color: var(--color);

        div.team {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1em;
            background-color: var(--background-color);
            color: var(--color);

            span {
                flex: 2;
            }

            h2 {
                color: inherit;
            }
        }
    }

</style>