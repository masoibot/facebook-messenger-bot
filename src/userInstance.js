module.exports = class UserInstance {
    constructor() {
        this.users = [];
        this.userIDs = [];
        this.datas = [];
        this.playerLists = [];
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
    module(factory, bot) {
        return factory.apply(this, [this, bot]);
    }
}