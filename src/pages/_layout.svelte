<script>
    import FirebaseInit from "../components/FirebaseInit.svelte";
    import Header from "../components/layout/Header.svelte";
    import TransitionDecorator from "../components/layout/TransitionDecorator.svelte"
</script>

<FirebaseInit>
    <Header/>

    <div class="uk-position-relative">
        <slot decorator={TransitionDecorator}/>
    </div>
</FirebaseInit>

<style>
    div {
        height: calc(100vh - 15em);
        min-height: calc(100vh - 15em);
    }
</style>