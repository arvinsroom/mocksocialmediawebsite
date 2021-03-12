const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// __dirname will be everything inside dist folder
app.use(express.static(__dirname));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
