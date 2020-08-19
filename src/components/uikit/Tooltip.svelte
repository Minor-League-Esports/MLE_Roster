<script>
    import uikit from 'uikit';
    export let title;
    export let pos = "top";

    let elem;
    $: if(elem){
        uikit.tooltip(elem, {title, pos})
    }
</script>

<span bind:this={elem}>
    <slot/>
</span>