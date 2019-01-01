module.exports = class UserInstance {
    constructor() {
        this.users = [];
    }
    setInstance(joinID, userInstance) {
        this.users[joinID] = userInstance;
    }
    getInstance(joinID) {
        return this.users[joinID];
    }
    module(factory, bot) {
        return factory.apply(this, [this, bot]);
    }
}