<script>
    import {slide} from "svelte/transition";
    import Icon from "./uikit/Icon.svelte";
    export let items = [];
    export let selected = [];
    export let path = "";
    let show = false;

    function addOrRemove(item){
        if(selected.includes(item))
            remove(item);
        else
            add(item);
    }
    function remove(item){
        selected = selected.filter(i => i !== item);
    }
    function add(item){
        selected = [...selected, item];
    }
</script>

<span class="uk-input" on:click={()=>show=true} on:blur={()=>show=false} tabindex="-1">
    {#each selected as i}
        <span class="uk-badge noselect">{i[path]} <Icon icon="close" pointer={true} on:click={(e)=>{remove(i);e.stopPropagation()}}/></span>
    {/each}
    {#if show}
        <div transition:slide class="uk-width-1-2">
            {#each items as item}
                <span class="uk-text-small uk-width-1-2 uk-float-left noselect" class:selected={selected.includes(item)} on:click={()=>addOrRemove(item)}>{item[path]}</span>
            {/each}
        </div>
    {/if}
</span>



<style lang="scss">
    span.uk-input{
        position:relative;
        display:block;
        height:unset;
        min-height:40px;
        div{
            left:0;
            position:absolute;
            top:100%;
            span {
                padding:0.2em;
                cursor:pointer;
                color:black;
                background-color:#FFF;
                &:hover{
                    background-color:#DDD;
                }
                &.selected{
                    background-color:#DDD;
                }
                &.selected:hover{
                    background-color:#BBB;
                }
            }
        }
        span.uk-badge {
            cursor:default;
            margin:2px;
            padding-left:0.5em;
            padding-right:0.5em;
        }
    }
</style>