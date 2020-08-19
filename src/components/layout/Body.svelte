<script>
    import {uk_width} from "svelte-uikit3";

    export let width = "1-2";
    export let section = true;
</script>

<main class="uk-width-{width}@m uk-width-1-1" class:uk-section={section}>
    <slot/>
</main>

<style>
    main {
        margin: 0 auto 4em;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>