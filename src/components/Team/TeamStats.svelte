<script>
    import SeasonStats from "./SeasonStats.svelte";
    import {Button} from "svelte-uikit3";
    import uikit from "uikit";

    export let team;
    let tabElem;
    $: if(tabElem){
        uikit.tab(tabElem);
    }

</script>
<h2 class="uk-text-center">Team Statistics</h2>

<ul bind:this={tabElem}>
    {#each Object.keys(team.stats) as seasonNum (seasonNum)}
        <li><a class="uk-link-reset uk-padding-small">Season {seasonNum}</a></li>
    {/each}
</ul>
<ul class="uk-switcher">
    {#each Object.keys(team.stats) as seasonNum (seasonNum)}
        <li>
            <SeasonStats season={team.stats[seasonNum]}/>
        </li>
    {/each}
</ul>