const { postRequest } = require('../src/sendRole');

module.exports = (userInstance, bot) => {
    const loginCallback = (payload, chat) => {
        const joinID = payload.sender.id;
        console.log(`${joinID} connect...`);
        var currentUser = userInstance.getInstance(joinID);
        if (!currentUser) {
            chat.conversation((convo) => {
                convo.ask(`Nhập tên đăng nhập đã đăng kí:`, (payload, convo) => {
                    const userID = payload.message ? payload.message.text : "";
                    userInstance.connectChat(userID, joinID).then(currentUser => {
                        console.log(`Login: ${userID}`);
                        convo.say({
                            text: `Bạn đã đăng nhập thành công!\nHãy /join 1 phòng chơi!`,
                            quickReplies: ["/join"]
                        });
                        convo.end();
                    }).catch(error => {
                        if (error.info && error.info.error && error.info.error == "services/chatkit/not_found/user_not_found") {
                            convo.say({
                                text: `Tên đăng nhập chưa được đăng kí\nBạn có muốn đăng kí?`,
                                quickReplies: ["/register"]
                            });
                            convo.end();
                            return;
                        }
                        console.log("chatMgr.connect error:", error.info.error);
                        convo.say({
                            text: `Đăng nhập thất bại\nchatMgr.connect_err`,
                            quickReplies: ["/login"]
                        });
                        convo.end();
                    })
                });
            });
        } else {
            chat.say(`Bạn đã đăng nhập rồi!`);
        }
    };
    const disconnectCallback = async (payload, chat) => {
        const joinID = payload.sender.id;
        console.log(`${joinID} disconnect...`);
        var currentUser = userInstance.getInstance(joinID);
        if (currentUser) {
            await currentUser.disconnect();
            userInstance.setInstance(joinID, null);
            chat.say(`Bạn đã ngắt kết nối!`);
        } else {
            chat.say(`Bạn chưa đăng nhập!`);
        }
    }
    const registerCallback = async (payload, chat) => {
        const joinID = payload.sender.id;
        console.log(`${joinID} register...`);
        var currentUser = userInstance.getInstance(joinID);
        if (!currentUser) {
            chat.conversation((convo) => {
                convo.ask(`Nhập tên đăng nhập muốn đăng kí (viết liền không dấu):\nVD: duy, phamduy, pnduy`, (payload, convo) => {
                    const userID = payload.message ? payload.message.text : "";
                    chat.getUserProfile().then((user) => {
                        console.log("REG: ", { id: userID, name: `${user.first_name} ${user.last_name}`, avatar: user.profile_pic });
                        postRequest(`/reg`, { id: userID, name: `${user.first_name} ${user.last_name}`, avatar: user.profile_pic }).then(data => {
                            if (data.success) {
                                convo.say({
                                    text: `Bạn đã đăng kí thành công!\nVui lòng đăng nhập!`,
                                    quickReplies: ["/login", "/tải_app"]
                                })
                                convo.end();
                            } else {
                                convo.say(`Vui lòng thử lại!\nregister_error`);
                                convo.end();
                            }
                        }).catch(err => {
                            convo.say(`Vui lòng thử lại!\nregister_request_error`);
                            convo.end();
                        })
                    });
                });
            });
        } else {
            chat.say(`Bạn đã đăng nhập rồi!`);
        }
    }
    bot.hear(/^\/login$/, loginCallback);
    bot.on('postback:CONNECT', loginCallback);
    bot.hear(/^\/quit$/, disconnectCallback);
    bot.on('postback:DISCONNECT', disconnectCallback);
    bot.hear(/^\/register$/, registerCallback);
    bot.on('postback:REGISTER', registerCallback);
};