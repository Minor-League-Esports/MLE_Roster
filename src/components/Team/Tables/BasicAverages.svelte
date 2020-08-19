<script>
    import {Flex} from "svelte-uikit3";

    export let league;
</script>

<div>
    <table class="uk-table uk-table-striped uk-table-small uk-table-hover uk-width-1-1 uk-width-1-2@m uk-margin-remove-top uk-margin-small-right">
        <thead>
        <tr>
            <th colspan="2" class="uk-text-center uk-text-emphasis uk-text-bold">Averages per series</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="uk-width-1-2">Score</td>
            <td class="uk-width-1-2">{league.AVERAGE_PER_SERIES["Sc/Sr"]}</td>
        </tr>
        <tr>
            <td>Goals</td>
            <td>{league.AVERAGE_PER_SERIES["G/Sr"]}</td>
        </tr>
        <tr>
            <td>Saves</td>
            <td>{league.AVERAGE_PER_SERIES["Sv/Sr"]}</td>
        </tr>
        <tr>
            <td>Shots</td>
            <td>{league.AVERAGE_PER_SERIES["Sh/Sr"]}</td>
        </tr>
        </tbody>
    </table>
    <table class="uk-table uk-table-striped uk-table-hover uk-table-small uk-width-1-1 uk-width-1-2@m uk-margin-remove-top uk-margin-small-left">
        <thead>
        <tr>
            <th colspan="2" class="uk-text-center uk-text-emphasis uk-text-bold">Averages per game</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="uk-width-1-2">Score</td>
            <td class="uk-width-1-2">{league.AVERAGE_PER_GAME["Sc/Gm"]}</td>
        </tr>
        <tr>
            <td>Goals</td>
            <td>{league.AVERAGE_PER_GAME["G/Gm"]}</td>
        </tr>
        <tr>
            <td>Saves</td>
            <td>{league.AVERAGE_PER_GAME["Sv/Gm"]}</td>
        </tr>
        <tr>
            <td>Shots</td>
            <td>{league.AVERAGE_PER_GAME["Sh/Gm"]}</td>
        </tr>
        </tbody>
    </table>
</div>

<style>
    div{
        display:flex;
        flex-direction:column;
    }
    @media screen and (min-width:960px){
        div{
            flex-direction:row;
        }
    }
</style>