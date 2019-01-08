const handleVoteID = require('../src/HandleVoteID');
const { extractUserRole } = require('../src/DataUtils');

module.exports = (userInstance, bot) => {
    bot.on('message', async (payload, chat, data) => {
        if (data.captured) { return; }
        const joinID = payload.sender.id;
        const text = payload.message.text;
        if (!userInstance.getInstance(joinID)) {
            chat.say({
                text: `Vui lòng đăng nhập!`,
                quickReplies: ['/login'],
            });
            return;
        }
        var data = userInstance.getData(joinID);
        var userID = userInstance.getUserID(joinID);
        if (!userID) {
            chat.say(`Vui lòng đăng xuất và đăng nhập lại!\nsend_target_id_no_data_or_userID_error`); return;
        }
        if (data && data.state.status === 'ingame' && /\/(treo|tha)/.test(text)) {
            // treo/tha
            let treoOrTha = /\/treo/.test(text)
            let targetID = data.roleInfo.victimID;
            chat.say(await handleVoteID(data, userID, treoOrTha ? targetID : ""));
        } else if (data && data.state.status === 'ingame' && /[0-9]+:.+|-1/g.test(text)) {
            // target_id
            let targetIndex = text.match(/[0-9]+/g)[0];
            let playerList = userInstance.getPlayerList(joinID);
            let targetID = Object.keys(playerList)[targetIndex];
            chat.say(await handleVoteID(data, userID, targetID));
        } else {
            let userRole = extractUserRole(data, userID);
            if (data.state.status === 'waiting' || // phòng chờ
                (data.state.dayStage === 'night' && (userRole == -1 || userRole == -3 || userID == data.roleInfo.superWolfVictimID)) || // đêm là sói
                data.state.dayStage === 'discuss' || // thảo luận
                (data.state.dayStage === 'lastWord' && userID == data.roleInfo.victimID)) { // trăn trối / giẫy
                // message_content
                userInstance.getInstance(joinID).sendMessage({
                    text: text,
                    roomId: userInstance.getInstance(joinID).rooms[0].id,
                }).catch(err => {
                    chat.say(`Không gửi được tin nhắn!\nuser.sendMessage error`);
                    console.log(`user.sendMessage error:`, error.info.error);
                })
            } else {
                chat.say(`Bạn không thể gửi tin nhắn!`);
            }
        }

    });
};