<script>
    import Toggle from "../uikit/Toggle.svelte";
    import {Button} from "svelte-uikit3";
    import Icon from "../uikit/Icon.svelte";
    import {fly} from "svelte/transition";

    let show = false;
</script>

<div id="update-container">
    {#if show}
        <section id="updates" transition:fly={{x: 50}}>
            <ul class="uk-list uk-list-hyphen">
                <li>Season 11 game stats are now available via Ballchasing links</li>
                <li>Added Season 11 Game Schedule, more to come in this area soon</li>
                <li>Getting ready for Season 11 stats! This feature will be finished once live replay data becomes available.</li>
            </ul>
            <footer>
                <span class="uk-text-meta">Last Updated 2020-08-25</span>
            </footer>
        </section>
    {/if}
    <span id="update-button" class="uk-button uk-button-default uk-box-shadow-xlarge" on:click={()=>show = !show} in:fly={{y:50, delay:1000}}>
            <Icon icon="info"/>
            What's New
    </span>
</div>

<style lang="scss">
    #update-container {
        position: fixed;
        bottom: 2em;
        right: 0;
        width:100vw;
        z-index:100;
        text-align:right;

        #updates {
            padding:1em;
            min-height:20vh;
            max-height:40vh;
            overflow:auto;
            margin-bottom:4em;
            background-color:white;

            display:flex;
            flex-direction: column;
            justify-content: space-between;
        }

        #update-button {
            border-radius: 1em;
            position: absolute;
            bottom: 0;
            right: 2em;
            height: 2.5em;
            padding: .5em 1em;
            line-height: 1em;
            background-color:white;
        }
    }
    @media screen and (min-width:960px){
        #update-container{
            width:20vw;
            right: 2em;

            #update-button{
                right:0;
            }
        }
    }
</style>