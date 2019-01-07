const { JSDOM } = require('jsdom');
const util = require('util');
const BootBot = require('bootbot');
const UserInstance = require('./src/userInstance');

// config
const { window } = new JSDOM();
global.window = window;
global.navigator = {};
const bot = new BootBot({
    accessToken: 'EAAETDDYKZBUMBACKOJrCOSDUpHZA5Rr5QUM7yfzZB4zyeZAcNied0YTan3ntZA6tYFRvLdEZCPv47sCjheEbrn0vj1VFgrPGi0LZA70Q06BS2BcLkfJKx0NFjv4QRPp3Qmhgwv7H8TgMG1ex79ZCRlZBxbK1FLbMkMtwl2di0lqtPAAZDZD',
    verifyToken: 'bautroixa',
    appSecret: '51730441760157aa64ba6249824e429b'
});
bot.setGreetingText("Chào mừng bạn đến với MA SÓI BOT bởi Phạm Ngọc Duy :3")
bot.setGetStartedButton((payload, chat) => {
    chat.say('🐺MA SÓI CLIENT MESSENGER').then(() => {
        chat.say({
            text: `Chào bạn, bấm /register để bắt đầu'`,
            quickReplies: ['/register', '/login'],
        });
    })
});
const actionButtons = [
    { type: 'postback', title: '🎮Kết nối...', payload: 'CONNECT' },
    { type: 'postback', title: '🚫Ngắt kết nối...', payload: 'DISCONNECT' }
];
bot.setPersistentMenu(actionButtons, false);

const userInstance = new UserInstance();


//module import
const loginModule = require('./module/Login');
const allMessage = require('./module/AllMessage');
const roomModule = require('./module/Room');

// use module
userInstance.module(loginModule, bot);
userInstance.module(allMessage, bot);
userInstance.module(roomModule, bot);

bot.start(process.env.PORT || 3000);