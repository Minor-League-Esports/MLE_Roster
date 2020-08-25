<script>
    import {Flex, Tile} from "svelte-uikit3";
    import {Doc, Collection} from "sveltefire";
    import {link} from "svelte-routing";
    import Body from "../components/layout/Body.svelte";
    import TeamCard from "../components/Players/TeamCard.svelte";
    import TeamLogo from "../components/TeamLogo.svelte";
    import Spinner from "../components/uikit/Spinner.svelte";

    export let seasonNum;
    export let matchNum;

    let weekMeta;
    let series;
</script>


<Body>
<Doc once={true} path="s11/Match {matchNum}" on:data={(e)=>weekMeta = e.detail.data}>
    <h1 class="uk-margin-remove">Season {seasonNum} | Match {weekMeta.match}</h1>
    <span class="uk-text-large">{weekMeta.days}</span>
    <hr class="uk-width-1-2"/>
    <Flex width="1-1" direction="column" class="uk-text-center">
        <Collection once={true} path="s11/Match {matchNum}/series" on:data={(e)=>series = e.detail.data}>
            <div slot="loading">
                <Spinner show={true}/>
            </div>
            {#each series as match}
                <Flex width="1-1" justification="between" alignment="middle">
                    <Flex width="2-3" justification="between" alignment="middle">
                        <TeamCard width="expand" team={match.away} logoHeight="5em"/>
                        <Tile width="auto">at.</Tile>
                        <TeamCard width="expand" team={match.home} logoHeight="5em"/>
                    </Flex>
                    <Flex width="1-3" justification="between" alignment="middle">
                        {#if match.stats}

                        {:else}
                            <div>
                                <span class="uk-text-large uk-text-meta uk-text-right">Series stats unavailable</span>
                            </div>
                        {/if}

                    </Flex>
                </Flex>
                <hr class="uk-width-1-1"/>
            {/each}
        </Collection>
    </Flex>
</Doc>
</Body>