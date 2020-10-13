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
    import Icon from "../uikit/Icon.svelte";

    export let entities = [];
    export let category = "";
    export let concreteColumns = [];

    let columns = [];
    let _entities = entities.slice();
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
    let asc = false;
    let currentSort = "";

    function updateSorting(newCol) {
        if (currentSort === newCol) {
            if (asc) {
                currentSort = "";
                asc = false;
                entities = _entities.slice();
            } else {
                asc = true;
            }
        } else {
            currentSort = newCol;
            asc = false;
        }
    }

    $: if (currentSort || asc) {
        if (currentSort === "") {
            entities = _entities.slice();
        } else {
            console.log(currentSort);

            entities = entities.sort((a, b) => {
                    let _a;
                    let _b;
                    if (currentSort.name) {
                        // Concrete Column sorting

                        _a = parseFloat(currentSort.lookupFn(a.entity));
                        if (isNaN(_a))
                            _a = currentSort.lookupFn(a.entity).toString().toLowerCase();

                        _b = parseFloat(currentSort.lookupFn(b.entity));
                        if (isNaN(_b))
                            _b = currentSort.lookupFn(b.entity).toString().toLowerCase();
                    } else {
                        // Implicit column sorting
                        if(!a.stats.hasOwnProperty(category)) return 1;
                        if(!b.stats.hasOwnProperty(category)) return -1;

                        _a = parseFloat(a.stats[category][currentSort]);
                        if (isNaN(_a)){
                            _a = (a.stats[category][currentSort] || "").toString().toLowerCase();
                        }

                        _b = parseFloat(b.stats[category][currentSort]);
                        if (isNaN(_b)){
                            _b = (b.stats[category][currentSort] || "").toString().toLowerCase();
                        }

                    }
                    if (!_a) return 1;
                    if (!_b) return -1;
                    let mod = asc ? 1 : -1;
                    return _a < _b
                        ? mod
                        : _a > _b
                            ? -1 * mod
                            : 0;
                }
            )
        }
    }
</script>

<table class="uk-table uk-width-1-1@m uk-width-3-4 uk-text-center uk-table-divider uk-table-responsive uk-margin-auto"
       transition:slide>
    <thead>
    <tr>
        <th></th>
        {#each concreteColumns as col}
            <th class="uk-text-center noselect" on:click={() => updateSorting(col)}>
                {col.name}
                {#if currentSort === col}
                    <span>
                        <Icon icon={asc ? "chevron-down" : "chevron-up"}/>
                    </span>
                {/if}
            </th>
        {/each}
        {#each columns as col}
            <th class="uk-text-center noselect" on:click={() => updateSorting(col)}>
                {unclean(col)}
                {#if currentSort === col}
                    <span>
                        <Icon icon={asc ? "chevron-down" : "chevron-up"}/>
                    </span>
                {/if}
            </th>
        {/each}
    </tr>
    </thead>
    <tbody>
    {#each entities as entity, i}
        <tr class="{entity.rowClass}">
            <th>{i+1}</th>
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


<style lang="scss">
    th.noselect {
        cursor: pointer;
    }
</style>