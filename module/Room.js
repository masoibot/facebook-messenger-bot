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
                    sendRequest(`/play/20509498/join/${userID}`).then(data => {
                        if (data.success) {
                            userInstance.getInstance(joinID).joinRoom({ roomId: roomID })
                                .then(room => {
                                    userInstance.subscribeChat(roomID, joinID, chat, convo);
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
        chat.say(`Tính năng chưa sẵn có!`)
    }
    bot.hear(/^\/leave$/, joinCallback);
    bot.on('postback:LEAVE_ROOM', joinCallback);
};