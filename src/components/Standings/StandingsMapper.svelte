<script>

    export let seasonNum, _teams, league, _standings;
    let teams;
    const excluded_teams = [
        "RFA",
        "FA",
        "WW",
        "WAIVERS",
        "N/A"
    ]
    $:{
        if (_teams && _standings) {
            _teams = _teams.filter(t => !excluded_teams.includes(t.name.toUpperCase())).map((t, i) => {
                if (_standings[i] && _standings[i].name && t.name === _standings[i].name) return Object.assign(t, _standings[i]);
                else return t;
            })
            let currentHighest = Number.MAX_SAFE_INTEGER, currentPosition = 0;
            teams = _teams.filter(t =>
                Object.keys(t.standings["s" + seasonNum]).includes(league)
            ).sort((t1, t2) => {
                const t1wp = parseFloat(t1.stats[`s${seasonNum}`][league].GENERAL_TEAM_STATS["Win_%"].replace("%", ""));
                const t2wp = parseFloat(t2.stats[`s${seasonNum}`][league].GENERAL_TEAM_STATS["Win_%"].replace("%", ""));
                if (t1wp > t2wp) return -1;
                else if (t1wp < t2wp) return 1;
                else return 0;
            }).map((team, index) => {
                const winp = parseFloat(team.stats[`s${seasonNum}`][league].GENERAL_TEAM_STATS["Win_%"].replace("%", ""));
                if (winp < currentHighest) {
                    currentHighest = winp;
                    currentPosition = index + 1;
                    team.standing = currentPosition;
                } else if (winp === currentHighest) {
                    team.standing = currentPosition;
                } else {
                    team.standing = index + 1;
                    currentPosition = index;
                }
                return team;
            })
        }
    }
</script>

<slot teams={teams || []}/>