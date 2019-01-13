const { ChatManager, TokenProvider } = require('@pusher/chatkit-client');
const { sendRequest } = require('../src/sendRole');

module.exports = (userInstance, bot) => {
    //join room
    const joinCallback = (payload, chat) => {
        const joinID = payload.sender.id;
        let userID = userInstance.getUserID(joinID);
        if (!userID) {
            chat.say({
                text: `Vui lòng đăng nhập!`,
                quickReplies: ['/login'],
            });
            return;
        }
        sendRequest(`/room`).then(data => {
            let count = 0;
            let rooms = data.filter((r, i) => {
                return count <= 10 && r.state.status == 'waiting' && ++count;
            }).map((r) => {
                let readyUserCount = Object.keys(r.players.ready).length;
                return `${r.roomChatID}`;
            })
            chat.conversation((convo) => {
                convo.ask({
                    text: `Chọn 1 phòng chơi: `,
                    quickReplies: rooms
                }, (payload, convo) => {
                    let roomID = payload.message ? payload.message.text.match(/[0-9]+/g)[0] : null;
                    if (!roomID) {
                        convo.say(`🚫Phòng bạn vừa nhập không hợp lệ!`);
                        convo.end();
                        return;
                    }
                    sendRequest(`/play/${roomID}/join/${userID}`).then(data => {
                        if (data.success) {
                            userInstance.getInstance(joinID).joinRoom({ roomId: roomID })
                                .then(room => {
                                    userInstance.subscribeChat(roomID, joinID, chat, convo);
                                    sendRequest(`/play/${roomID}/users`).then(users => {
                                        chat.say(`PHÒNG ${roomID}\n` + users.map((u, i) => {
                                            return `${data.ready[u.id] ? `🌟` : `☆`}${i + 1}: ${u.name}`;
                                        }).join('\n'));
                                    })
                                    console.log(`${userID} Joined room with ID: ${room.id}`)
                                    convo.end();
                                })
                                .catch(err => {
                                    console.log(`${userID} Error joining room ${roomID}: ${err}`)
                                    convo.end();
                                })
                        } else {
                            chat.say(`🚫Có thể phòng đang chơi!\nVui lòng thử lại sau!\njoin_room_err`)
                        }
                    }).catch(err => {
                        console.log(`join_room_request_err:`, err);
                    })
                });
            });
        }).catch(err => {
            chat.say(`request_room_list_err:`, err);
        })
    };
    bot.hear(/^\/join$/, joinCallback);
    bot.on('postback:JOIN_ROOM', joinCallback);

    //leave room
    const leaveCallback = (payload, chat) => {
        const joinID = payload.sender.id;
        let userID = userInstance.getUserID(joinID);
        let roomID = userInstance.getRoomID(joinID);
        if (userID && roomID) {
            sendRequest(`/play/${roomID}/leave/${userID}`).then(data => {
                if (data.success) {
                    chat.say(`Bạn đã rời phòng chơi!`);
                    userInstance.leaveChat(joinID);
                }
            }).catch(err => {
                console.log('leave_room_request_err:', err);
            })
        } else {
            chat.say(`Bạn chưa tham gia phòng nào!`);
        }
        console.log(`${userID} leave room with ID: ${roomID}`)
    }
    bot.hear(/^\/leave$/, leaveCallback);
    bot.on('postback:LEAVE_ROOM', leaveCallback);

    //ready
    const readyCallback = (payload, chat) => {
        const joinID = payload.sender.id;
        let userID = userInstance.getUserID(joinID);
        let roomID = userInstance.getRoomID(joinID);
        let isReady = userInstance.getReady(joinID);
        if (userID && roomID) {
            sendRequest(`/play/${roomID}/${isReady ? 'off' : 'on'}-ready/${userID}`).then(data => {
                if (data.success) {
                    chat.say(`Bạn đã ${isReady ? 'bỏ ' : ''}sẵn sàng!`);
                    userInstance.invertReady(joinID);
                } else {
                    chat.say(`Vui lòng thử lại!\nready_request_error`);
                }
            }).catch(err => {
                chat.say(`Vui lòng thử lại!\nready_request_error`);
                console.log('ready_request_error:', err);
            })
        } else {
            chat.say(`Bạn chưa tham gia phòng nào!`);
        }
        console.log(`${userID} ${isReady ? 'off' : 'on'}-ready roomID: ${roomID}`);
    }
    bot.hear(/^\/ready$/, readyCallback);
    bot.on('postback:READY', readyCallback);

    //start
    const startCallback = (payload, chat) => {
        const joinID = payload.sender.id;
        let userID = userInstance.getUserID(joinID);
        let roomID = userInstance.getRoomID(joinID);
        let isReady = userInstance.getReady(joinID);
        if (userID && roomID && isReady) {
            sendRequest(`/play/${roomID}/start`).then(data => {
                if (!data.success) {
                    chat.say(`${data.message}!\nstart_game_error`);
                }
            }).catch(err => {
                chat.say(`Vui lòng thử lại!\nstart_request_error`);
                console.log('ready_request_error:', err);
            })
        } else {
            chat.say(`Bạn không thể bắt đầu game!\nnot_login_join_or_ready_error`);
        }
        console.log(`${userID} start roomID: ${roomID}`);
    }
    bot.hear(/^\/start$/, startCallback);
    bot.on('postback:START', startCallback);
};