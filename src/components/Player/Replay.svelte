<script>
    import {Flex} from "svelte-uikit3";
    import {onMount} from "svelte";

    export let replay = {};
    export let id = "";
    let team = replay.blue.players.some(p => p.id.id === id) ? "Blue" : "Orange";
    let loss, win;


    onMount(() => {
        if (!replay.blue.goals) replay.blue.goals = 0;
        if (!replay.orange.goals) replay.orange.goals = 0;
        loss = team === "Blue" && replay.blue.goals < replay.orange.goals || team === "Orange" && replay.orange.goals < replay.blue.goals;
        win = team === "Blue" && replay.blue.goals > replay.orange.goals || team === "Orange" && replay.orange.goals > replay.blue.goals
    })
</script>


<a href="https://ballchasing.com/replay/{replay.id}" target="_blank" class="uk-link-reset uk-box-shadow-hover-medium">
    <div class="uk-box-shadow-hover-medium uk-padding-small">
        <h4 class="uk-margin-small-right uk-margin-remove-bottom">{replay.replay_title}</h4>
        <Flex justification="between">
            <span></span>
            <span class:uk-text-danger={loss} class:uk-text-success={win}>
                {replay.blue.goals} - {replay.orange.goals}
            </span>
            <span></span>
        </Flex>
    </div>
    <hr/>
</a>
