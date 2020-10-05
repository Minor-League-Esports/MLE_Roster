<script>
    export let player;
</script>

{#if typeof(player) !== "undefined"}
    <td class="uk-text-left">
        <a href="/players/{player.id}" target="_blank" class="uk-link-reset">{player.meta.Player} ({player.SALARY.Salary})</a>
    </td>
{:else}
    <td class="uk-text-left">[empty]</td>
{/if}
