const express = require("express");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function updateBackstopJson(referenceUrl, testUrl) {
  const backstopConfig = {
    id: "backstop_default",
    viewports: [
      { label: "mobile", width: 375, height: 667 },
      { label: "desktop", width: 1366, height: 768 },
      { label: "4K", width: 3840, height: 2160 }
    ],
    scenarios: [
      {
        label: "Homepage",
        url: testUrl,
        referenceUrl: referenceUrl,
        selectors: ["document"],
        misMatchThreshold: 0.1,
        requireSameDimensions: true
      }
    ],
    paths: {
      bitmaps_reference: "backstop_data/bitmaps_reference",
      bitmaps_test: "backstop_data/bitmaps_test",
      engine_scripts: "backstop_data/engine_scripts",
      html_report: "backstop_data/html_report",
      ci_report: "backstop_data/ci_report"
    },
    report: ["browser"],
    engine: "puppeteer",
    engineOptions: {
      args: ["--no-sandbox"]
    },
    asyncCaptureLimit: 5,
    asyncCompareLimit: 50,
    debug: false,
    debugWindow: false
  };

  fs.writeFileSync("backstop.json", JSON.stringify(backstopConfig, null, 2));
}

app.post("/run-reference", (req, res) => {
  const { referenceUrl, testUrl } = req.body;
  updateBackstopJson(referenceUrl, testUrl);

  exec("npx backstop reference", (err, stdout, stderr) => {
    if (err) return res.status(500).send(stderr || err.message);
    res.send(stdout);
  });
});

app.post("/run-test", (req, res) => {
  const { referenceUrl, testUrl } = req.body;
  updateBackstopJson(referenceUrl, testUrl);

  exec("npx backstop test", (err, stdout, stderr) => {
    if (err) return res.status(500).send(stderr || err.message);
    res.send(stdout);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
