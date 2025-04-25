const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use('/backstop_data/html_report', express.static('backstop_data/html_report'));

app.get('/', (req, res) => {
  res.send('✅ Visual Regression App is running!');
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
