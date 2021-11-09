const AWS = require("aws-sdk");
const hmacSHA256 = require("crypto-js/hmac-sha256");
const axios = require("axios");
var stepfunctions = new AWS.StepFunctions();

exports.lambdaHandler = async (event, context) => {
  for (const record of event.Records) {
    let body = JSON.parse(record.body);
    let payload = body["payload"];
    payload["id"] = payload["pk"];
    let url = body["url"];
    let signingToken = body["signingToken"];
    let resourceId = payload["pk"];
    let currentTime = new Date().toISOString();
    let taskToken = body["taskToken"];

    delete payload["pk"];
    delete payload["companyId"];

    let postData = {
      resource: payload,
      resourceId: resourceId,
      resourceType: payload["type"],
      triggeredAt: currentTime,
      token: hmacSHA256(resourceId + currentTime, signingToken).toString(),
    };

    try {
      const webhook = await axios.post(url, postData, {
        "Content-Type": "application/json",
      });

      let params = {
        taskToken: taskToken,
        output: JSON.stringify({
          status: "success",
          payload: postData,
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
