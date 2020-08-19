<script>
    import {eligibleUntil} from "../../helpers/eligibility";

    export let data;

    let eligibility = {};
    $: eligibility = eligibleUntil(data);
</script>

<h3 class="uk-text-center">Eligibility</h3>

<dl class="uk-description-list">
    <dt>Status</dt>
    {#if data.PLAYERS.League === "Premier"}
        <dd>🎉 Premier players do not have eligibility. 🎉</dd>
        {:else}
        <dd>
            {#if data.games.Days_of_Data < 30}
                Not enough data
            {:else if data.eligible}
                Eligible {eligibility.time}
            {:else}
                Not Eligible
            {/if}
        </dd>
        {#if eligibility.reason}
            <dt>Games needed</dt>
            <dd>Doubles: {eligibility.reason.double}</dd>
            <dd>Standard: {eligibility.reason.standard}</dd>
            <dd>Either: {eligibility.reason.all}</dd>
        {/if}
    {/if}
    <dt>Total games played</dt>
    <dd>{data.SALARY.Games_Played}</dd>

</dl>