<script>
    import {Flex, Tile} from "svelte-uikit3";
    import {Doc} from "sveltefire";
    import {link} from "svelte-routing";
    import Body from "../components/layout/Body.svelte";
    import TeamCard from "../components/Players/TeamCard.svelte";
    import TeamLogo from "../components/TeamLogo.svelte";

    export let seasonNum;
    export let weekNum;

    let week;
</script>


<Body>
<Doc once={true} path="seasons/s{seasonNum}" on:data={(e)=>week = e.detail.data["Match " + weekNum]}>
    <h1 class="uk-margin-remove">Season {seasonNum} | {week.match}</h1>
    <span class="uk-text-large">{week.days}</span>
    <hr class="uk-width-1-2"/>
    <Flex width="1-1" direction="column" class="uk-text-center">
        {#each week.matches as match}
            <Flex width="1-1" justification="between" alignment="middle">
                <TeamCard width="expand" team={match.away} logoHeight="6em"/>
                <Tile width="auto">at.</Tile>
                <TeamCard width="expand" team={match.home} logoHeight="6em"/>
            </Flex>
            <hr class="uk-width-1-1"/>
        {/each}
    </Flex>
</Doc>
</Body>