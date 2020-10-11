<script>
    import Toggle from "../uikit/Toggle.svelte";
    import Icon from "../uikit/Icon.svelte";
    import {Tile, Button, ButtonGroup} from "svelte-uikit3";

    export let minSalary, _minSalary;
    export let maxSalary, _maxSalary;
    export let minMMR, _minMMR;
    export let maxMMR, _maxMMR;
    export let team, teams = [];

    let current = "";
    $: {
        current = {
            FL: "default",
            AL: "default",
            ML: "default",
            CL: "default",
            PL: "default",
            ALL: "default"
        }

        if (minSalary === _minSalary && maxSalary === 10) current.FL = "primary";
        else if (minSalary === 10.5 && maxSalary === 12.5) current.AL = "primary";
        else if (minSalary === 13 && maxSalary === 14.5) current.CL = "primary";
        else if (minSalary === 15 && maxSalary === 16.5) current.ML = "primary";
        else if (minSalary === 17 && maxSalary === _maxSalary) current.PL = "primary";
        else if (minSalary === _minSalary && maxSalary === _maxSalary) current.ALL = "primary";
        current = current;

    }

    function forceRange(v, min, max, decimals=1) {
        if (v < min) return min.toFixed(decimals);
        if (v > max) return max.toFixed(decimals);
        return v.toFixed(decimals);
    }

    let currentMMRIssueAcknowledged = false;

</script>

<div class="uk-flex-1 uk-margin-small">
    <Toggle>
            <span slot="button" class="uk-margin-small-bottom">
                Filters <Icon icon="thumbnails"/>
            </span>
        <Tile style="secondary"
              class="uk-flex uk-flex-top uk-flex-between uk-margin-small-top uk-flex-wrap uk-tile-xsmall" size="xsmall">
            <div class="uk-width-1-2@m uk-width-1-1 uk-padding uk-padding-remove-vertical">
                <h3 class="uk-text-center uk-width-1-1 uk-display-block">Salary</h3>
                <label class="uk-flex uk-width-1-1 uk-flex-middle">
                    <span class="uk-flex-1">Min</span>
                    <input type="number" on:change={()=>minSalary = forceRange(minSalary, _minSalary, maxSalary)}
                           min={_minSalary} bind:value={minSalary} max={maxSalary} step="0.5"
                           class="uk-form-width-small uk-form-small uk-input uk-margin-small-left"/>
                </label>
                <label class="uk-flex uk-width-1-1 uk-flex-middle">
                    <span class="uk-flex-1">Max</span>
                    <input type="number" on:change={()=>maxSalary = forceRange(maxSalary, minSalary, _maxSalary)}
                           min={minSalary} bind:value={maxSalary} max={_maxSalary} step="0.5"
                           class="uk-form-width-small uk-form-small uk-input uk-margin-small-left"/>
                </label>

                <ButtonGroup class="uk-margin-auto uk-flex-center uk-margin-small-top uk-width-1-1">
                    <Button style="{current.FL}" class="uk-padding-small uk-padding-remove-vertical"
                            on:click={()=>{ minSalary=_minSalary; maxSalary=10; }}>
                        FL
                    </Button>
                    <Button style="{current.AL}" class="uk-padding-small uk-padding-remove-vertical"
                            on:click={()=>{ minSalary=10.5;maxSalary=12.5; }}>
                        AL
                    </Button>
                    <Button style="{current.CL}" class="uk-padding-small uk-padding-remove-vertical"
                            on:click={()=>{minSalary=13;maxSalary=14.5;}}>
                        CL
                    </Button>
                    <Button style="{current.ML}" class="uk-padding-small uk-padding-remove-vertical"
                            on:click={()=>{minSalary=15;maxSalary=16.5;}}>
                        ML
                    </Button>
                    <Button style="{current.PL}" class="uk-padding-small uk-padding-remove-vertical"
                            on:click={()=>{minSalary=17;maxSalary=_maxSalary;}}>
                        PL
                    </Button>
                    <Button style="{current.ALL}" class="uk-padding-small uk-padding-remove-vertical"
                            on:click={()=>{minSalary=_minSalary;maxSalary=_maxSalary;}}>
                        All
                    </Button>
                </ButtonGroup>

            </div>
            <hr class="uk-hidden@m uk-width-1-1"/>
            <div class="uk-width-1-2@m uk-width-1-1 uk-padding uk-padding-remove-vertical">
                <h3 class="uk-text-center uk-width-1-1 uk-display-block">Team</h3>
                <select class="uk-select uk-form-width-large uk-margin-auto uk-display-block" bind:value={team}>
                    <optgroup>
                        <option value="">All Teams</option>
                        <option value="FA">Free Agents</option>
                        <option value="WW">Waiver Players</option>
                    </optgroup>
                    <optgroup label="Franchises">
                        {#each teams as team (team)}
                            {#if team !== "FA" && team !== "#N/A" && team !== "WW"}
                                <option value="{team}">{team}</option>
                            {/if}
                        {/each}
                    </optgroup>
                </select>
            </div>
            <hr class="uk-width-1-1"/>
            <div class="uk-width-1-2@m uk-width-1-1 uk-padding uk-padding-remove-vertical">
                <h3 class="uk-text-center uk-width-1-1 uk-display-block">Current MMR</h3>
                {#if currentMMRIssueAcknowledged}
                    <label class="uk-flex uk-width-1-1 uk-flex-middle">
                        <span class="uk-flex-1">Min</span>
                        <input type="number" on:change={()=>minMMR = forceRange(minMMR, _minMMR, maxMMR, 0)}
                               min={_minMMR} bind:value={minMMR} max={maxMMR} step="1"
                               class="uk-form-width-small uk-form-small uk-input uk-margin-small-left"/>
                    </label>
                    <label class="uk-flex uk-width-1-1 uk-flex-middle">
                        <span class="uk-flex-1">Max</span>
                        <input type="number" on:change={()=>maxMMR = forceRange(maxMMR, minMMR, _maxMMR, 0)}
                               min={minMMR} bind:value={maxMMR} max={_maxMMR} step="1"
                               class="uk-form-width-small uk-form-small uk-input uk-margin-small-left"/>
                    </label>
                {:else}
                    <Button on:click={()=>currentMMRIssueAcknowledged = true} class="uk-margin-auto uk-display-block">
                        I understand that current MMR may not be accurate due to issues with the Psyonix API
                    </Button>

                {/if}
            </div>

        </Tile>
    </Toggle>
</div>