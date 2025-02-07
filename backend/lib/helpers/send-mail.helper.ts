import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: "ap-south-1" });

type TSendEmail = {
  source: string;
  destination: string[];
  subject: string;
  body: string;
};

export async function sendEmail(data: TSendEmail) {
  if (
    data.source === "" ||
    data.destination.length === 0 ||
    data.subject === "" ||
    data.body === ""
  ) {
    console.log("Invalid data provided: Empty fields");
    console.log(data);
    throw new Error("Invalid data provided: Empty fields");
  }

  if(!data.source.includes("@ryomi.site")) {
    console.log("Invalid data provided: Invalid source");
    console.log(data);
    throw new Error("Invalid data provided: Invalid source");
  }

  const command = new SendEmailCommand({
    Source: data.source,
    Destination: { ToAddresses: data.destination },
    Message: {
      Subject: { Data: data.subject },
      Body: { Text: { Data: data.body } },
    },
  });

  await ses.send(command);
}
