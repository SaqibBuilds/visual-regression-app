# Visual Regression App

This is a custom-built visual regression testing tool powered by [BackstopJS](https://github.com/garris/BackstopJS), with a simple web-based UI to dynamically set screen sizes and staging/live URLs.

---

## Features
- Add multiple custom screen sizes dynamically.
- Compare staging and live websites visually.
- Automatically generates reference and test screenshots.
- Highlights visual differences with detailed reports.
- Screenshots saved with timestamp to avoid overwriting.

---

## Installation and Setup

Clone the repository:

```bash
git clone https://github.com/SaqibLinkgraph/visual-regression.git


## Install all project dependencies
npm install

## Start the server
node server.js

## Open your browser and navigate to
http://localhost:3000

## Run tests using the Visual UI interface
Enter Staging URL:
Enter Live URL:
Comma Separated Screen Sizes (as manuy as you want):
