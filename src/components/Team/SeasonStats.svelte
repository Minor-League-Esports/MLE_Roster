<script>
    import LeagueStats from "./LeagueStats.svelte";
    export let season;

    import {Button} from "svelte-uikit3";
    import uikit from "uikit";

    let tabElem;
    $: if(tabElem){
        uikit.tab(tabElem);
    }

</script>

<ul bind:this={tabElem}>
    {#if season.hasOwnProperty("foundation")}
        <li><a class="uk-link-reset uk-padding-small">Foundation</a></li>
    {/if}
    <li><a class="uk-link-reset uk-padding-small">Academy</a></li>
    <li><a class="uk-link-reset uk-padding-small">Champion</a></li>
    {#if season.hasOwnProperty("premier")}
        <li><a class="uk-link-reset uk-padding-small">Premier</a></li>
    {/if}
</ul>


<ul class="uk-switcher">
    {#if season.hasOwnProperty("foundation")}
        <li><LeagueStats leagueName={"Foundation"} league={season["foundation"]}/></li>
    {/if}
    <li><LeagueStats leagueName={"Academy"} league={season["academy"]}/></li>
    <li><LeagueStats leagueName={"Champion"} league={season["champion"]}/></li>
    {#if season.hasOwnProperty("premier")}
        <li><LeagueStats leagueName={"Premier"} league={season["premier"]}/></li>
    {/if}



</ul>

