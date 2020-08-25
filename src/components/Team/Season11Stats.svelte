<script>
    import {getContext, onMount} from "svelte";
    import {getGamesByTeam} from "../../helpers/season11.API";

    export let team;
    let games;
    const firestore = getContext("firebase").getFirebase().firestore();

    (async () => {
        games = await getGamesByTeam(team, firestore);
    })();

</script>

<h3 class="uk-text-meta">Coming soon!</h3>