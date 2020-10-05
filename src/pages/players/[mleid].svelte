<script>
    import {playerStoreFactory} from "../../helpers/firebase/FirestoreCacheStoreFactory";
    import Body from "../../components/layout/Body.svelte";
    import {Tile, Flex, Alert, Button} from "svelte-uikit3";
    import {onMount} from "svelte";
    import {link} from "svelte-routing";
    import ProfileLink from "../../components/Player/ProfileLink.svelte";
    import ProfileLinkSet from "../../components/Player/ProfileLinkSet.svelte";
    import BallchasingStream from "../../components/Player/BallchasingStream.svelte";
    import MiscInfo from "../../components/Player/MiscInfo.svelte";
    import Links from "../../components/Player/Links.svelte";
    import Eligibility from "../../components/Player/Eligibility.svelte";
    import TeamLogo from "../../components/TeamLogo.svelte";
    import CachedQuery from "../../components/firebase/CachedQuery.svelte";

    export let mleid = "";
    let data;


    function getPlatform(id) {

        id = id.split(" ")[0];
        id = id.replace("[", "").replace("]", "");
        switch (id) {
            case "xboxone":
                return "xbox";
            default:
                return id;
        }
    }

    function getId(id) {
        id = id.split("] ")[1];
        return id;
    }

</script>

<Body width="5-6" section="{false}">
<CachedQuery store={playerStoreFactory(mleid)} let:data={data} on:data={(e) => data = e.detail.data}>
    {#if data && !data.ACCOUNTS}
        <Alert style="warning" title="Player is missing a main account!">
            <span/>
        </Alert>
    {/if}
    <header class="uk-width-1-1 uk-text-center uk-padding {data.PLAYERS.Team.toLowerCase()}">
        <TeamLogo height="8em" class="uk-margin-auto"/>
        <h1 class="uk-margin-small-bottom uk-margin-remove-top">{data.PLAYERS.Player}</h1>
        <hr class="uk-width-1-1 uk-margin-remove"/>
        <span class="uk-flex uk-flex-middle uk-margin-small-top uk-flex-center uk-text-bold">
        {data.SALARY.Current_Rank}
            <hr style="height:2em" class="uk-divider-vertical uk-margin-left uk-margin-remove-bottom uk-margin-right"/>
            {data.SALARY.Salary}
            <hr style="height:2em"
                class="uk-divider-vertical uk-margin-left uk-margin-remove-bottom uk-margin-remove-top uk-margin-right"/>
            {data.PLAYERS.League}
            <hr style="height:2em"
                class="uk-divider-vertical uk-margin-left uk-margin-remove-bottom uk-margin-remove-top uk-margin-right"/>
            <a href="/team/{data.PLAYERS.Team}" class="uk-link-reset" use:link>{data.PLAYERS.Team}</a>
        </span>

    </header>
    <div class="uk-width-1-1">
        <div class="flex">
            <Tile style="primary" width="1-1" class="uk-width-1-3@m">
                <MiscInfo {data}/>
            </Tile>
            <Tile style="secondary" class="uk-width-1-3@m" width="1-1">
                <Eligibility {data}/>
            </Tile>
            <Tile class="uk-width-1-3@m" style="muted" width="1-1">
                <Links {data}/>
            </Tile>
        </div>
    </div>
    <Tile style="default" width="1-1">
        {#if data.ACCOUNTS && data.ACCOUNTS.Main_Profile}
            <BallchasingStream platform={data.ACCOUNTS.Main_Profile.platform}
                               id={data.ACCOUNTS.Main_Profile.id}/>
        {/if}
    </Tile>
</CachedQuery>
</Body>

<style lang="scss">
    :global(dl.uk-description-list > dt) {
        color: inherit;
    }

    header {
        background-color: var(--background-color);
        color: var(--color);
        * {
            color:inherit;
        }
        h1 {
            color: inherit;
        }
        span {
            color:inherit;
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