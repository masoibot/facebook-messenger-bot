const { sendVote, sendSee, sendFire, sendCupid } = require('./sendRole')

function startConvo(convo, askItem, index, askSeq) {
    convo.ask(askItem.qreply ? {
        text: askItem.txt,
        quickReplies: askItem.qreply,
    } : askItem.txt, (payload, convo) => {
        let resTxt = payload.message ? payload.message.text : undefined;
        if (resTxt) {
            let result = askItem.callback(convo, index, resTxt);
            if (result) {
                convo.set(`data[${index}]`, result);
                if (index + 1 < askSeq.length) {
                    startConvo(convo, askSeq[index + 1], index + 1, askSeq);
                }
            } else {
                convo.say(`Thao tác sai! Vui lòng thử lại!`);
                convo.end();
            }
        } else {
            convo.say(`Vui lòng thử lại!`);
            convo.end();
        }
    })
}
function voteConvo(chat, askSeq) {
    chat.conversation((convo) => {
        let len = askSeq.length;
        if (len <= 0) return;
        startConvo(convo, askSeq[0], 0, askSeq)
    });
}
function doActionConvo(chat, convo, userRole, playerList, actionCallback, askText, successCallback = () => { }) {
    convo.ask({
        text: askText,
        quickReplies: playerList,
    }, (payload, convo) => {
        let result = payload.message ? actionCallback(payload.message.text) : null;
        if (result != null) {
            convo.say(`=>${result}`).then(() => {
                convo.end();
                successCallback();
            })
        } else {
            doActionConvo(chat, convo, userRole, playerList, actionCallback, `Vui lòng thử lại!\n${askText}`);
            convo.end();
        }
    });
}
function doNightRole(chat, userRole, playerList) {
    if (userRole == 1) { // là tiên tri
        chat.conversation(convo => {
            doActionConvo(chat, convo, userRole, playerList, sendSee, `Tiên tri muốn soi ai?`);
        })
    } else if (userRole == -1 || userRole == -3) {// là SÓI / SÓI NGUYỀN
        chat.say({
            text: `Sói muốn cắn ai?`,
            quickReplies: playerList,
        });
    } else if (userRole == 2) { // là bảo vệ
        chat.say({
            text: `Bảo vệ muốn bảo vệ ai?`,
            quickReplies: playerList,
        });
    } else if (userRole == 3) { // là thợ săn
        voteConvo(chat, [{
            txt: "Thợ săn muốn ghim hãy bắn chết luôn?",
            qreply: ["ghim", "giết"],
            callback: (convo, index, resTxt) => {
                if (/^ghim$/.test(resTxt)) {
                    return 1;
                } else if (/^giết$/.test(resTxt)) {
                    return 2;
                } else {
                    return null;
                }
            }
        }, {
            txt: "Thợ săn muốn ghim ai?",
            qreply: playerList,
            callback: (convo, index, resTxt) => {
                let type = convo.get(`data[${index - 1}]`);
                let voteID;
                if (/[0-9]+:.+|-1/g.test(resTxt)) {
                    voteID = resTxt.match(/-?[0-9]+/g)[0];
                } else {
                    return null;
                }
                if (type == 1) { // ghim
                    sendFire(voteID, false);
                    return true;
                } else if (type == 2) { // bắn
                    sendFire(voteID, true);
                    return true;
                } else {
                    return null;
                }
            }
        }])
    }
}
function mainNightRole(chat, gameData, userID, userRole, playerList) {
    if (gameData.roleAction.superWolfVictimID == userID) { // kẻ bị sói nguyền
        chat.conversation(convo => {
            doActionConvo(chat, convo, userRole, playerList, sendVote, `Sói muốn cắn ai?`, () => {
                doNightRole(chat, userRole, playerList);
            });
        })
    } else {
        doNightRole(chat, userRole, playerList);
    }
};

function doCupidRole(chat, gameData, playerList) {
    voteConvo(chat, [{
        txt: "GHÉP ĐÔI: Chọn người thứ nhất:",
        qreply: playerList,
        callback: (convo, index, resTxt) => {
            if (/[0-9]+:.+/g.test(resTxt)) {
                return resTxt.match(/[0-9]+/g)[0];
            } else {
                return null;
            }
        }
    }, {
        txt: "GHÉP ĐÔI: Chọn người thứ hai:",
        qreply: playerList,
        callback: (convo, index, resTxt) => {
            let user1ID = convo.get(`data[${index - 1}]`);
            if (!user1ID) return null;
            if (/[0-9]+:.+/g.test(resTxt)) {
                let user2ID = resTxt.match(/[0-9]+/g)[0];
                sendCupid(user1ID, user2ID)
                return true;
            } else {
                return null;
            }

        }
    }])
}

module.exports = {
    mainNightRole: mainNightRole,
    doCupidRole: doCupidRole
}