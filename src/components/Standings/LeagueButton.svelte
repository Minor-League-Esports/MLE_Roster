<script>
    import {createEventDispatcher} from "svelte";

    export let selected;
    export let league;

    const dispatch = createEventDispatcher();
    let active;
    $: active = selected === league;
    let leagueCase = league.charAt(0).toUpperCase() + league.slice(1);
</script>

<div class="uk-width-1-3 uk-width-1-5@s uk-padding-small" on:click={()=>dispatch("update", league)} class:active>
    <img src="/img/leagues/MLE_S11_{leagueCase}_Logo.png" alt="{leagueCase} League"/>
</div>

<style lang="scss">
    .active{
        background-color:rgba(0,0,0,0.2);
    }
</style>