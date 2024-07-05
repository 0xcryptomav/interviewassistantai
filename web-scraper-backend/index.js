const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const fetchFromChatGPT = async (url) => {
  const apiKey = "sk-proj-xOwgWGbPtcXWh5G4gCdNT3BlbkFJqkBVMPV4MXqeh5sV4YBk"; // Replace with your actual OpenAI API key
  const prompt = `I am interviewing for a position at this company. Here is the company URL:${url}.
  
  please provide a 1,000 one-page document to help me prepare for this interview. Please provide the information with the section bolded as a heading (no bullet point), and content details organized in bullet points. Include these sections:
  
  mission, customer segments, value proposition, strategy, history, latest news, financial information, industry Overview, market growth, competition, competitive advantage, challenges/headwinds, intelligent questions to ask the interviewer (provide 3).
  
  Do not include any "**"s or "##"s in the results`;

  try {
    console.log(`Fetching data for URL: ${url}`);
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant designed to help users prepare for an interview. The user will enter an url of a company, and your role is to access your knowledge base and query the web in order to create a document around ~1,000 words that provides everything the user needs to know about the company in order to succeed in their interview. Be as specific as possible by querying the web. Avoid generic phrases and terms.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 1500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(
      `Received response from ChatGPT: ${JSON.stringify(response.data)}`
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error fetching data from ChatGPT API:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error fetching data from ChatGPT API");
  }
};

app.post("/fetch-info", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const data = await fetchFromChatGPT(url);
    res.json({ content: data });
  } catch (error) {
    console.error("Error in /fetch-info endpoint:", error.message);
    res.status(500).json({ error: "Error fetching data from ChatGPT API" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
