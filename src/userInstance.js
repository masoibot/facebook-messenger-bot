const { ChatManager, TokenProvider } = require('@pusher/chatkit-client');
const goStage = require('../src/goStage');
const { isAlive } = require('../src/DataUtils');

module.exports = class UserInstance {
    constructor() {
        this.users = [];
        this.userIDs = [];
        this.datas = [];
        this.playerLists = [];
        this.roomIDs = [];
    }
    setInstance(joinID, userInstance) {
        this.users[joinID] = userInstance;
    }
    getInstance(joinID) {
        return this.users[joinID];
    }
    setData(joinID, data) {
        this.datas[joinID] = data;
    }
    getData(joinID) {
        return this.datas[joinID];
    }
    setUserID(joinID, userID) {
        this.userIDs[joinID] = userID;
    }
    getUserID(joinID) {
        return this.userIDs[joinID];
    }
    setPlayerList(joinID, playerList) {
        this.playerLists[joinID] = playerList;
    }
    getPlayerList(joinID) {
        return this.playerLists[joinID];
    }
    getRoomID(joinID) {
        return this.roomIDs[joinID];
    }
    setRoomID(joinID, roomID) {
        this.roomIDs[joinID] = roomID;
    }
    module(factory, bot) {
        return factory.apply(this, [this, bot]);
    }
    connectChat(userID, joinID, convo) {
        var newChatMgr = new ChatManager({
            instanceLocator: "v1:us1:754dee8b-d6c4-41b4-a6d6-7105da589788",
            userId: userID,
            tokenProvider: new TokenProvider({
                url: "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/754dee8b-d6c4-41b4-a6d6-7105da589788/token"
            })
        });
        return newChatMgr.connect().then(currentUser => {
            this.setUserID(joinID, userID);
            this.setInstance(joinID, currentUser);
            console.log(`Login: ${userID}`);
            convo.say({
                text: `Bạn đã đăng nhập thành công!\nHãy /join 1 phòng chơi!`,
                quickReplies: ["/join"]
            });
            convo.end();
            return currentUser;
        }).catch(error => {
            if (error.info && error.info.error && error.info.error == "services/chatkit/not_found/user_not_found") {
                convo.say({
                    text: `Đăng nhập thất bại\nBạn có muốn đăng kí 1 tên?`,
                    quickReplies: ["/register"]
                });
                return;
            }
            console.log("chatMgr.connect error:", error.info.error);
            convo.say({
                text: `Đăng nhập thất bại\nchatMgr.connect_err`,
                quickReplies: ["/login"]
            });
            convo.end();
        })
    }
    subscribeChat(roomID, joinID, chat, convo) {
        var currentUser = this.getInstance(joinID);
        if (!currentUser) {
            chat.say(`Vui lòng đăng nhập!\nsubcribe_error_not_connected`);
            return;
        }
        if (this.getRoomID(joinID)) {
            currentUser.roomSubscriptions[this.getRoomID(joinID)].cancel();
            chat.say(`Bạn đã rời phòng ${this.getRoomID(joinID)} để tham gia phòng ${roomID}!`);
        }
        currentUser.subscribeToRoom({
            roomId: roomID,
            hooks: {
                onMessage: message => {
                    if (message.text[0] === '{') {
                        // data from server
                        try {
                            var data = JSON.parse(message.text).data;
                            let userID = this.getUserID(joinID);
                            if (data.players.allID.indexOf(userID) != -1) {
                                this.setData(joinID, data); // lưu gameData
                                let fullList = data.players.allID.filter((id) => { // lọc người còn sống
                                    return isAlive(data, id);
                                });
                                var playerList = fullList.reduce((plist, p, index) => { // chuyển sang mảng vote [id: name]
                                    plist[p] = `${index}: ${data.players.names[p]}`;
                                    return plist;
                                }, {});
                                this.setPlayerList(joinID, playerList); // lưu lại mạng vote
                                goStage(chat, data, userID, playerList);
                            } else {
                                chat.say(`WARNING: bạn đang xem với tư cách khách!\n/join để tham gia phòng khác!`);
                            }
                        } catch (e) {
                            convo.say(`Tin nhắn chứa kí tự không hợp lệ: {}\nJSON_invalid_error`);
                        }
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
            messageLimit: 0
        }).catch(error => {
            console.log("user.subscribeToRoom error:", error);
            convo.say(`Tham gia phòng thất bại\nuser.subscribeToRoom_error`);
            convo.end();
        });
        convo.say(`Tham gia phòng thành công!`);
        this.setRoomID(joinID, roomID);
    }
}