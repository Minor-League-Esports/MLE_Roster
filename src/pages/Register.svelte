<script>
    import {fly} from "svelte/transition";
    import {navigate} from "svelte-routing";
    import {Button, uk_width} from "svelte-uikit3";

    const goBack = () => {

        window.history.back();
    }
</script>

<main in:fly={{y:-50}}>
    <div use:uk_width={"large"}>
        <h1>Register</h1>
        <input class="uk-input uk-margin-small" placeholder="Username"/>
        <input class="uk-input uk-margin-small" type="password" placeholder="Password"/>
        <input class="uk-input uk-margin-small" type="password" placeholder="Confirm Password"/>

        <hr class="uk-divider-icon"/>
        <span>or</span>

        <Button on:click={goBack}>Sign In</Button>
    </div>
</main>

<style lang="scss">
    main {
        height: 100vh;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;

        > div {
            box-shadow: 0 0 5px black;
            padding: 2em;
            display: flex;
            flex-direction: column;

        }
    }
</style>