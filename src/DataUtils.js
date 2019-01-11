function extractUserRole(gameData, userID) {
    let setup = gameData.setup;
    let ret = 0;
    Object.keys(setup).every((roleCode) => {
        if (setup[roleCode].indexOf(userID) != -1) {
            ret = roleCode;
            return false;
        }
        return true;
    })
    return ret;
}
function isAlive(gameData, userID) {
    return gameData.roleInfo.deathList.indexOf(userID) == -1;
}
const roleName = {
    // PHE SÓI
    "-1": '🐺SÓI',
    "-2": '🐺BÁN SÓI',
    "-3": '🐺SÓI NGUYỀN',

    // PHE DÂN
    "1": '👁TIÊN TRI',
    "2": '🛡BẢO VỆ',
    "3": '🏹THỢ SĂN',
    "4": '🎅DÂN',
    "5": '🧙‍PHÙ THỦY',
    "6": '👴GIÀ LÀNG',
    "7": '👼THẦN TÌNH YÊU',
    "8": '👽NGƯỜI HÓA SÓI',
    "9": '🧚‍THIÊN SỨ',
}
const phe = {
    "9": "Thiên sứ",
    "3": "Cặp đôi",
    "-1": "Sói",
    "1": "DÂN",
}

export const nextStageArr = {
    "readyToGame": "cupid",
    "cupid": "night",
    "night": "superwolf",
    "superwolf": "witch",
    "witch": "discuss",
    "discuss": "vote",
    "vote": "voteResult",
    "voteResult": "lastWord",
    "lastWord": "voteYesNo",
    "voteYesNo": "voteYesNoResult",
    "voteYesNoResult": "cupid"
}
module.exports = {
    extractUserRole: extractUserRole,
    roleName: roleName,
    nextStageArr: nextStageArr,
    isAlive: isAlive,
    phe: phe
}