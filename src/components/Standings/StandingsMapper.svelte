<script>

    export let seasonNum, _teams, league;
    let teams;

    $:{
        if (_teams) {
            let currentHighest = Number.MAX_SAFE_INTEGER, currentPosition = 0;
            teams = _teams.filter(t => {
                return t.name !== "RFA" && t.name !== "FA" && t.name !== "WW" && t.name !== "N/A" &&
                    Object.keys(t.standings["s" + seasonNum]).includes(league);
            }).sort((t1, t2) => {
                const t1wp = parseFloat(t1.stats[`s${seasonNum}`][league].GENERAL_TEAM_STATS["Win_%"].replace("%",""));
                const t2wp = parseFloat(t2.stats[`s${seasonNum}`][league].GENERAL_TEAM_STATS["Win_%"].replace("%",""));
                if (t1wp > t2wp) return -1;
                else if (t1wp < t2wp) return 1;
                else return 0;
            }).map((team, index) => {
                const wins = team.standings[`s${seasonNum}`][league].win;
                if(wins < currentHighest){
                    currentHighest = team.standings[`s${seasonNum}`][league].win;
                    currentPosition = index + 1;
                    team.standing = currentPosition;
                } else if (wins === currentHighest){
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