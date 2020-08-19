<script>
    import Uikit from 'uikit';
    import UikitIcons from 'uikit/dist/js/uikit-icons.min';

    export let options = {};
    export let icon = "";
    export let _class = '';
    export let title = "";
    export let pointer = false;

    UikitIcons(Uikit);
    let target;
    let uk;

    const update = () => {
        options['icon'] = icon;
        uk = Uikit.icon(target, options);
    };

    $: if(icon){
        if(target){
            update();
        } else {
            setTimeout(update, 1);
        }
    }

</script>


<span class={_class} bind:this={target} on:click {title} class:pointer/>

<style>
    .pointer {
        cursor: pointer;
    }
</style>