<script>
    import FirebaseInit from "../components/FirebaseInit.svelte";
    import Header from "../components/layout/Header.svelte";
    import TransitionDecorator from "../components/layout/TransitionDecorator.svelte"
    import NotificationWrapper from "../components/uikit/NotificationWrapper.svelte";
</script>

<FirebaseInit>
    <NotificationWrapper>
        <Header/>

        <div class="uk-position-relative">
            <slot decorator={TransitionDecorator}/>
        </div>
    </NotificationWrapper>
</FirebaseInit>

<style>
    div {
        height: calc(100vh - 15em);
        min-height: calc(100vh - 15em);
    }
</style>