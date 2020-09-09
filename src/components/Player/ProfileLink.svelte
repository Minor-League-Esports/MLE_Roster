<script>
    import {Button} from "svelte-uikit3";
    export let profile = "";
    export let processFunc = (a) => a;
    export let urls = {
        steam: "",
        ps4: "",
        xbox: ""
    };
    export let text = "";
</script>

<Button style="text">
{#if profile.platform === "steam"}
    <a href="{urls.steam}{processFunc(profile.id)}" target="_blank" class:uk-disabled={!Boolean(urls.steam)} class="uk-link-reset">
        {text}
    </a>
{:else if profile.platform === "ps4"}
    <a href="{urls.ps4}{processFunc(profile.id).split(' ').join('_')}" target="_blank" class:uk-disabled={!Boolean(urls.ps4)} class="uk-link-reset">
        {text}
    </a>
{:else if profile.platform === "xboxone" || profile.platform === "xbl"}
    <a href="{urls.xbox}{processFunc(profile.id).split(' ').join('_')}" target="_blank" class:uk-disabled={!Boolean(urls.xbox)} class="uk-link-reset">
        {text}
    </a>
{/if}
</Button>