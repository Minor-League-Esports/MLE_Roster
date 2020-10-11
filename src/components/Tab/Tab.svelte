<script context="module">
    export function TabModel(label, props) {
        this.label = label;
        this.props = props;
    }
</script>

<script>
    export let tabs = [];
    export let component;
    export let constProps = [];
    let selected = null;
</script>

<div class="uk-flex uk-flex-wrap uk-align-center uk-flex-center">
    {#each tabs as tab}
        <button on:click={()=>selected = tab} class:active={selected === tab}>{tab.label}</button>
    {/each}
</div>
{#if selected !== null}
    <svelte:component this={component} {...selected.props} {...constProps}/>
{/if}

<style lang="scss">
    button {
        font-size: 1.1em;
        padding: .1em 0.5em;
        margin: .1em 0.5em;
        border-bottom: 1px solid grey;
        background-color:inherit;
        &.active{
            border-bottom-color:black;
            background-color:rgba(0,0,0,0.1);
        }
    }
</style>