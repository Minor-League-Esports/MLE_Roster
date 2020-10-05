<script>
    import CachedQuery from "../../components/firebase/CachedQuery.svelte";
    import Body from "../../components/layout/Body.svelte";
    import TeamFilterPanel from "../../components/Detail/TeamFilterPanel.svelte";
    import StatTableSet from "../../components/Detail/StatTableSet.svelte";
    import {ConcreteStatTableColumn} from "../../components/Detail/StatTable.svelte";
    import {teamStoreFactory} from "../../helpers/firebase/FirestoreCacheStoreFactory";

    let league, selectedTeams;

    const teamNameColumn = new ConcreteStatTableColumn("Team Name", (t) => t.name, false);
    const ignoredCategories = [
        "Team"
    ];
</script>

<Body width="2-3">
<CachedQuery store={teamStoreFactory()} let:data={allTeams}>
    <h2>
        Compare Team Stats
    </h2>
    <TeamFilterPanel bind:league {allTeams} bind:selectedTeams />

    <StatTableSet selectedEntities={selectedTeams} {league}
                  rowClassLookup={(a) => `${a.name.toLowerCase()} force-team-colors`}
                  statsLookup={st => st.stats.s11[league] || {}}
                  concreteColumns={[teamNameColumn]}
                  {ignoredCategories}
    />
</CachedQuery>
</Body>