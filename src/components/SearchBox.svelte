<script>
    import Icon from "./uikit/Icon.svelte";
    import {Inline} from "svelte-uikit3";
    import {navigate} from "svelte-routing";

    export let collection = "";

    export let value = "";

    const doSearch = (e) => {
        if(e.keyCode === 13 && collection && value && value.toString().length > 0){
            navigate(`/search/${collection}/${value}`);
        }
    }

</script>

<div class="uk-inline uk-width-3-4 uk-margin-small uk-margin-auto">
        <span>
            <Icon _class="uk-form-icon uk-form-icon-flip" icon="search"/>
        </span>
    <input class="uk-input" bind:value placeholder="By {collection}" on:keyup={doSearch}>
</div>

<style lang="scss">
    div{
        margin: 0 auto;
    }
</style>