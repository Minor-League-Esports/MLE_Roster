<script>
    import Body from "../layout/Body.svelte";
    import Replay from "./Replay.svelte";
    import {User, Doc} from "sveltefire";
    import {link} from "svelte-routing";
    import {Button} from "svelte-uikit3";
    import {getReplays} from "../../helpers/ballchasing.API";
    import {ballchasingApiKey} from "../../helpers/stores";
    import Icon from "../uikit/Icon.svelte";

    export let platform = "";
    export let id = "";

    let userdata = {};
    let replays = [];
    let fetched = false;

    async function get() {
        let playerId = `${platform}:${id}`;
        replays = (await getReplays(playerId, $ballchasingApiKey)).list || [];
        fetched = true;
    }

    $: if ($ballchasingApiKey && replays.length === 0 && !fetched) get();

    let key = "";
    const setKey = () => {
        ballchasingApiKey.set(key);
    }
</script>


{#if !$ballchasingApiKey}
    <div class="uk-height-1-1 uk-width-1-1 uk-padding uk-text-center">
        <h2>Uh Oh!</h2>
        <p>
            You need to add a ballchasing API Key to use this panel. </p>
        <div class="uk-inline">
            <input bind:value={key} placeholder="API Key" class="uk-input uk-form-width-large">
            <a class="uk-form-icon uk-form-icon-flip" href="https://ballchasing.com/upload" target="_blank"
               title="Get your API Key here">
                <Icon icon="info"/>
            </a>
        </div>
        <Button style="primary" on:click={setKey}>Set <Icon icon="bolt"/></Button>
    </div>
{:else}
    <img src="https://ballchasing.com/static/logo.png" class="uk-margin-auto uk-display-block" alt="Ballchasing Replays"
         height="5em"><a href="https://ballchasing.com" target="_blank"
                         class="uk-link-reset uk-text-center uk-display-block uk-text-large">Replays from
                                                                                             Ballchasing.com</a>
    <hr/>
    {#if replays.length > 0}
        {#each replays as replay, i (replay.id)}
            <Replay {replay} {id}/>
        {/each}
    {:else}
        <h3 class="uk-text-center">No replays available</h3>
        <span class="uk-text-center uk-width-1-1">We only look at the primary account, so alt accounts may have replays available.</span>
        {#if platform === "xbox"}
            <span>Note that xbox players currently cannot be looked up, searching for their name may yield better results.</span>
        {/if}
    {/if}
{/if}

