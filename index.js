const { JSDOM } = require('jsdom');
const util = require('util');
const BootBot = require('bootbot');
const UserInstance = require('./src/userInstance');

// config
const { window } = new JSDOM();
global.window = window;
global.navigator = {};
const bot = new BootBot({
    accessToken: 'EAAETDDYKZBUMBAMZAtP3BHNBq3nfYKVlfOk1ZC21OteqwKOZByRNOlPJMCm66bwMsEVVcEhfUZA8KY6OPRnbjbdcb1WP1pWRPVYQWaWOg5ZAykuWaoBWZBjRA6ZCR8OobfjaW9c10JIIKGMeAqIrS8ZAf6PzZAsQoYtJxwVFjhB3PEVwZDZD',
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
    {
        type: 'nested', title: '📌login🔑register🚫quit...',
        call_to_actions: [
            { type: 'postback', title: '📌Đăng nhập /login', payload: 'CONNECT' },
            { type: 'postback', title: '🔑Đăng kí! /register', payload: 'REGISTER' },
            { type: 'postback', title: '🚫Ngắt kết nối /quit', payload: 'DISCONNECT' },
        ]
    },
    { type: 'postback', title: '🎮/vote👥', payload: 'VOTE' },
    {
        type: 'nested', title: '📥join🌟ready▶start...',
        call_to_actions: [
            { type: 'postback', title: '📥Tham gia /join', payload: 'JOIN_ROOM' },
            { type: 'postback', title: '🌟Sẵn sàng /ready', payload: 'READY' },
            { type: 'postback', title: '▶Bắt đầu chơi /start', payload: 'START' },
        ]
    },
];
bot.setPersistentMenu(actionButtons, false);

const userInstance = new UserInstance();


//module import
const loginModule = require('./module/Login');
const allMessage = require('./module/AllMessage');
const roomModule = require('./module/Room');
const extModule = require('./module/Extension');

// use module
userInstance.module(loginModule, bot);
userInstance.module(allMessage, bot);
userInstance.module(roomModule, bot);
userInstance.module(extModule, bot);

bot.start(process.env.PORT || 3000);