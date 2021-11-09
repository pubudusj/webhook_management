const AWS = require("aws-sdk");
var docClient = new AWS.DynamoDB.DocumentClient();
var emailValidator = require("email-validator");
const { v4: uuidv4 } = require("uuid");

exports.lambdaHandler = async (event, context) => {
  let Body = JSON.parse(event.body);
  let validationErrors = validateInput(Body);

  if (validationErrors !== null) {
    return validationErrors;
  }

  let pk = uuidv4();

  var params = {
    Item: {
      pk: pk,
      type: "candidate",
      companyId: Body.companyId,
      email: Body.email,
      firstName: Body.firstName,
      lastName: Body.lastName,
      createdAt: new Date().toISOString(),
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: process.env.DB_TABLE,
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
        message: "Candidate created",
        data: {
          id: pk,
        },
      }),
    };
  } catch (error) {
    console.error("Error", error.stack);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Candidate creation failed",
        error: error.stack,
      }),
    };
  }
};

function validateInput(body) {
  let errors = [];

  if (!emailValidator.validate(body.email)) {
    errors.push("Required field email not found or invalid");
  }

  if (isNaN(body.companyId)) {
    errors.push("Required field companyId not found or invalid");
  }

  if (!body.firstName) {
    errors.push("Required field first name not found");
  }

  if (!body.lastName) {
    errors.push("Required field last name not found");
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
        errors: errors,
      }),
    };
  }

  return null;
}
