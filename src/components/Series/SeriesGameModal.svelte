<script>
    import {createEventDispatcher, onMount} from "svelte";
    import Icon from "../uikit/Icon.svelte";
    import {scale} from "svelte/transition";
    import SeriesGameModalHeader from "./ModalParts/SeriesGameModalHeader.svelte";
    onMount(()=>{
        element.focus();
    })
    const dispatch = createEventDispatcher();


    const keyboardEventListener = (e) => {
        if (e.key === "Escape") dispatch("close");
    }

    export let series;
    export let game;
    export let gameNum;

    let element;
</script>

<svelte:head>
    <style>
        body {
            overflow-y: hidden;
        }
    </style>
</svelte:head>

<section on:keydown={keyboardEventListener} tabindex="-1" transition:scale bind:this={element}>
    <span class="close"><Icon icon="close" on:click={()=>dispatch("close")} options={{ratio: 1.5}}
                              pointer={true}/></span>
    <SeriesGameModalHeader {series} {game} {gameNum}/>

</section>

<style lang="scss">
    section {
        background-color: white;
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        max-height: 100vh;
        width: 100vw;
        max-width: 100vw;
        overflow-y: auto;
        overflow-x: hidden;
        z-index: 100;
        outline:none;

        span.close {
            position: absolute;
            top: 2em;
            right: 2em;
        }
    }
</style>