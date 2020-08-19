<script>
    import {Flex} from "svelte-uikit3";
    import Icon from "../../uikit/Icon.svelte";
    import Tooltip from "../../uikit/Tooltip.svelte";

    export let league;
</script>
<div>
    <table class="uk-table uk-table-striped uk-table-small uk-width-1-1 uk-width-1-2@m uk-table-hover uk-table-divider uk-margin-small-right">
        <thead>
        <tr>
            <th colspan="3" class="uk-text-center uk-text-emphasis uk-text-bold">General Stats</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="uk-text-bold uk-text-center uk-text-emphasis uk-width-1-3"></td>
            <td class="uk-text-bold uk-text-center uk-text-emphasis uk-width-1-3">Games</td>
            <td class="uk-text-bold uk-text-center uk-text-emphasis uk-width-1-3">Series</td>
        </tr>
        <tr>
            <td>Played</td>
            <td>{league.GENERAL_TEAM_STATS.Games_Played}</td>
            <td>{league.GENERAL_TEAM_STATS.Series_Played}</td>
        </tr>
        <tr>
            <td>Won</td>
            <td>{league.GENERAL_TEAM_STATS.W}</td>
            <td>{league.GENERAL_TEAM_STATS.SW}</td>
        </tr>
        <tr>
            <td>Lost</td>
            <td>{league.GENERAL_TEAM_STATS.L}</td>
            <td>{league.GENERAL_TEAM_STATS.SL}</td>
        </tr>
        <tr>
            <td>Win %</td>
            <td>{league.GENERAL_TEAM_STATS["Win_%"]}</td>
            <td>{league.GENERAL_TEAM_STATS["Series_Win_%"]}</td>
        </tr>
        </tbody>
    </table>
    <table class="uk-table uk-table-striped uk-table-small uk-width-1-1 uk-width-1-2@m uk-margin-remove-top uk-margin-small-left uk-table-divider uk-table-hover">
        <thead>
        <tr>
            <th colspan="3" class="uk-text-center uk-text-emphasis uk-text-bold">Performance Stats</th>
        </tr>
        </thead>
        <tr>
            <td style="width:3em;">
                <Tooltip title="Strength of Schedule: Average win % of opponents faced" pos="right">
                    <Icon icon="info"/>
                </Tooltip>
            </td>
            <td>
                SOS
            </td>
            <td>{league.GENERAL_TEAM_STATS.SOS}</td>
        </tr>
        <tr>
            <td></td>
            <td>SOS Percentile</td>
            <td>{league.GENERAL_TEAM_STATS.SOS_Percentile}</td>
        </tr>
        <tr>
            <td></td>
            <td>MVPR</td>
            <td>{league.GENERAL_TEAM_STATS.MVPR}</td>
        </tr>
        <tr>
            <td></td>
            <td>OMVPR</td>
            <td>{league.GENERAL_TEAM_STATS.OMVPR}</td>
        </tr>
        <tr>
            <td>
                <Tooltip pos="right"
                         title="Rating on a scale of 1-100 using MVPR : OMVPR ratio. Thanks to 4Mans, B++, and Peytoneli for creating this and sharing! See them for more details">
                    <Icon icon="info"/>

                </Tooltip>
            </td>
            <td>

                4mans Rating
            </td>
            <td>{league.GENERAL_TEAM_STATS["4mans_Rating"]}</td>
        </tr>
    </table>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
    }

    @media screen and (min-width: 960px) {
        div {
            flex-direction: row;
        }
    }
</style>