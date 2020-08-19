<script>
    export let show = false;
</script>

<span class:uk-hidden={!show} class="uk-overlay uk-overlay-primary uk-position-cover" style="z-index:500000"><span
        uk-spinner class="uk-position-center"/></span>


<style>
    .uk-overlay {
        backdrop-filter: blur(1px);
    }
</style>