<script>
    import {setContext} from "svelte";

    export let seasonNum;
    setContext("seasonNum", seasonNum)
</script>

<slot/>