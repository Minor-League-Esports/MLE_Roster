<script>
    import {link} from "svelte-routing";
    import {fly} from "svelte/transition";
    import {Button, Card, uk_width} from "svelte-uikit3";
    import Icon from "../components/uikit/Icon.svelte";
    import GoogleAuthButton from "../components/auth/GoogleAuthButton.svelte";
</script>

<main in:fly={{y:-50}}>
    <div use:uk_width={"large"}>
        <h1>
            Please sign in </h1>


        <hr/>
        <p>
            SovietShark promises to never use your data, login is required to prevent API abuse. </p>
    </div>
</main>

<style lang="scss">
    main {
        height: 100%;
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