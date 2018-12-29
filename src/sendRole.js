function sendVote(targetID) {
    //send AJAX
    console.log(`SENDING VOTE ${targetID}`);
    return 'Thành công!';
}
function sendSee(targetID) {
    console.log(`SENDING SEE ${targetID}`);
    return 'là SÓI :v';
}
function sendFire(targetID, killOrFire) {
    console.log(`SENDING FIRE ${targetID}`);
    return `${killOrFire ? 'GIẾT' : 'GHIM'} ${targetID}`;
}

module.exports = {
    sendVote: sendVote,
    sendSee: sendSee,
    sendFire: sendFire,
}