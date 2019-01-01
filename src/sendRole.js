const request = require('request');

const serverHost = 'localhost:3001';
const targetURL = '/play/20509498/do?action=';

function sendVote(targetID, userID) {
    var ret = "ERR: sendVote";
    request.get(`${serverHost + targetURL}{"voteList.${userID}":"${targetID}"}`, (err, res, body) => {
        console.log("body==", body);
        if (JSON.parse(body).success == true) {
            ret = `${userID} ĐÃ VOTE ${targetID}`;
        }
    });
    console.log(ret);
    return ret;
}
function sendSee(targetID, userID) {
    console.log(`SENDING SEE ${targetID}`);
    return `${targetID} là SÓI :v`;
}
function sendFire(targetID, fireToKill) {
    request.get(`${serverHost + targetURL}{"roleAction.fireID":"${targetID}", "roleAction.fireToKill": ${fireToKill}}`, (err, res, body) => {
        console.log("body==", body);
        if (JSON.parse(body).success == true) {
            ret = `${fireToKill ? 'GIẾT' : 'GHIM'} ${targetID}`;
        }
    });
    console.log(ret);
    return ret
}
function sendCupid(target1ID, target2ID) {
    console.log(`[no request] SEND CUPID ${target1ID} vs ${target2ID}`);
    return `GHÉP ĐÔI ${target1ID} vs ${target2ID}`;
}
module.exports = {
    sendVote: sendVote,
    sendSee: sendSee,
    sendFire: sendFire,
    sendCupid: sendCupid
}