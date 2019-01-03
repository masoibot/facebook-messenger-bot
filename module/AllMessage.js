const handleVoteID = require('../src/HandleVoteID');

module.exports = (userInstance, bot) => {
    bot.on('message', (payload, chat, data) => {
        if (data.captured) { return; }
        const joinID = payload.sender.id;
        const text = payload.message.text;
        if (!userInstance.getInstance(joinID)) {
            chat.say(`Vui lòng đăng nhập sử dụng menu!`);
            return;
        }
        if (/[0-9]+:.+|-1/g.test(text)) {
            // target_id
            data = userInstance.getData(joinID);
            userID = userInstance.getUserID(joinID);
            if (!data) {
                // request for data HERE
                chat.say(`Vui lòng thử lại!\ntarget_id_no_data_error`);
            } else {
                let targetIndex = text.match(/-?[0-9]+/g);
                let playList = userInstance.getPlayerList(joinID);
                let targetID = targetIndex !== -1 ? playList[targetIndex] : "";
                handleVoteID(data, userID, targetID);
            }
        } else {
            // message_content
            userInstance.getInstance(joinID).sendMessage({
                text: text,
                roomId: userInstance.getInstance(joinID).rooms[0].id,
            }).catch(err => {
                chat.say(`Không gửi được tin nhắn!\nuser.sendMessage error`);
                console.log(`user.sendMessage error:`, error.info.error);
            })
        }

    });
};