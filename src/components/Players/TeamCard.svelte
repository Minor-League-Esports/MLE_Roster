<script>
    import {link} from "svelte-routing";
    import TeamLogo from "../TeamLogo.svelte";

    export let team;
    export let width = "1-2";
    export let logoHeight = "8em";
</script>

<a href="/team/{team}" use:link class="uk-width-{width} uk-padding-small {team.toLowerCase()}">
    <article class="uk-tile uk-preserve-color uk-flex uk-flex-column uk-flex-middle
                            uk-box-shadow-hover-large">
        <TeamLogo height={logoHeight} includeBorder={true}/>
        <h2>{team}</h2>
    </article>
</a>

<style lang="scss">

    article {
        background-color: var(--background-color);
        color: var(--color);

        h2 {
            color: inherit;
        }
    }

    a {
        text-decoration-color: var(--color);
    }
</style>
