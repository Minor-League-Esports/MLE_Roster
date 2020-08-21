<script>
    import {Flex} from "svelte-uikit3";
    import AcctStatBlock from "./AcctStatBlock.svelte";

    export let data;

    const sortAccounts = (a,b) => {
        /* This reassignment is needed because sort is applied to an Object.entries */
        a = a[0];
        b = b[0];
        if(a.startsWith("Main")) return 1;
        else {
            let ai = parseInt(a.split("_")[2]);
            let bi = parseInt(b.split("_")[2]);
            if(ai < bi) return -1;
            if(ai > bi) return 1;
            return 0;
        }
    }
</script>

<h3 class="uk-text-center">Misc Info</h3>

<Flex>
    <dl class="uk-description-list uk-width-1-2">
        <dt>Platform</dt>
        <dd>{data.PLAYERS.System}</dd>

        <dt>Time Zone</dt>
        <dd>{data.PLAYERS.Time_Zone}</dd>

        {#if data.Role}
            <dt>Role</dt>
            <dd>{data.PLAYERS.Role}</dd>
        {/if}

        <dt>MLEID</dt>
        <dd>{data.PLAYERS.MLEID}</dd>
    </dl>
    <dl class="uk-description-list uk-width-1-2 uk-margin-remove-top">
        <dt>Doubles Games Played</dt>
        <dd>{data.DOUBLES.Games_Played}</dd>
        <dt>Peak Doubles Rank</dt>
        <dd>{data.DOUBLES.Peak_Rank}</dd>
        <dt>Standard Games Played</dt>
        <dd>{data.STANDARD.Games_Played}</dd>
        <dt>Peak Standard Rank</dt>
        <dd>{data.STANDARD.Peak_Rank}</dd>
    </dl>
</Flex>
<hr/>
<div>
{#each Object.entries(data.ACCOUNTS).sort(sortAccounts) as [acct, id] (id)}
    <AcctStatBlock {data} account_id={id} account={acct}/>
{/each}
</div>