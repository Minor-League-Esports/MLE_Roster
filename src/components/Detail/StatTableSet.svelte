<script>
    import {unclean} from "../../helpers/firestore";
    import uikit from "uikit";
    import StatTable from "./StatTable.svelte";
    import StatTableMapper from "./StatTableMapper.svelte";
    import Tab from "../Tab/Tab.svelte";

    export let selectedEntities = [];
    export let league;
    export let rowClassLookup = () => {
    };
    export let statsLookup = () => {
    };
    export let concreteColumns = [];
    export let ignoredCategories = [];
    let statsArray = [];
    $: statsArray = selectedEntities.map(statsLookup).filter(a => Boolean(a));

</script>

<StatTableMapper inputEntities={selectedEntities} {ignoredCategories} {rowClassLookup} {statsLookup} let:mappedEntities let:categories let:tabs>
    {#if selectedEntities && selectedEntities.length > 0}
        <Tab component={StatTable} {tabs} constProps={{concreteColumns, entities: mappedEntities}}>

        </Tab>
    {/if}
</StatTableMapper>
