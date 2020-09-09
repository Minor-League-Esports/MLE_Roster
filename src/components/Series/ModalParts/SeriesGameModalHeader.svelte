<script>
    export let series;
    export let game;
    export let gameNum;
</script>

<header class="uk-margin-small">
    <h1 class="uk-margin-remove">
        Game {gameNum + 1}
    </h1>
    {#if game.replay}
            <span class="uk-text-meta">
                {game.replay.date} {game.replay.time}
            </span>
    {/if}
    {#if game.meta}
            <span class="uk-text-meta">
                {game.meta.map_name || ""}
            </span>
    {/if}
    {#if game.ncp === "TRUE"}
        <span class="uk-text-danger uk-text-large">NCP</span>
    {/if}
</header>