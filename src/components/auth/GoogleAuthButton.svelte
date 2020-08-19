<script>
    import {Button} from "svelte-uikit3";
    import firebase from "firebase/app";
    import Icon from "../uikit/Icon.svelte";

    let provider = new firebase.auth.GoogleAuthProvider();


    const auth = async () => {
        try {
            let result = await firebase.auth().signInWithPopup(provider);
        } catch (e) {
            console.log(e);
        }
    }

</script>

<Button on:click={auth} class="uk-margin-small">
    Sign in <Icon icon="google"/>
</Button>



<style>

</style>
