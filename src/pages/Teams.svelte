<script>
    import {Collection} from "sveltefire";
    import {link} from "svelte-routing";
    import {Flex} from "svelte-uikit3";
    import Body from "../components/layout/Body.svelte";
    import Spinner from "../components/uikit/Spinner.svelte";
    import TeamLogo from "../components/TeamLogo.svelte";
    import TeamCard from "../components/Players/TeamCard.svelte";

    let teams;
    let structure = {};
    $: if (teams) {

        structure = {};
        teams.forEach(t => {
            if (!t.hasOwnProperty("Team")) return;
            if (!structure.hasOwnProperty(t.Conference)) structure[t.Conference] = {};
            if (!structure[t.Conference].hasOwnProperty(t.Division)) structure[t.Conference][t.Division] = {};
            structure[t.Conference][t.Division][t.Team] = t;
        });
        console.log(structure);
    }

</script>

<Body width="3-4">
<div class="uk-width-1-1">
    <h1 class="uk-text-center uk-heading-line"> <span>MLE Teams </span></h1>
</div>
<div class="uk-display-block">
    <Collection once={true} path="teams" on:data={(e)=>teams = e.detail.data}>
        <div slot="loading">
            <Spinner show={true}/>
        </div>
        <div class="uk-width-1-1">
            {#each Object.keys(structure) as conference (conference)}
                <div>
                    <h2 class="uk-text-center uk-width-1-1 uk-heading-divider">{conference} Conference</h2>
                    <Flex wrap="wrap">
                        {#each Object.keys(structure[conference]) as division (division)}
                            <div class="uk-width-1-1 uk-width-1-2@m">
                                <h3 class="uk-text-center uk-width-1-1 uk-margin-small-top"> {division} Division</h3>
                                <Flex wrap="wrap" justification="center">
                                    {#each Object.keys(structure[conference][division]) as teamName (teamName)}
                                        <TeamCard team={structure[conference][division][teamName].name}/>
                                    {/each}
                                </Flex>
                                <hr class="uk-width-1-1"/>
                            </div>
                        {/each}
                    </Flex>

                </div>
            {/each}
        </div>
    </Collection>
</div>
</Body>

