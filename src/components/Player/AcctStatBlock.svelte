<script>
    import {rankTierLookup} from "../../helpers/MLE_META";
    import {slide} from "svelte/transition";


    export let data;
    export let account_id;
    export let account;
    let isMain = account.startsWith("Main");
    let shown = isMain;

    let stats = data.ranks[account_id.split("] ")[1]];


    const toggle = () => {
        if(!isMain){
            shown = !shown;
        }
    }
</script>

<div class="uk-width-1-2" class:alt={!isMain}>
    <h4 on:click={toggle}>{account.split("_").join(" ")} Stats </h4>

    {#if shown}
        <dl class="uk-description-list" transition:slide>
            <dt>Current Doubles MMR</dt>
            <dd>{stats["2s_MMR"]}</dd>
            <dt>Current Doubles Rank</dt>
            <dd>{rankTierLookup[stats["2s_Tier"]]}</dd>
            <dt>Current Standard MMR</dt>
            <dd>{stats["3s_MMR"]}</dd>
            <dt>Current Standard Rank</dt>
            <dd>{rankTierLookup[stats["3s_Tier"]]}</dd>
        </dl>
    {/if}
</div>

<style lang="scss">
    div {
        float: left;

        &.alt {
            float: right;
            clear: right;

            h4 {
                cursor:pointer;
            }
        }

    }
</style>