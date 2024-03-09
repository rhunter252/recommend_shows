const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const openai = new (require("openai").Configuration)({
  apiKey: ${process.env.OPENAI_API_KEY}
}).createOpenAIApi();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/sms", async (req, res) => {
  const incomingMsg = req.body.Body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Suggest some TV shows to watch that are similar to ${incomingMsg}.`,
      max_tokens: 100,
    });

    const recommendations = response.data.choices[0].text.trim();

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(`Here are some shows you might like: ${recommendations}`);
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).send("Error processing your request");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
