const AWS = require("aws-sdk");
const eventbridge = new AWS.EventBridge();

exports.lambdaHandler = async (event, context) => {
  var eventsToPublish = [];
  for (const record of event.Records) {
    if (
      record.eventName === "INSERT" &&
      record.dynamodb.NewImage.type.S === "candidate"
    ) {
      let pk = record.dynamodb.NewImage.pk.S;
      let companyId = record.dynamodb.NewImage.companyId.S;

      let payload = {
        companyId: companyId,
        webhookEvent: "candidate.created",
        resourceType: "candidate",
        resourceId: pk,
      };

      eventsToPublish.push({
        Source: process.env.EVENT_SOURCE,
        EventBusName: process.env.EVENT_BUS,
        DetailType: "candidate.created",
        Time: new Date(),
        Detail: JSON.stringify(payload),
      });
    }
  }

  if (eventsToPublish.length > 0) {
    await eventbridge.putEvents({ Entries: eventsToPublish }).promise();
  }
};
