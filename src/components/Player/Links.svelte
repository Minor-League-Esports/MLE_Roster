<script>
    import ProfileLinkSet from "./ProfileLinkSet.svelte";

    export let data;
</script>


<h3 class="uk-text-center">Links</h3>
<ul>
    <hr/>
    {#if data.ACCOUNTS}
        {#if data.ACCOUNTS.Main_Profile}
            <li class="uk-text-emphasis">Main Profile</li>
            <ProfileLinkSet profile={data.ACCOUNTS.Main_Profile}/>
            <hr/>
        {/if}
        {#if data.ACCOUNTS.Alt_Profile_1}
            <li class="uk-text-emphasis">Alt Profile #1</li>
            <ProfileLinkSet profile={data.ACCOUNTS.Alt_Profile_1}/>
            <hr/>
        {/if}
        {#if data.ACCOUNTS.Alt_Profile_2}
            <li class="uk-text-emphasis">Alt Profile #2</li>
            <ProfileLinkSet profile={data.ACCOUNTS.Alt_Profile_2}/>
            <hr/>
        {/if}
        {#if data.ACCOUNTS.Alt_Profile_3}
            <li class="uk-text-emphasis">Alt Profile #3</li>
            <ProfileLinkSet profile={data.ACCOUNTS.Alt_Profile_3}/>
            <hr/>
        {/if}
    {/if}
</ul>