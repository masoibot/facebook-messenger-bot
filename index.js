const { ChatManager, TokenProvider } = require('@pusher/chatkit-client');
const { JSDOM } = require('jsdom');
const util = require('util');
const BootBot = require('bootbot');

// config
const { window } = new JSDOM();
global.window = window;
global.navigator = {};
const bot = new BootBot({
    accessToken: 'EAAETDDYKZBUMBACKOJrCOSDUpHZA5Rr5QUM7yfzZB4zyeZAcNied0YTan3ntZA6tYFRvLdEZCPv47sCjheEbrn0vj1VFgrPGi0LZA70Q06BS2BcLkfJKx0NFjv4QRPp3Qmhgwv7H8TgMG1ex79ZCRlZBxbK1FLbMkMtwl2di0lqtPAAZDZD',
    verifyToken: 'bautroixa',
    appSecret: '51730441760157aa64ba6249824e429b'
});

//module import
const goStage = require('./src/goStage');

// database
var userInstance = [];

bot.hear('login', (payload, chat) => {
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
                userInstance[joinID] = currentUser;
                currentUser.subscribeToRoom({
                    roomId: currentUser.rooms[0].id,
                    hooks: {
                        onMessage: message => {
                            if (message.text[0] === '{') {
                                // data from server
                                goStage(chat, JSON.parse(message.text), userID);
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
});
bot.on('message', (payload, chat, data) => {
    if (data.captured) { return; }
    const joinID = payload.sender.id;
    const text = payload.message.text;
    if (!userInstance[joinID]) {
        chat.say(`Vui lòng đăng nhập lại!`);
    } else {
        if (/[0-9]+:.+|-1/g.test(text)) {
            // action number
        } else {
            // send chat
            userInstance[joinID].sendMessage({
                text: text,
                roomId: userInstance[joinID].rooms[0].id,
            }).catch(err => {
                console.log(`user.sendMessage error:`, error.info.error);
            })
        }
    }
});

bot.start();