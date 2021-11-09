const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context) => {
  if (!event.key || !event.type) {
    throw new Error("Required fields not found. key and type required");
  }

  let data = await fetchResourceData(event.key, event.type);

  if (data !== undefined) {
    return data;
  } else {
    return null;
  }
};

async function fetchResourceData(pk, type) {
  var params = {
    Key: {
      pk: pk,
      type: type,
    },
    TableName: process.env.DB_TABLE,
  };

  let data = await docClient.get(params).promise();

  return data.Item;
}
