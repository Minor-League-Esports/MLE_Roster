<script>
    import {Card, Flex, uk_width} from "svelte-uikit3";
    import {Doc} from "sveltefire";
    import {link} from "svelte-routing";
    import {fade} from "svelte/transition";
    import Body from "../components/layout/Body.svelte";

    export let seasonNum;
    let season = {};
    let matchNumbers = {};
    $: matchNumbers = Object.keys(season).sort(
            (a, b) => {
                if (parseInt(a.split(" ")[1]) > parseInt(b.split(" ")[1])) {
                    return 1;
                } else if (parseInt(a.split(" ")[1]) < parseInt(b.split(" ")[1])) {
                    return -1;
                } else {
                    return 0;
                }
            })
</script>

<Body>
<Doc once={true} path="seasons/s{seasonNum}" on:data={(e)=>season = e.detail.data}>
    <header class="uk-text-center">
        <h1>Season {seasonNum}</h1>
        <p class="uk-text-meta uk-margin-remove">Please note this section is a work in progress, and more information is being added</p>
        <p class="uk-text-meta uk-margin-remove"> If you have any requests, please DM me on Discord (SovietShark#8571)</p>
    </header>
    <hr class="uk-width-1-1"/>
    {#each matchNumbers as matchNum}
        <div class="uk-light uk-width-1-1">
            <a use:link href="/season/{seasonNum}/{matchNum.split(' ')[1]}" use:uk_width={"1-1"} class="uk-link-reset"
               in:fade>
                <div class="uk-width-1-1 uk-margin-small uk-padding-small uk-box-shadow-hover-medium uk-tile uk-tile-primary uk-preserve-color">
                    <Flex justification="around" alignment="middle">
                        <h3 class="uk-margin-remove">Week {matchNum.split(" ")[1]}</h3>
                        <span>{season[matchNum].days}</span>
                    </Flex>
                </div>
            </a>
        </div>
    {/each}
</Doc>
</Body>