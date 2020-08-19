function isEligible(double, standard) {
    double = parseInt(double);
    standard = parseInt(standard);
    return (double >= 10 && standard >= 10 && (double + standard) >= 30);
}
function ineligibleReason(double, standard) {
    double = parseInt(double);
    standard = parseInt(standard);
    let output = {
        double: 0,
        standard: 0,
        all: 0
    }
    if(double < 10) output.double = 10 - double;
    if(standard < 10) output.standard = 10 - standard;
    if(double + standard < 30) output.all = 30 - (double + standard + output.double + output.standard);

    return output;
}

// Specific ordering of the times that appear in the sheet.
let times = [
    "Tomorrow",
    "In_2_days",
    "In_3_days",
    "In_4_days",
    "In_5_days",
    "In_7_days",
    "In_10_days",
    "In_14_days",
]
let timelookup = {
    "Tomorrow": "until tomorrow",
    "In_2_days": "for 2 days",
    "In_3_days": "for 3 days",
    "In_4_days": "for 4 days",
    "In_5_days": "for 5 days",
    "In_7_days": "for 7 days",
    "In_10_days": "for 10 days",
    "In_14_days": "for 14 days",
}

export function eligibleUntil(input) {
    if (!input.eligible) {
        return {
            time: "now",
            reason: ineligibleReason(input.games.Current_Games_Played['2s'],input.games.Current_Games_Played['3s'])
        };
    }
    if (input.games.Days_of_Data < 30) {
        return {
            time: `${30 - input.games.Days_of_Data} days`,
            reason: ineligibleReason(input.games.Current_Games_Played['2s'],input.games.Current_Games_Played['3s'])
        };
    }
    for (let time of times) {
        let data = input.games.If_I_play_no_games_today_I_will_have_this_many_games_played[time];
        if (!isEligible(data['2s'], data['3s'])) {
            return {
                time: timelookup[time],
                reason: ineligibleReason(data['2s'], data['3s'])
            };
        }
    }
    return {
        time: "for more than two weeks",
        reason: false
    };
}

