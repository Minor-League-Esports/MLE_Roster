<script>
    import {Button} from "svelte-uikit3";
    import Icon from "./uikit/Icon.svelte";
    export let page, pages;
</script>

<div class="uk-flex uk-flex-column uk-flex-middle">
    <div class="uk-flex uk-flex-center uk-margin-top uk-width-medium">
        {#if page > 0}
            <Button width="1-5" class="uk-padding-remove" on:click={()=>page=0}>
                <Icon icon="chevron-double-left" pointer="true"/>
            </Button>
            <Button width="1-5" class="uk-padding-remove" on:click={()=>page-=1}>
                <Icon icon="chevron-left" pointer="true"/>
            </Button>
        {:else}
            <span class="uk-width-2-5"/>
        {/if}
        <Button disabled={true} width="1-5" class="uk-padding-remove">
            <span>{page + 1}</span>
        </Button>
        {#if page < pages}
            <Button width="1-5" class="uk-padding-remove" on:click={()=>page+=1}>
                <Icon icon="chevron-right" pointer="true"/>
            </Button>
            <Button width="1-5" class="uk-padding-remove" on:click={()=>page=pages}>
                <Icon icon="chevron-double-right" pointer="true"/>
            </Button>
        {:else}
            <span class="uk-width-2-5"/>
        {/if}
    </div>
</div>