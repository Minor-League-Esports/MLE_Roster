<script>
    import {link} from "svelte-routing";
    import {Flex, Button} from "svelte-uikit3";
    import {slide} from "svelte/transition";
    import {getContext, onMount} from "svelte";
    import {getPlayer} from "../Players/playersHelpers";
    import SeriesGame from "./SeriesGame.svelte";

    export let series;
    export let league;

    let stats = series.stats[league];
    const firestore = getContext("firebase").getFirebase().firestore();


    onMount(async () => {
        stats.players = await Promise.all(stats.players.map(async p => Object.assign({}, await getPlayer(firestore, p.id), p)));
    })

    let homeScore = stats.games.filter(g => g.winner === series.home).length;
    let awayScore = stats.games.filter(g => g.winner === series.away).length;
    let show = false;
</script>


<h2 on:click={()=>show=!show}>
    {league.charAt(0).toUpperCase()}{league.slice(1)} League </h2>

{#if show}
    <section transition:slide class="uk-width-1-1 uk-text-center">

        <div class="uk-flex uk-flex-column">
            <h3 class="uk-margin-remove">{series.away}</h3>
            <span class="uk-text-large">{awayScore}</span>
        </div>
        <div class="uk-flex uk-flex-column">
            <h3 class="uk-margin-remove">{series.home}</h3>
            <span class="uk-text-large">{homeScore}</span>
        </div>
        <!-- /Row -->

        <div class="uk-width-3-4 uk-margin-auto">
            <h4>Players</h4>
            {#each stats.players.filter(p => p.PLAYERS.Team === series.away) as player}
                <a use:link href="/player/{player.id}">
                    <Button style="primary" class="uk-margin-small" width="1-1">{player.PLAYERS.Player} | {player.salary}
                                                                                            | {player.role}</Button>
                </a>
            {/each}
        </div>
        <div class="uk-width-3-4 uk-margin-auto">
            <h4>Players</h4>
            {#each stats.players.filter(p => p.PLAYERS.Team === series.home) as player}
                <a use:link href="/player/{player.id}">
                    <Button style="primary" class="uk-margin-small" width="1-1">{player.PLAYERS.Player} | {player.salary}
                                                                                            | {player.role}</Button>
                </a>
            {/each}
        </div>
        <!-- /Row -->
        {#each stats.games as game, i}
            <!-- <SeriesGame {series} {game} gameNum="{i}"/> -->
        {/each}
    </section>
{/if}

<hr class="uk-width-3-4"/>

<style lang="scss">
    h2 {
        cursor: pointer;
    }

    section {
        display: grid;
        grid-template-columns:50% 50%;
        grid-template-rows: auto;
    }
</style>