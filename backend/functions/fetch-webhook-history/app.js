const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context) => {
  let companyId = event.pathParameters.companyId;

  if (!companyId) {
    return {
      statusCode: 422,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Validation errors",
        errors: "companyId required",
      }),
    };
  }

  let data = await fetchWebhookHistory(companyId);

  if (data !== undefined) {
    result = data;
  } else {
    result = [];
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      data: result,
    }),
  };
};

async function fetchWebhookHistory(companyId) {
  var params = {
    IndexName: "gsiTypeAndCompanyId",
    KeyConditionExpression: "#type = :type and companyId = :companyId",
    ExpressionAttributeValues: {
      ":type": "webhookcall",
      ":companyId": companyId,
    },
    ExpressionAttributeNames: {
      "#type": "type",
    },
    TableName: process.env.DB_TABLE,
  };

  let data = await docClient.query(params).promise();

  return data.Items;
}
