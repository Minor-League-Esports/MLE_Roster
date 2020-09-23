<script>
    import TeamLogo from "../TeamLogo.svelte";
    import BigText from "../BigText.svelte";

    export let team;
    export let season;
    export let league;
    export let mostWins;
    let standings;
    $: standings = team.standings["s" + season][league];
    let stats;
    $: stats = team.stats["s"+season][league];
</script>

<section class="{team.name.toLowerCase()}">
    <div class="team">
        <TeamLogo includeBorder={true} class="uk-margin-auto"/>
        <a href="/team/{team.name}" class="uk-link-reset"><h2>{team.name}</h2></a>
    </div>

    <div class="stats">
        <BigText fontSize="2em" label="WIN %">{stats.GENERAL_TEAM_STATS["Win_%"]}</BigText>
        <hr class="uk-divider-vertical"/>
        <BigText fontSize="2em" label="GOAL DIFF">{stats.GENERAL_TEAM_STATS["GD"]}</BigText>
        <hr class="uk-divider-vertical mobile-break"/>
        <BigText fontSize="2em" label="WINS">{standings.win}</BigText>
        <BigText fontSize="2em" class="uk-padding-small uk-padding-remove-vertical">-</BigText>
        <BigText fontSize="2em" label="LOSSES">{standings.lose}</BigText>
        <hr class="uk-divider-vertical"/>
        <BigText fontSize="2em" label="GAMES BEHIND">{mostWins - standings.win}</BigText>
    </div>
</section>


<style lang="scss">
    section {
        background-color: var(--background-color);
        color: var(--color);
        width: 100%;
        min-height: 4em;
        padding: 0.5em 2em;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0.5em 0 0 0;

        h2 {
            color: inherit;
            margin: 0;

        }
        .team{
            display:flex;
            align-items:center;
            > *{
                margin-left:0.5em;
            }
        }
        .stats {

            display:flex;
            flex-wrap:wrap;
            justify-content:center;
            hr{
                height:2em;

                border-color:currentColor;
                border-width:3px;
                &.mobile-break{
                    width:100%;
                    display:block;
                    height:0;
                    margin:0;
                }
                &:not(.mobile-break){
                    margin:auto 1em;
                }
            }
            .divider {
                font-weight: bolder;
            }
        }
    }
    @media screen and (min-width: 640px){
        section{
            flex-direction:row;
            .team{
                margin-right:auto;
            }
            .stats{
                margin-left: auto;
                flex-wrap:nowrap;
                hr.mobile-break{
                    width:auto;
                    height:2em;
                    margin:auto 1em;
                }
            }
        }
    }
</style>