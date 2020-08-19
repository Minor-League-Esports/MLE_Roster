<script>
    import FirebaseInit from "./components/FirebaseInit.svelte";
    import {Router, Route} from 'svelte-routing';
    import {Index, SignIn, Players, Player, Teams, Team, Season, Week} from "./pages";
    import Header from "./components/layout/Header.svelte";
    import {fade} from 'svelte/transition';
    import {onMount} from "svelte";
    import UpdatePopup from "./components/layout/UpdatePopup.svelte";

</script>

<FirebaseInit>
        <UpdatePopup/>
        <Header/>
        <div class="uk-position-relative">
            <Router>
                <Route path="/" component={Index}/>
                <Route path="/players" component={Players}/>
                <Route path="/player/:mleid" component={Player}/>

                <Route path="/teams" component={Teams}/>
                <Route path="/team/:team_name" component={Team}/>

                <Route path="/season/:seasonNum" component={Season}/>
                <Route path="/season/:seasonNum/:weekNum" component={Week}/>
                <Route path="/signin" component="{SignIn}"/>
            </Router>
        </div>
</FirebaseInit>

<style>
    div {
        height: calc(100vh - 15em);
        min-height: calc(100vh - 15em);
    }
</style>