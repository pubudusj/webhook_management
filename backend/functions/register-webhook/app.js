const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();
var validator = require("valid-url");

exports.lambdaHandler = async (event, context) => {
  let Body = JSON.parse(event.body);

  let validationErrors = validateInput(Body);

  if (validationErrors !== null) {
    return validationErrors;
  }

  let signedToken = gerRandomString(32);
  let companyId = Body.companyId;
  let eventType = Body.eventType;
  let url = Body.url;
  let pk = "webhook_" + companyId + "_" + eventType;

  var params = {
    Item: {
      pk: pk,
      type: "webhook",
      url: url,
      companyId: String(companyId),
      signedToken: signedToken,
      createdAt: new Date().toISOString(),
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: process.env.DB_TABLE,
    ConditionExpression: "pk <> :pk",
    ExpressionAttributeValues: {
      ":pk": pk,
    },
  };

  try {
    await docClient.put(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Webhook created",
        data: {
          token: signedToken,
        },
      }),
    };
  } catch (error) {
    if ((error.code = "ConditionalCheckFailedException")) {
      var errorStack = "Record exists.";
    } else {
      var errorStack = error.stack;
    }

    console.error("Error", error.stack);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Webhook creation failed",
        error: errorStack,
      }),
    };
  }
};

function validateInput(body) {
  let errors = [];

  if (!validator.isUri(body.url)) {
    errors.push("Required field url not found or invalid");
  }

  if (!body.companyId || isNaN(body.companyId)) {
    errors.push("Required field companyId not found or invalid");
  }

  if (!body.eventType) {
    errors.push("Required field eventType not found or invalid");
  }

  if (errors.length > 0) {
    return {
      statusCode: 422,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Validation errors",
        error: errors,
      }),
    };
  }

  return null;
}

function gerRandomString(length, onlyNumbers = false) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  if (onlyNumbers === true) {
    var characters = "0123456789";
  }
  var charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
