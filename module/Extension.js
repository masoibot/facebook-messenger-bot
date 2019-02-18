module.exports = (userInstance, bot) => {
    const downloadAppCallback = async (payload, chat) => {
        const joinID = payload.sender.id;
        console.log(`${joinID} download app...`);
        // var currentUser = userInstance.getInstance(joinID);
        chat.say({
            cards: [
                {
                    title: `Mời bạn tải xuống app`,
                    image_url: "https://sites.google.com/site/masoibot/user/MaSoiLogo.png",
                    subtitle: `💡Chia sẻ link với bạn bè: http://bit.ly/masoiapk`,
                    default_action: {
                        "type": "web_url",
                        "url": "http://bit.ly/masoiapk",
                    },
                    buttons: [
                        {
                            type: "web_url",
                            url: "http://bit.ly/masoiapk",
                            title: "Tải xuống apk"
                        }
                    ]
                }
            ]
        });
    }

    bot.hear(/^\/tải_app$/, downloadAppCallback);
    bot.on('postback:DOWNLOAD_APP', downloadAppCallback);

    const setupCallback = async (payload, chat) => {
        const joinID = payload.sender.id;
        console.log(`${joinID} setup game...`);
        // var currentUser = userInstance.getInstance(joinID);
        var roomID = userInstance.getRoomID(joinID);
        chat.sendGenericTemplate([{
            "title": "Ma sói Setup",
            "image_url": `https://sites.google.com/site/masoibot/home/MaSoiLogo.png`,
            "subtitle": "Set-up vai trò bằng tay",
            "buttons": [{
                "type": "web_url",
                "url": `https://phamngocduy98.github.io/masoibot/setup?roomID=${roomID}`,
                "title": "Set-up ngay",
                "webview_height_ratio": "compact",
                "messenger_extensions": true,
                "fallback_url": `https://phamngocduy98.github.io/masoibot/setup?roomID=${roomID}`,
                "webview_share_button": "hide"
            }]
        }]);
    }

    bot.hear(/^\/setup$/, setupCallback);
    bot.on('postback:SETUP', setupCallback);
};