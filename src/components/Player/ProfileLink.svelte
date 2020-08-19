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
{#if profile.startsWith("[steam]")}
    <a href="{urls.steam}{processFunc(profile.split('[steam] ')[1])}" target="_blank" class:uk-disabled={!Boolean(urls.steam)} class="uk-link-reset">
        {text}
    </a>
{:else if profile.startsWith("[ps4]")}
    <a href="{urls.ps4}{processFunc(profile.split('[ps4] ')[1]).split(' ').join('_')}" target="_blank" class:uk-disabled={!Boolean(urls.ps4)} class="uk-link-reset">
        {text}
    </a>
{:else if profile.startsWith("[xboxone]")}
    <a href="{urls.xbox}{processFunc(profile.split('[xboxone] ')[1]).split(' ').join('_')}" target="_blank" class:uk-disabled={!Boolean(urls.xbox)} class="uk-link-reset">
        {text}
    </a>
{/if}
</Button>