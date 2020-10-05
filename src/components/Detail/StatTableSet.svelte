<script>
    import {unclean} from "../../helpers/firestore";
    import uikit from "uikit";
    import StatTable from "./StatTable.svelte";

    export let selectedEntities = [];
    export let league;
    export let rowClassLookup = ()=>{};
    export let statsLookup = () => {};
    export let concreteColumns = [];
    export let ignoredCategories = [];
    let statsArray = [];
    $: statsArray = selectedEntities.map(statsLookup).filter(a => Boolean(a));

    let categoryTemplate;
    $: if(statsArray){
        let tempArray = statsArray.filter(s => Boolean(s));
        categoryTemplate = {};
        for(let stat of statsArray){
            if(typeof(stat) === "object"){
                categoryTemplate = stat;
                statsArray = tempArray;
                break;
            }
        }
    }

    let tabElem;
    $: if (tabElem) {
        uikit.tab(tabElem);
    }

    const categoryIsVisible = (c) =>{
        return ![...ignoredCategories, "ordinal"].includes(c);
    }
</script>

<ul bind:this={tabElem} class="uk-flex-center">
    {#if selectedEntities && selectedEntities.length > 0}
        {#each Object.keys(categoryTemplate) as category, i}
            {#if categoryIsVisible(category)}
                <li><a about="{category}" href="#">{unclean(category)}</a></li>
            {/if}
        {/each}
    {/if}
</ul>

<ul class="uk-switcher uk-width-1-1">
    {#if selectedEntities && selectedEntities.length > 0}
        {#each Object.keys(categoryTemplate) as category, i}
            {#if categoryIsVisible(category)}
                <StatTable {concreteColumns} {category} entities={selectedEntities} {statsLookup} {rowClassLookup}/>
            {/if}
        {/each}
    {/if}
</ul>