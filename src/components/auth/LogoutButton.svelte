<script>
    import firebase from "firebase/app";
    import {Button} from "svelte-uikit3";

    const logout = async () => {
        await firebase.auth().signOut();
    }
</script>

<Button style="secondary" on:click={logout}>
    Sign out
</Button>

<style>

</style>