/**
 * Map a column number to a spreadsheet designation
 * i.e. 0 => A, 1 => B
 * @param column
 * @returns {string}
 */
exports.columnToLetter = function (column) {
    let temp, letter = '';
    while (column > 0) {
        temp = (column - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        column = (column - temp - 1) / 26;
    }
    return letter;
}

/**
 * Map a spreadsheet column to a number
 * i.e. A => 0, B => 1
 * @param letter
 * @returns {number}
 */
exports.letterToColumn = function (letter) {
    let column = 0, length = letter.length;
    for (let i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
}


const setValue = (ref, currentLevel, val) => {
    if(ref.hasOwnProperty(currentLevel)){
        let temp = ref[currentLevel];
        if(Array.isArray(ref[currentLevel])){
            ref[currentLevel].push(val);
        } else {
            ref[currentLevel] = [temp, val];
        }
    } else {
        ref[currentLevel] = val;
    }
}

/**
 * Map an array of values to an array of object paths
 * @param data  {Array}
 * @param levels {String[]}
 * @returns {{}}
 */
exports.coalesce = async (data, ...levels) => {
    if (!data) return {};
    let output = {};
    let longest = Math.max(...levels.map(l => l.length));
    levels.forEach(level => {
        while (level.length < longest) level.push("");
    });

    let lastLevels = Array(levels.length);
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < lastLevels.length; j++) {
            if (levels[j][i] !== "") {
                lastLevels[j] = levels[j][i];
                lastLevels = [...lastLevels.slice(0, j + 1), ...lastLevels.slice(j + 1).map(() => "")]
            }
        }
        let ref = output;
        for (let j = 0; j < lastLevels.length; j++) {
            let currentLevel = lastLevels[j];
            if(typeof lastLevels[j] === "undefined") {
                j++;
                currentLevel = lastLevels[j];
            }

            if (j + 1 < lastLevels.length) {
                // Can go deeper
                if (lastLevels.slice(j + 1).every(l => l === "" || typeof l === "undefined")) {
                    // Done, set
                    setValue(ref, currentLevel, data[i]);
                    break;
                } else {
                    // Continue
                    if (currentLevel === "") continue;
                    if (!ref[currentLevel]) ref[currentLevel] = {};
                    ref = ref[currentLevel];
                }
            } else {
                // Last level, set no matter what.
                setValue(ref, currentLevel, data[i]);
                break;
            }
        }
    }
    return output;
}

exports.getMLEIDByName = function(players, name){
    let filtered = players.filter(p => p.PLAYERS.Player.toLowerCase() === name.toLowerCase());
    if(filtered.length > 0)
        return filtered[0].PLAYERS.MLEID || -1;
    return -1;
}

exports.asyncReductionFactory = (groups) => async (pP, c) => {
    let p = await pP;
    p[c[0]] = await this.coalesce(c, ...groups);
    return p;
}

/**
 *
 * @param label {String}
 * @returns {String}
 */
exports.clean = (label) => {
    if (label.startsWith("vs.")) label = label.substring(3);
    while (label.startsWith(" ")) label = label.substring(1);
    label = label.split(" ").join("_");
    label = label.split("-").join("_");
    return label;
}