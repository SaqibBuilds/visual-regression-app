const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // to serve index.html from /public

// Serve the form page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Handle form submission
app.post('/generate', (req, res) => {
  const { stagingUrl, liveUrl, screenSizes } = req.body;

  const screens = screenSizes.split(',').map(size => {
    const [width, height] = size.split('x').map(num => parseInt(num.trim(), 10));
    return { label: `${width}x${height}`, width, height };
  });

  const backstopConfig = {
    id: "visual_regression",
    viewports: screens,
    scenarios: [
      {
        label: "Homepage",
        url: liveUrl,
        referenceUrl: stagingUrl,
        selectors: ["document"],
        misMatchThreshold: 0.01
      }
    ],
    paths: {
        bitmaps_reference: "backstop_data/bitmaps_reference",
        bitmaps_test: "backstop_data/bitmaps_test",
        engine_scripts: "backstop_data/engine_scripts",
        html_report: "backstop_data/html_report",
        ci_report: "backstop_data/ci_report",
        fileNameTemplate: "{scenarioLabel}-{selectorIndex}-{viewportLabel}-{timestamp}"
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

  // Save backstop.json
  fs.writeFileSync('backstop.json', JSON.stringify(backstopConfig, null, 2));

  // Run BackstopJS
  exec('npx backstop reference && npx backstop test', (err, stdout, stderr) => {
    console.log(`STDOUT:\n${stdout}`);
    console.log(`STDERR:\n${stderr}`);

    if (err) {
        // If it's a mismatch error but report was generated, treat it as success
        if (err.message.includes('Mismatch found')) {
            console.warn('BackstopJS found visual differences.');
            return res.redirect('/?success=1');
        } else {
            console.error(`Unexpected error: ${err.message}`);
            return res.redirect('/?error=1');
        }
    }

    return res.redirect('/?success=1');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
