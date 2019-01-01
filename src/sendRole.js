function sendVote(targetID) {
    //send AJAX
    console.log(`SENDING VOTE ${targetID}`);
    return `Đã vote ${targetID}`;
}
function sendSee(targetID) {
    console.log(`SENDING SEE ${targetID}`);
    return `${targetID} là SÓI :v`;
}
function sendFire(targetID, killOrFire) {
    console.log(`SENDING FIRE ${targetID}`);
    return `${killOrFire ? 'GIẾT' : 'GHIM'} ${targetID}`;
}
function sendCupid(target1ID, target2ID) {
    console.log(`SENDING CUPID ${target1ID} vs ${target2ID}`);
    return `GHÉP ĐÔI ${target1ID} vs ${target2ID}`;
}
module.exports = {
    sendVote: sendVote,
    sendSee: sendSee,
    sendFire: sendFire,
    sendCupid: sendCupid
}