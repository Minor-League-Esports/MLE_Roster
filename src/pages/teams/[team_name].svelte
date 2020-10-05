<script>
    import Body from "../../components/layout/Body.svelte";
    import {Tile} from "svelte-uikit3";
    import {Doc} from "sveltefire";
    import TeamLogo from "../../components/TeamLogo.svelte";
    import Roster from "../../components/Team/Roster.svelte";
    import TeamStats from "../../components/Team/TeamStats.svelte";

    export let team_name;
    let team;

</script>


<Body width="5-6" section="{false}">
<Doc path="teams/{team_name}" on:data={(e) => team = e.detail.data} once={true} source="cache">
    <header class="uk-width-1-1 uk-text-center uk-padding {team.name.toLowerCase()}">
        <TeamLogo height="8em" class="uk-margin-auto"/>
        <h1 class="uk-margin-small-bottom uk-margin-remove-top">{team.name}</h1>
        <hr class="uk-width-1-1 uk-margin-remove"/>
        <span class="uk-flex uk-flex-middle uk-margin-small-top uk-flex-center uk-text-bold">
            {team.Conference} Conference
            <hr style="height:2em" class="uk-divider-vertical uk-margin-left uk-margin-remove-bottom uk-margin-right"/>
            {team.Division} Division
        </span>
    </header>

    <div class="uk-width-1-1">
        <div class="flex">
            <Tile style="primary" width="1-1" class="uk-width-1-3@m">
                <Roster {team}/>
            </Tile>
            <Tile class="uk-width-2-3@m" style="muted" width="1-1">
                <TeamStats {team}/>
            </Tile>
        </div>
    </div>
</Doc>
</Body>

<style lang="scss">
    header {
        background-color: var(--background-color);
        color: var(--color);

        h1 {
            color: inherit;
        }
    }

    div.flex {
        display: flex;
        flex-direction: column;
    }

    @media screen and (min-width: 960px) {
        div.flex {
            flex-direction: row;
        }
    }

</style>