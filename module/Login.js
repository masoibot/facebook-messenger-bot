const { ChatManager, TokenProvider } = require('@pusher/chatkit-client');
const goStage = require('../src/goStage');

module.exports = (userInstance, bot) => {
    const loginCallback = (payload, chat) => {
        const joinID = payload.sender.id;
        chat.conversation((convo) => {
            convo.ask(`Nhập mã định danh (bí mật):`, (payload, convo) => {
                const userID = payload.message.text;
                var newChatMgr = new ChatManager({
                    instanceLocator: "v1:us1:754dee8b-d6c4-41b4-a6d6-7105da589788",
                    userId: userID,
                    tokenProvider: new TokenProvider({
                        url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/754dee8b-d6c4-41b4-a6d6-7105da589788/token"
                    })
                });
                newChatMgr.connect().then(currentUser => {
                    userInstance.setInstance(joinID, currentUser);
                    userInstance.setUserID(joinID, userID);
                    currentUser.subscribeToRoom({
                        roomId: currentUser.rooms[0].id,
                        hooks: {
                            onMessage: message => {
                                if (message.text[0] === '{') {
                                    // data from server
                                    let data = JSON.parse(message.text).data;
                                    userInstance.setData(joinID, data);
                                    userInstance.setPlayerList(joinID, [...data.villagersID.map(u => {
                                        count++;
                                        return `${count}: ${u}`;
                                    }), ...gameData.wolfsID.map(u => {
                                        count++;
                                        return `${count}: ${u}`;
                                    })]);
                                    goStage(chat, data, userID, userInstance.getPlayerList(joinID));
                                } else {
                                    // chat from other
                                    if (message.sender.id !== currentUser.id) {
                                        chat.say(`${message.sender.name}: ${message.text}`);
                                        console.log(`${message.sender.name}: ${message.text}`);
                                    } else {
                                        chat.sendAction('mark_seen');
                                    }
                                }
                            }
                        },
                        messageLimit: 1
                    }).catch(error => {
                        console.log("user.subscribeToRoom error:", error.info.error);
                        convo.say(`Đăng nhập thất bại. ERR: user.subscribeToRoom`);
                        convo.end();
                    })
                    console.log(`Login: ${userID}`);
                    convo.say(`Bạn đã đăng nhập thành công!`);
                    convo.end();
                }).catch(error => {
                    console.log("chatMgr.connect error:", error.info.error);
                    convo.say(`Đăng nhập thất bại. ERR: chatMgr.connect`);
                    convo.end();
                })
            });
        });
    };
    // listen /clan
    bot.hear(/^\/login$/, loginCallback);
    bot.on('postback:CONNECT', loginCallback);
};