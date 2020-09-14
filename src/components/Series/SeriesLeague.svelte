<script>
    import {link} from "svelte-routing";
    import {Flex, Button} from "svelte-uikit3";
    import {slide} from "svelte/transition";
    import {Doc} from "sveltefire";
    import {getContext, onMount} from "svelte";
    import {getPlayer} from "../Players/playersHelpers";
    import Icon from "../uikit/Icon.svelte";

    export let league;

    let stats;
    const firestore = getContext("firebase").getFirebase().firestore();


    onMount(async () => {
        league.players = await Promise.all(league.players.map(async p => Object.assign({}, await getPlayer(firestore, p.id), p)));
        homeScore = league.games.filter(g => g.winner === league.home).length;
        awayScore = league.games.filter(g => g.winner === league.away).length;
    })

    let homeScore;
    let awayScore;
    console.log(league);

    let show = false;
</script>


<h2 on:click={()=>show=!show} class="{league.id.toLowerCase()} uk-padding-small uk-width-1-2 uk-text-center">
    {league.id.charAt(0).toUpperCase()}{league.id.slice(1)} League </h2>

{#if show}
    <section transition:slide class="uk-width-1-1 uk-text-center">

        <div class="uk-flex uk-flex-column {league.away.toLowerCase()} uk-padding-small">
            <h3 class="uk-margin-remove">{league.away}</h3>
            <span class="uk-text-large">{awayScore}</span>
        </div>
        <div class="uk-flex uk-flex-column {league.home.toLowerCase()} uk-padding-small">
            <h3 class="uk-margin-remove">{league.home}</h3>
            <span class="uk-text-large">{homeScore}</span>
        </div>
        <!-- /Row -->
        <hr class="fullwidth"/>

        <div class="uk-width-3-4 uk-margin-auto">
            <h4>Players</h4>
            {#each league.players.filter(p => p.PLAYERS.Team === league.away) as player}
                <a use:link href="/player/{player.id}">
                    <Button style="primary" class="uk-margin-small" width="1-1">{player.PLAYERS.Player}
                        | {player.salary}
                        | {player.role}</Button>
                </a>
            {/each}
        </div>
        <div class="uk-width-3-4 uk-margin-auto">
            <h4>Players</h4>
            {#each league.players.filter(p => p.PLAYERS.Team === league.home) as player}
                <a use:link href="/player/{player.id}">
                    <Button style="primary" class="uk-margin-small" width="1-1">{player.PLAYERS.Player}
                        | {player.salary}
                        | {player.role}</Button>
                </a>
            {/each}
        </div>
        <!-- /Row -->
        {#each league.games as game, i}
            {#if game.meta && game.meta.id}
                <a href="https://ballchasing.com/replay/{game.meta.id}" target="_blank" class="fullwidth">
                    <div class="uk-margin-small fullwidth">
                        <Button width="1-2" class="uk-margin-auto {game.winner.toLowerCase()}" } style="secondary">
                            Game {i + 1}
                            <Icon icon="link"/>
                        </Button>
                    </div>
                </a>
            {:else if game.ncp === "TRUE"}
                <div class="uk-margin-small fullwidth">
                    <Button width="1-2" class="uk-margin-auto {game.winner.toLowerCase()}" } style="secondary">
                        Game {i + 1} | NCP (No Match)
                    </Button>
                </div>
            {:else}
                <div class="uk-margin-small fullwidth">
                    <Button width="1-2" class="uk-margin-auto {game.winner.toLowerCase()}" } style="secondary">
                        Game {i + 1} | Replay unavailable
                    </Button>
                </div>
            {/if}
        {/each}
    </section>
{/if}

<hr class="uk-width-3-4"/>

<style lang="scss">
    h2 {
        cursor: pointer;
        color: #F3F2F2;

        &.foundation {
            background-color: #4ebeec;
        }

        &.academy {
            background-color: #0085fa;
        }

        &.champion {
            background-color: #7e55ce;
        }

        &.master {
            background-color: #d10057;
        }

        &.premier {
            background-color: #e2b22d;
        }
    }

    section {
        display: grid;
        grid-template-columns:50% 50%;
        grid-template-rows: auto;

        .fullwidth {
            grid-column-end: span 2;
        }

        * {
            background-color: var(--color);
            color: var(--background-color);
        }
    }
</style>