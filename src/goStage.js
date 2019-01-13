const { mainNightRole, doCupidRole, doSuperWolfRole, doWitchRole } = require('./mainNightRole');
const { roleName, extractUserRole, isAlive } = require('./DataUtils');

module.exports = function goStage(chat, gameData, userID, playerList) {
    var userRole = extractUserRole(gameData, userID);
    var names = gameData.players.names;
    let coupleID = gameData.players.coupleID;
    let coupleIndex = coupleID.indexOf(userID);
    switch (gameData.state.dayStage) {
        case 'readyToGame':
            let notifySetup = `Trò chơi đang bắt đầu\nSETUP GAME\n`
            Object.keys(gameData.setup).forEach(key => {
                if (gameData.setup[key].length > 0) {
                    notifySetup += `${gameData.setup[key].length} ${roleName[key]}\n`;
                }
            });
            notifySetup += `Bạn là ${roleName[userRole]}\n`;
            chat.say(notifySetup);
            break;
        case 'cupid':
            if (userRole == 7) {
                doCupidRole(chat, gameData, playerList);
            } else {
                chat.say(`👼THẦN TÌNH YÊU đang phân vân...`);
            }
            break;
        case 'night':
            let nightNotify = ``;
            if (coupleIndex != -1) {
                nightNotify += `💕Bạn cặp đôi với ${names[coupleID[coupleIndex == 1 ? 0 : 1]]}\n`;
            }
            if (isAlive(gameData, userID)) { // còn sống
                mainNightRole(chat, gameData, userID, userRole, playerList, nightNotify);
            } else {
                chat.say(`💀ĐÊM RỒI!\nĐêm nay bạn đã chết!`);
            }
            break;
        case 'superwolf':
            if (userRole == -3) {
                doSuperWolfRole(chat, gameData);
            } else {
                chat.say(`🐺SÓI NGUYỀN đang suy tính...`);
            }
            break;
        case 'witch':
            if (userRole == 5) {
                doWitchRole(chat, gameData, playerList);
            } else {
                chat.say(`🧙‍PHÙ THỦY đang phù phép...`);
            }
            break;
        case 'discuss':
            let notifyDeath = `☀TRỜI SÁNG RỒI!\n`;
            let superWolfVictimID = gameData.roleInfo.superWolfVictimID;
            if (superWolfVictimID === userID) {
                notifyDeath += `🐺Nhớ rằng bạn là sói!\n`
            }
            if (coupleIndex != -1) {
                notifyDeath += `💕Bạn cặp đôi với ${names[coupleID[coupleIndex == 1 ? 0 : 1]]}`;
            }
            notifyDeath += gameData.roleInfo.lastDeath.length === 0 ? `Đêm qua không ai chết cả` : gameData.roleInfo.lastDeath.map((deathID) => {
                return `⚔${names[deathID]} đã chết`;
            }).join('\n');
            chat.say(notifyDeath);
            break;
        case 'vote':
            chat.say({
                text: `VOTE\nBạn muốn treo cổ ai?\n${Object.values(playerList).join('|')}`,
                quickReplies: Object.values(playerList),
            });
            break;
        case 'voteResult':
            let voteResult = `KẾT QUẢ VOTE\n`;
            let voteArr = {};
            Object.keys(gameData.roleTarget.voteList).forEach((userID, index) => {
                targetID = gameData.roleTarget.voteList[userID];
                voteArr[targetID] ? voteArr[targetID]++ : voteArr[targetID] = 1;
            });
            voteResult += Object.keys(voteArr).map((targetID, index) => {
                return `${index + 1}: ${names[targetID]} (${voteArr[targetID]} phiếu)`;
            }).join('\n')
            voteResult += `\n`;
            if (gameData.roleInfo.victimID !== "") {
                voteResult += `${names[gameData.roleInfo.victimID]} có số vote nhiều nhất!`;
            } else {
                voteResult += `Không ai bị treo cổ!`;
            }
            chat.say(voteResult);
            break;
        case 'lastWord':
            if (gameData.roleInfo.victimID !== "") {
                chat.say(`${names[gameData.roleInfo.victimID]} LÊN THỚT!\nBạn có 1 phút thanh minh`);
            } else {
                chat.say(`Người chơi lên thớt không hợp lệ!\nnull_victim_invalid_error`);
            }
            break;
        case 'voteYesNo':
            chat.say({
                text: `TREO HAY THA?\n/treo /tha`,
                quickReplies: ["/treo", "/tha"],
            });
            break;
        case 'voteYesNoResult':
            let listTreo = [];
            let listTha = [];
            let victimID = gameData.roleInfo.victimID;
            Object.keys(gameData.roleTarget.voteList).filter((userID, index) => {
                if (gameData.roleTarget.voteList[userID] === victimID) {
                    listTreo = [...listTreo, names[userID]];
                } else {
                    listTha = [...listTha, names[userID]];
                }
            });
            chat.say(`KẾT QUẢ THEO/THA:\n`
                + `${listTreo.length} Treo: ${listTreo.join(", ")}\n`
                + `${listTha.length} Tha: ${listTha.join(", ")}\n\n`
                + `${names[victimID]} ${listTreo.length > listTha.length ? `đã bị treo cổ theo số đông!` : `vẫn được mọi người tin tưởng!`}`
            );
    }
}