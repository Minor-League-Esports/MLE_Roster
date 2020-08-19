<script>
    import ProfileLink from "./ProfileLink.svelte";
    export let profile = "";

    const ballchasing = {
        steam: "https://ballchasing.com/player/steam/",
        ps4: "https://ballchasing.com/player/ps4/",
        xbox: ""
    };
    const trackerNet = {
        steam:"https://rocketleague.tracker.network/profile/steam/",
        ps4:"https://rocketleague.tracker.network/profile/ps4/",
        xbox:"https://rocketleague.tracker.network/profile/xbox/"
    };
</script>

<li>
    <ProfileLink {profile} processFunc={encodeURI} urls={trackerNet} text="Tracker Network"/>
</li>
<li>
    <ProfileLink {profile} processFunc={(a)=>a.split(" ").join("_")} urls={ballchasing} text="Ballchasing"/>
</li>