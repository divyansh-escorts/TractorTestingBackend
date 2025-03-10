const awsIot = require("aws-iot-device-sdk");

var device = awsIot.device({
    keyPath: "aws/updprivate.pem.key",
    certPath: "aws/updcertificate.pem.crt",
    caPath: "aws/updAmazonRootCA1.pem",
    clientId: "server_backend",
    host: "a1q2r34gpscepz-ats.iot.us-west-2.amazonaws.com",
});

module.exports = device