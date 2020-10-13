<script>
    import {TabModel} from "../Tab/Tab.svelte";
    import {unclean} from "../../helpers/firestore";

    export let inputEntities
    export let statsLookup;
    export let rowClassLookup;
    export let ignoredCategories;

    let mappedEntities = [];
    let categories = [];
    let tabs = [];
    $: if (inputEntities) {
        mappedEntities = inputEntities.map(entity => {
            const output = {entity};
            if (statsLookup) {
                output.stats = statsLookup(entity);
            }
            if (rowClassLookup) {
                output.rowClass = rowClassLookup(entity);
            }
            return output;
        });
        categories = mappedEntities.reduce((r, c) => {
            let stats = c.stats;

            if (stats && stats && stats.ordinal) {
                if (stats.ordinal.length > r.length) {
                    return stats.ordinal;
                }
            }
            return r;
        }, []).filter(c => ![...ignoredCategories, "ordinal"].includes(c));
        tabs = categories.map((category) => {
            return new TabModel(unclean(category), {category})
        })
    }




</script>
<slot {mappedEntities} {categories} {tabs}/>