<script>
    import Season10Stats from "./Season10Stats.svelte";
    import {Button} from "svelte-uikit3";
    import uikit from "uikit";
    import Season11Stats from "./Season11Stats.svelte";

    export let team;
    let tabElem;
    $: if (tabElem) {
        uikit.tab(tabElem);
    }

</script><h2 class="uk-text-center">Team Statistics</h2>

<ul bind:this={tabElem}>
    <li><a class="uk-link-reset uk-padding-small">Season 10</a></li>
    <li><a class="uk-link-reset uk-padding-small">Season 11</a></li>
</ul>
<ul class="uk-switcher">
    <li>
        <Season10Stats season={team.stats["s10"]}/>
    </li>
    <li>
        <Season11Stats team={team}/>
    </li>
</ul>