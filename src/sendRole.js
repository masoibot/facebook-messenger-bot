const request = require('request');
const { roleName, extractUserRole } = require('./DataUtils');

const serverHost = 'http://localhost:3001/play/20509498/do?action=';

async function sendRequest(targetURL, successTxt, failedTxt) {
    return new Promise((resolve, reject) => {
        request.get(`${serverHost + targetURL}`, (err, res, body) => {
            try {
                if (JSON.parse(body).success === true) {
                    resolve(successTxt);
                } else {
                    resolve(failedTxt);
                }
            } catch (e) {
                resolve(failedTxt);
            }
        });
    })
}
async function sendVote(gameData, targetID, userID) {
    console.log(`send Vote ${userID} => ${targetID}`);
    return await sendRequest(`{"roleTarget.voteList.${userID}":"${targetID}"}`, `Đã vote!`, `sendVote_error`);
}
async function sendFire(targetID, fireToKill) {
    console.log(`send Fire ${fireToKill ? 'GIẾT' : 'GHIM'} ${targetID}`);
    return await sendRequest(`{ "roleTarget.fireID": "${targetID}", "roleTarget.fireToKill": ${fireToKill}} `, `Đã bắn!`, `sendFire_error`);
}
async function sendCupid(target1ID, target2ID) {
    console.log(`SEND CUPID ${target1ID} vs ${target2ID} `);
    return await sendRequest(`{"roleTarget.coupleList":["${target1ID}","${target2ID}"]}`, `Đã ghép đôi!`, `sendCupid_error`);
}
async function sendSuperWolf(targetID) {
    console.log(`SEND SUPERWOLF ${targetID}`);
    return await sendRequest(`{"roleTarget.superWolfVictimID":"${targetID}"}`, `Đã nguyền!`, `sendSuperWolf_error`);
}
async function sendWitchSave() {
    console.log(`send WitchSave`);
    return await sendRequest(`{"roleTarget.witchUseSave":true}`, `Đã cứu!`, `sendWitchSave_error`);
}
async function sendWitchKill(targetID) {
    console.log(`send WitchKill ${targetID}`);
    return await sendRequest(`{"roleTarget.witchKillID":"${targetID}"}`, `Đã giết!`, `sendWitchKill_error`);
}
async function sendSave(targetID) {
    console.log(`SEND Save ${targetID} `);
    return await sendRequest(`{"roleTarget.saveID":"${targetID}"}`, `Đã bảo vệ!`, `sendSave_error`);
}
function sendSee(gameData, targetID, userID) {
    console.log(`SEE ${targetID}`);
    let userRole = extractUserRole(gameData, targetID);
    if (userRole == -1 || userRole == -3 || userRole == 8 || targetID == gameData.roleInfo.superWolfVictimID) { // là sói hoặc người hóa sói
        return `🐺${gameData.players.names[targetID]} là PHE SÓI!`;
    } else {
        return `🎅${gameData.players.names[targetID]} là PHE DÂN!`;
    }
}
module.exports = {
    sendVote: sendVote,
    sendSee: sendSee,
    sendSave: sendSave,
    sendFire: sendFire,
    sendCupid: sendCupid,
    sendSuperWolf: sendSuperWolf,
    sendWitchSave: sendWitchSave,
    sendWitchKill: sendWitchKill
}