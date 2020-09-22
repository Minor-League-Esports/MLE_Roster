<script>
    import TeamLogo from "../TeamLogo.svelte";
    export let team;
    export let season;
    export let league;
</script>

<section class="{team.name.toLowerCase()}">
    <div>
        <TeamLogo includeBorder={true}/>
    </div>
    <a href="/team/{team.name}" class="uk-link-reset"><h2>{team.name}</h2></a>
    <div class="scores">
        <span>{team.standings["s"+season][league].win}</span>
        <span class="divider">-</span>
        <span>{team.standings["s"+season][league].lose}</span>
    </div>
</section>


<style lang="scss">
    section{
        background-color:var(--background-color);
        color: var(--color);
        width:100%;
        min-height:4em;
        padding: 0.5em 2em;
        display:flex;
        align-items:center;
        margin:0.5em 0 0 0;
        h2{
            color:inherit;
            margin:0;

        }
        .scores{
            margin-left:auto;
            font-size:2em;
            .divider{
                font-weight:bolder;
            }
        }
    }
</style>