<script>
    import {setContext} from "svelte";

    export let matchNum;
    setContext("matchNum", matchNum)
</script>

<slot/>