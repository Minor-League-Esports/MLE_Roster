<script>
    import Body from "../../components/layout/Body.svelte";
    import CachedQuery from "../../components/firebase/CachedQuery.svelte";
    import {allPlayersStoreFactory} from "../../helpers/firebase/FirestoreCacheStoreFactory";
    import PlayerFilterPanel from "../../components/Detail/PlayerFilterPanel.svelte";
    import StatTableSet from "../../components/Detail/StatTableSet.svelte";
    import {ConcreteStatTableColumn} from "../../components/Detail/StatTable.svelte";

    let league;
    let selectedPlayers = [];
    const playerNameColumn = new ConcreteStatTableColumn("Player Name", (t) => t.PLAYERS.Player);
</script>

<Body width="2-3">
    <CachedQuery store={allPlayersStoreFactory()} let:data={allPlayers}>
        <h2>Compare Player Stats</h2>
        <PlayerFilterPanel bind:league {allPlayers} bind:selectedPlayers filterFunction={p=>Boolean(p.stats)} emptyMessage="No players with stats found!"/>

        <StatTableSet selectedEntities={selectedPlayers} {league}
                      statsLookup={(a) => a.stats}
                      concreteColumns={[playerNameColumn]}
                      ignoredCategories={["MLEID","Player"]}
        />
    </CachedQuery>
</Body>