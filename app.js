const express = require("express");
const app = express();
const path = require("path");

// Serve static files (BackstopJS HTML report, etc.)
app.use("/backstop_data", express.static(path.join(__dirname, "backstop_data")));

// Optional: Root route
app.get("/", (req, res) => {
  res.send("Visual Regression App is running. To view report, go to /backstop_data/html_report/index.html");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
