const { extractUserRole } = require('./DataUtils');
const { sendVote, sendSee, sendSave } = require('./sendRole')

module.exports = (gameData, userID, targetID) => {
    userRole = extractUserRole(gameData, userID);
    switch (gameData.dayStage) {
        case 'night': switch (userRole) {
            case "-1": return sendVote(targetID, userID); break;
            case "1": return sendSee(targetID, userID); break;
            case "2": return sendSave(targetID); break;
        } break;
        case 'discuss': return sendVote(targetID, userID); break;
        case 'vote': return sendVote(targetID, userID); break;
    }
}