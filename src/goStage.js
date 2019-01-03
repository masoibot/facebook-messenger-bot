const { mainNightRole, doCupidRole } = require('./mainNightRole');
const { roleName, extractUserRole } = require('./DataUtils');

module.exports = function goStage(chat, gameData, userID, playerList) {
    let count = 0;
    switch (gameData.dayStage) {
        case 'readyToGame':
            let notifySetup = `Trò chơi đang bắt đầu\nSETUP GAME\n`
            Object.keys(gameData.setup).forEach(key => {
                if (gameData.setup[key].length > 0) {
                    notifySetup += `${gameData.setup[key].length} ${roleName[key]}\n`;
                }
            });
            notifySetup += `Bạn là ${roleName[extractUserRole(gameData, userID)]}\n`;
            chat.say(notifySetup);
            break;
        case 'cupid':
            doCupidRole(chat, gameData, playerList);
            break;
        case 'night':
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
            let notifyDeath = `Trời sáng rồi, mọi người thảo luận đi!\n`;
            notifyDeath += gameData.lastDeath.length === 0 ? `Đêm qua không ai chết cả` : `${JSON.stringify(gameData.lastDeath)} đã chết!`;
            chat.say(notifyDeath);
            break;
        case 'vote':
            chat.say({
                text: `Bạn muốn treo cổ ai?`,
                quickReplies: playerList,
            });
            break;
        case 'voteyesno':
            chat.say({
                text: `Treo hay tha?`,
                quickReplies: ["/treo", "/tha"],
            });
            break;
    }
}