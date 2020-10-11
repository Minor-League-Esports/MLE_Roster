<script context="module">
    export function ConcreteStatTableColumn(name, lookupFn, showOnSmall = true) {
        this.name = name;
        this.lookupFn = lookupFn;
        this.showOnSmall = showOnSmall;
    }
</script>
<script>
    import {unclean} from "../../helpers/firestore";
    import StatTableMapper from "./StatTableMapper.svelte";
    import {slide} from "svelte/transition"

    export let entities = [];
    export let category = "";
    export let concreteColumns = [];

    let columns = [];
    $: if (entities.length > 0) {
        columns = entities.reduce((r, c) => {
            let stats = c.stats;
            if (stats && stats[category] && stats[category].ordinal) {
                if (stats[category].ordinal.length > r.length) {
                    return stats[category].ordinal;
                }
            }
            return r;
        }, [])

        if (columns.length === 0) {
            console.debug("StatTable missing ordinal!");
        }
    }
</script>

<table class="uk-table uk-width-1-1@m uk-width-3-4 uk-text-center uk-table-divider uk-table-responsive uk-margin-auto" transition:slide>
    <thead>
    <tr>
        {#each concreteColumns as col}
            <th class="uk-text-center">{col.name}</th>
        {/each}
        {#each columns as col}
            <th class="uk-text-center">{unclean(col)}</th>
        {/each}
    </tr>
    </thead>
    <tbody>
    {#each entities as entity, i}
        <tr class="{entity.rowClass}">
            {#each concreteColumns as col}
                <th class="uk-text-center" style="color:inherit;">
                    {#if col.showOnSmall}
                        <span class="uk-hidden@m">{unclean(col.name)}: </span>
                    {/if}
                    {col.lookupFn(entity.entity) || "-"}
                </th>
            {/each}
            {#each columns as col}
                <td>
                    <span class="uk-hidden@m" style="color:inherit;">{unclean(col)}: </span>
                    {#if entity.stats[category]}
                        {entity.stats[category][col] || "-"}
                    {:else}
                        {"-"}
                    {/if}
                </td>
            {/each}
        </tr>
    {/each}

    </tbody>
</table>

