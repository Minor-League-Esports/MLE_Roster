<script context="module">
    export function ConcreteStatTableColumn(name, lookupFn, showOnSmall = true) {
        this.name = name;
        this.lookupFn = lookupFn;
        this.showOnSmall = showOnSmall;
    }
</script>
<script>
    import {unclean} from "../../helpers/firestore";

    export let rowClassLookup = () => {};
    export let statsLookup = a => a;
    export let entities = [];
    export let category = "";
    export let concreteColumns = [];

    let columns = [];
    let entitiesWithStats = entities.slice();
    $: if(entities.length > 0) {
        entitiesWithStats = entities.slice();
        columns = [];
        for(let entity of entities){
            const stats = statsLookup(entity);
            if(stats && stats[category] && stats[category].ordinal){
                columns = stats[category].ordinal;
                break;
            } else if(!stats){
                entitiesWithStats = entitiesWithStats.filter(ews => ews !== entity);
            }
        }
        if(columns.length === 0){
            console.debug("StatTable missing ordinal!");
        }
    }
</script>

<table class="uk-table uk-width-1-1@m uk-width-3-4 uk-text-center uk-table-divider uk-table-responsive uk-margin-auto">
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
    {#each entitiesWithStats as entity, i}
        <tr class="{rowClassLookup(entity)}">
            {#each concreteColumns as col}
                <th class="uk-text-center" style="color:inherit;">
                    {#if col.showOnSmall}
                        <span class="uk-hidden@m">{unclean(col.name)}: </span>
                    {/if}
                    {col.lookupFn(entity) || "-"}
                </th>
            {/each}
            {#each columns as col}
                <td>
                    <span class="uk-hidden@m" style="color:inherit;">{unclean(col)}: </span>
                    {statsLookup(entity)[category][col] || "-"}
                </td>
            {/each}
        </tr>
    {/each}
    </tbody>
</table>

