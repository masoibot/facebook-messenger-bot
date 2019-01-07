const { extractUserRole } = require('./DataUtils');
const { sendVote, sendSee, sendSave } = require('./sendRole')

module.exports = async (gameData, userID, targetID) => {
    userRole = extractUserRole(gameData, userID);
    switch (gameData.state.dayStage) {
        case 'night': switch (userRole) {
            case "-1": case "-3": return await sendVote(gameData, targetID, userID); break;
            // case "1": return await sendSee(gameData, targetID, userID); break;
            case "2": return await sendSave(targetID); break;
        } break;
        case 'discuss': return await sendVote(gameData, targetID, userID); break;
        case 'vote': return await sendVote(gameData, targetID, userID); break;
        case 'voteYesNo': return await sendVote(gameData, targetID, userID); break;
    }
}