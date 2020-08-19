<script>
    import {rankTierLookup} from "../../helpers/MLE_META";

    export let data;
    export let account_id;
    export let account;

    let stats = data.ranks[account_id.split("] ")[1]]
</script>

<div class="uk-width-1-2">
    <h4>
        {account.split("_").join(" ")} Stats </h4>

    <dl class="uk-description-list">
        <dt>Current Doubles MMR</dt>
        <dd>{stats["2s_MMR"]}</dd>
        <dt>Current Doubles Rank</dt>
        <dd>{rankTierLookup[stats["2s_Tier"]]}</dd>
        <dt>Current Standard MMR</dt>
        <dd>{stats["3s_MMR"]}</dd>
        <dt>Current Standard Rank</dt>
        <dd>{rankTierLookup[stats["3s_Tier"]]}</dd>
    </dl>
</div>