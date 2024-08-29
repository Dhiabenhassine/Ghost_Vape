const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
const { join } = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Set up routes
app.use("/", routes);

// Start the server
app.listen(4000, () => {
  console.log("Server started on port 4000");
});
console.log(`ttttttt1t`,process.cwd());


const buildDir = `./dist`;
console.log(join(buildDir, 'index.html'));

app.get('/*', function (req, res) {
  res.sendFile(join(buildDir, 'index.html'));
});

app.listen(5000, '127.0.0.1');
console.log('listening on ', '127.0.0.1', ':', 5000);

