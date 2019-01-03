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
const userInstance = new UserInstance();

//module import
const loginModule = require('./module/Login');
const allMessage = require('./module/AllMessage');

// use module
userInstance.module(loginModule, bot);
userInstance.module(allMessage, bot);

bot.start(process.env.PORT || 3000);