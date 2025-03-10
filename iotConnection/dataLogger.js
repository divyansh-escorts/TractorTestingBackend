
const device = require("../middlewares/awsConnection");
// const { saveMetaPacket } = require("../dbQueries/metaPacketQueries");
// const sendIndividualNotification = require("../middlewares/sendIndividualNotification");
// const { saveNotification } = require("../dbQueries/notificationQueries");
// const { fetchTokens } = require("../dbQueries/androidTokenQueries");
// const { checkFarm } = require("../dbQueries/farmQueries");

device.on("connect", async function () {
  // Topic that deals with motor current status
  device.subscribe("ASSET_TRACKER");
});
device.on("message", async function (topic, payload) {
  payload = JSON.parse(payload.toString());
  console.log(topic, payload);
});

module.exports = "";