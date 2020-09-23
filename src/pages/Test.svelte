<script>
    import CachedCollection from "../components/firebase/CachedCollection.svelte";
    import {teamStoreFactory} from "../helpers/firebase/FirestoreCacheStoreFactory";
</script>

<CachedCollection store={teamStoreFactory()} let:data>
    {#each data as team}
        <div>{team.name}</div>
    {/each}

</CachedCollection>