<script>
    import {Button} from "svelte-uikit3";

    import {onMount} from "svelte";

    export let text = "";
    let show = false;
</script>


<Button on:click={()=> show=!show} class="uk-display-block uk-margin-auto">
    <slot name="button">
        {text}
    </slot>
</Button>

{#if show}
    <slot/>
{/if}
