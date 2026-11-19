
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.TWELVE_DATA_API_KEY;

app.get("/api/market", async (req, res) => {
  try {
    const symbol = req.query.symbol || "EUR/USD";
    const interval = req.query.interval || "1min";

    if (!API_KEY) {
      return res.status(500).json({
        error: "API key is not configured"
      });
    }

    const url = new URL(
      "https://api.twelvedata.com/time_series"
    );

    url.searchParams.set("symbol", symbol);
    url.searchParams.set("interval", interval);
    url.searchParams.set("outputsize", "100");
    url.searchParams.set("apikey", API_KEY);

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "error") {
      return res.status(400).json({
        error: data.message
      });
    }

    res.json(data);

  } catch (error) {
    res.status(500).json({
      error: "Market data unavailable"
    });
  }
});

app.listen(process.env.PORT || 3000, "0.0.0.0");
