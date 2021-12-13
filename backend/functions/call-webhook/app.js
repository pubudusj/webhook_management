const AWS = require("aws-sdk");
const hmacSHA256 = require("crypto-js/hmac-sha256");
const axios = require("axios");
var stepfunctions = new AWS.StepFunctions();

exports.lambdaHandler = async (event, context) => {
  for (const record of event.Records) {
    console.log(record)
    let body = JSON.parse(record.body);
    let payload = body["payload"];
    let url = body["url"];
    let taskToken = body["taskToken"];

    try {
      const webhook = await axios.post(url, payload, {
        "Content-Type": "application/json",
      });

      let params = {
        taskToken: taskToken,
        output: JSON.stringify({
          status: "success",
          output: {},
        }),
      };

      await stepfunctions.sendTaskSuccess(params).promise();

      console.log("Stepfunction notified with task success");
    } catch (error) {
      let params = {
        taskToken: taskToken,
        cause: "Webhook call failure",
        error: error.message,
      };

      await stepfunctions.sendTaskFailure(params).promise();

      console.log("Stepfunction notified with task failed");
    }
  }
};
