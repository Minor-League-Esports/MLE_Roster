<script>
    import SeriesGameModal from "./SeriesGameModal.svelte";
    import {Button} from "svelte-uikit3";


    export let series;
    export let game;
    export let gameNum;
    let show = false;
</script>
<div class="uk-margin-small">
    <Button width="1-2" class="uk-margin-auto" on:click={()=>show=true} style="secondary">
        Game {gameNum + 1}
    </Button>
</div>
{#if show}
    <SeriesGameModal {series} {game} {gameNum} on:close={()=>show=false}/>
{/if}

<style>
    div{
        grid-column-end:span 2;
    }
</style>