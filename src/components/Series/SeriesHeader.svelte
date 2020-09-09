<script>
    import TeamCard from "../Players/TeamCard.svelte";

    export let series;
    export let seasonNum;
    export let matchNum;
    export let seriesNum;
</script>
<header>
    <div class="teamHeads">
        <div>
            <TeamCard width="1-1" team={series.away}/>
        </div>
        <div>
            <TeamCard width="1-1" team={series.home}/>
        </div>
        <span class="noselect">@</span>
    </div>
    <div class="meta uk-background-primary uk-flex uk-light uk-text-center">
        <div class="uk-flex-1">
            <span>Season</span>
            <span>{seasonNum}</span>
        </div>
        <div class="uk-flex-1">
            <span>Match</span>
            <span>{matchNum}</span>
        </div>
        <div class="uk-flex-1">
            <span>Series</span>
            <span>{seriesNum}</span>
        </div>

    </div>
</header>

<style lang="scss">
    header{
        width: 100%;
        position: relative;
        div{
            margin:0;
        }
        .teamHeads {
            width: 100%;
            position: relative;
            display:flex;
            div {
                width: 50%;

            }

            span {
                position: absolute;
                font-size: 3em;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-family: "Industry", sans-serif;
            }
        }
        .meta {
            font-size:1.3em;
            > div {
                display:flex;
                flex-direction: column;
                span:nth-child(2){
                    color:white;
                    font-weight:bold;
                }
                &:not(:last-child){
                    border-right:1px solid white;
                }
            }
        }
    }
</style>

