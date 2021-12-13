const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();
const hmacSHA256 = require("crypto-js/hmac-sha256");
const { v4: uuidv4 } = require("uuid");

exports.lambdaHandler = async (event, context) => {
    let webhookPayload = event.taskResult.resourceData;
    webhookPayload.id = webhookPayload.pk;
    let url = event.webhookUrl;
    let signingToken = event.webhookSignToken;
    let resourceId = webhookPayload.pk;
    let currentTime = new Date().toISOString();

    delete webhookPayload.pk;
    delete webhookPayload.companyId;

    let postData = {
      resource: webhookPayload,
      resourceId: resourceId,
      resourceType: webhookPayload.type,
      triggeredAt: currentTime,
      token: hmacSHA256(resourceId + currentTime, signingToken).toString(),
    };

    let pk = event.webhookId + '_' + webhookPayload.id + '_' + uuidv4();
    var params = {
      Item: {
        pk: pk,
        type: "webhookcall",
        url: event.webhookUrl,
        companyId: event.companyId,
        payload: postData,
        status: 'pending',
        createdAt: currentTime,
      },
      ReturnConsumedCapacity: "TOTAL",
      TableName: process.env.DB_TABLE,
      ConditionExpression: "pk <> :pk",
      ExpressionAttributeValues: {
        ":pk": pk,
      },
    };

    await docClient.put(params).promise();

    return {
      'id': pk,
      'payload': postData
    }
};
