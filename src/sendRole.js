const request = require('request');
const { roleName, extractUserRole } = require('./DataUtils');

const serverHost = 'https://masoiapp.herokuapp.com';

async function postRequest(url, body) {
    return new Promise((resolve, reject) => {
        request.post({ url: `${serverHost + url}`, form: body }, (err, res, body) => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                resolve({ success: 'false', err: "post_request_failed" });
            }
        });
    })
}

async function sendRequest(url) {
    return new Promise((resolve, reject) => {
        request.get(`${serverHost + url}`, (err, res, body) => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                resolve({ success: 'false', err: "get_request_failed" });
            }
        });
    })
}
async function sendVoteRequest(action, successTxt, failedTxt) {
    return sendRequest(`/play/20509498/do?action=${action}`).then((data) => {
        if (data.success === true) {
            return successTxt;
        } else {
            return failedTxt;
        }
    })
}
async function sendVote(gameData, targetID, userID) {
    console.log(`send Vote ${userID} => ${targetID}`);
    return await sendVoteRequest(`{"roleTarget.voteList.${userID}":"${targetID}"}`, `Đã vote!`, `sendVote_error`);
}
async function sendFire(targetID, fireToKill) {
    console.log(`send Fire ${fireToKill ? 'GIẾT' : 'GHIM'} ${targetID}`);
    return await sendVoteRequest(`{ "roleTarget.fireID": "${targetID}", "roleTarget.fireToKill": ${fireToKill}} `, `Đã bắn!`, `sendFire_error`);
}
async function sendCupid(target1ID, target2ID) {
    console.log(`SEND CUPID ${target1ID} vs ${target2ID} `);
    return await sendVoteRequest(`{"roleTarget.coupleList":["${target1ID}","${target2ID}"]}`, `Đã ghép đôi!`, `sendCupid_error`);
}
async function sendSuperWolf(targetID) {
    console.log(`SEND SUPERWOLF ${targetID}`);
    return await sendVoteRequest(`{"roleTarget.superWolfVictimID":"${targetID}"}`, `Đã nguyền!`, `sendSuperWolf_error`);
}
async function sendWitchSave() {
    console.log(`send WitchSave`);
    return await sendVoteRequest(`{"roleTarget.witchUseSave":true}`, `Đã cứu!`, `sendWitchSave_error`);
}
async function sendWitchKill(targetID) {
    console.log(`send WitchKill ${targetID}`);
    return await sendVoteRequest(`{"roleTarget.witchKillID":"${targetID}"}`, `Đã giết!`, `sendWitchKill_error`);
}
async function sendSave(targetID) {
    console.log(`SEND Save ${targetID} `);
    return await sendVoteRequest(`{"roleTarget.saveID":"${targetID}"}`, `Đã bảo vệ!`, `sendSave_error`);
}
function sendSee(gameData, targetID, userID) {
    console.log(`SEE ${targetID}`);
    sendVoteRequest(`{"roleTarget.seeID":"${targetID}"}`, `DONE`, `sendSee_error`);
    let userRole = extractUserRole(gameData, targetID);
    if (userRole == -1 || userRole == -3 || userRole == 8 || targetID == gameData.roleInfo.superWolfVictimID) { // là sói hoặc người hóa sói
        return `🐺${gameData.players.names[targetID]} là PHE SÓI!`;
    } else {
        return `🎅${gameData.players.names[targetID]} là PHE DÂN!`;
    }
}
module.exports = {
    postRequest: postRequest,
    sendRequest: sendRequest,
    sendVote: sendVote,
    sendSee: sendSee,
    sendSave: sendSave,
    sendFire: sendFire,
    sendCupid: sendCupid,
    sendSuperWolf: sendSuperWolf,
    sendWitchSave: sendWitchSave,
    sendWitchKill: sendWitchKill
}