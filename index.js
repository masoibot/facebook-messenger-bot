const { JSDOM } = require('jsdom');
const util = require('util');
const BootBot = require('bootbot');
const UserInstance = require('./src/userInstance');

// config
const { window } = new JSDOM();
global.window = window;
global.navigator = {};
const bot = new BootBot({
    accessToken: 'EAALw2mSPrm4BADklo8ZA9HoDAV0olXjSLGr8oZCMYlhMosQIDxZCAolTeqdr6nQ8cawguKmmdf5ZApkymhh0GqqpqkX8sQKaZCGbAA0ZAOcImJIVbfg6aJS5xIOjjB7JrMQeLovsamN15P7GmDPAl9F64VjqLOs8YgdJ6vcuZAajPFNpLyWd2mG',
    verifyToken: 'bautroixa',
    appSecret: '9baffe75afd171b99ce7f7053a0a2340'
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
    { type: 'postback', title: '🎮Vote👥List', payload: 'VOTE' },
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

// use module
userInstance.module(loginModule, bot);
userInstance.module(allMessage, bot);
userInstance.module(roomModule, bot);

bot.start(process.env.PORT || 3000);