const { mainNightRole, doCupidRole } = require('./doNightRole');

module.exports = function goStage(chat, gameData, userID) {
    let count = 0;
    playerList = [...gameData.villagersID.map(u => {
        count++;
        return `${count}: ${u}`;
    }), ...gameData.wolfsID.map(u => {
        count++;
        return `${count}: ${u}`;
    })];
    switch (gameData.dayStage) {
        case 'readyToGame':
            let notifySetup = `Trò chơi đang bắt đầu\nSETUP GAME\n`
            Object.keys(gameData.setup).forEach(key => {
                if (gameData.setup[key].length > 0) {
                    notifySetup += `${gameData.setup[key].length} ROLE_NAME[${key}]\n`;
                }
            });
            notifySetup += `Bạn là USER_ROLE_NAME\n`;
            chat.say(notifySetup);
            break;
        case 'cupid':
            doCupidRole(chat, gameData, playerList);
            break;
        case 'night':
            let notifyNight = `Đêm thứ ${gameData.day}:`;
            if (true) { // còn sống
                mainNightRole(chat, gameData, userID, 1, playerList);
            } else {
                chat.say(`Đêm nay Bạn đã chết!`);
            }
            break;
        case 'superwolf':
            chat.say(`Sói nguyền đang thực hiện role...`);
            break;
        case 'witch':
            chat.say(`Phù thủy đang thực hiện role...`);
            break;
        case 'discuss':
            let notifyDeath = `Trời sáng rồi, mọi người thảo luận đi!`;
            notifyDeath += gameData.lastDeath.length === 0 ? `Đêm qua không ai chết cả` : `${JSON.stringify(gameData.lastDeath)} đã chết!`;
            chat.say(notifyDeath);
            break;
        case 'vote':
            chat.say({
                text: `Bạn muốn treo cổ ai?`,
                quickReplies: playerList,
            });
            break;
        case 'voteYesNo':
            chat.say({
                text: `Treo hay tha?`,
                quickReplies: ["/treo", "/tha"],
            });
            break;
    }
}