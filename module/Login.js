const { postRequest } = require('../src/sendRole');

module.exports = (userInstance, bot) => {
    const loginCallback = (payload, chat) => {
        const joinID = payload.sender.id;
        console.log(`${joinID} connect...`);
        var currentUser = userInstance.getInstance(joinID);
        if (!currentUser) {
            chat.conversation((convo) => {
                convo.ask(`Nhập tên đã đăng kí:`, (payload, convo) => {
                    const userID = payload.message ? payload.message.text : "";
                    userInstance.connectChat(userID, joinID, convo)
                    // .then((currentUser) => {
                    //     userInstance.subscribeChat("20509498", joinID, chat, convo);
                    // });
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
                convo.ask(`Đăng kí 1 tên (viết liền không dấu):\nVD: duy`, (payload, convo) => {
                    const userID = payload.message ? payload.message.text : "";
                    chat.getUserProfile().then((user) => {
                        console.log("REG: ", { id: userID, name: `${user.first_name} ${user.last_name}`, avatar: user.profile_pic });
                        postRequest(`/reg`, { id: userID, name: `${user.first_name} ${user.last_name}`, avatar: user.profile_pic }).then(data => {
                            if (data.success) {
                                convo.say({
                                    text: `Bạn đã đăng kí thành công!\nVui lòng đăng nhập!`,
                                    quickReplies: ["/login"]
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