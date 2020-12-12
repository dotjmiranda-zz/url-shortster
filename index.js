const express = require("express");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const PORT = process.env.PORT || 3000;

const app = express();
const adapter = new FileSync("db.json");
const db = low(adapter);

// For parsing application/json
app.use(express.json());
// For parsing the body
app.use(express.urlencoded({ extended: true }));
// Set defaults for the JSON file (in case it's empty)
db.defaults({ shortcodes: [] }).write();

const errorHandler = (error, req, resp) => {
  resp.status(500);
  resp.send("Internal Server Error");
};

app.get("/:shortcode", (req, resp) => {
  let shortcode = db
    .get("shortcodes")
    .find({ shortcode: req.params.shortcode });

  if (shortcode.value()) {
    const newCounter = shortcode.value().counter + 1;
    console.log(newCounter);
    shortcode.assign({ counter: newCounter }).write();
    resp.redirect(shortcode.value().url);
  } else {
    resp.send(
      `<span>Shortcode <b>${req.params.shortcode}</b> does not exist</span>`
    );
  }
});

app.get("/:shortcode/stats", (req, resp) => {
  const shortcode = db
    .get("shortcodes")
    .find({ shortcode: req.params.shortcode });

  if (shortcode.value()) {
    resp.send(`
        <p>Shortcode: ${shortcode.value().shortcode}</p>
        <p>URL: ${shortcode.value().url}</p>
        <p>Times used: ${shortcode.value().counter}</p>
    `);
  } else {
    resp.send(
      `<span>Shortcode <b>${req.params.shortcode}</b> does not exist</span>`
    );
  }
});

app.post("/addShortcode", (req, resp) => {
  if (req.body.shortcode && req.body.shortcode.length < 4)
    resp.send("Shortcodes must be atleast 4 characters long");
  else {
    if (db.get("shortcodes").find({ shortcode: req.body.shortcode }).value())
      resp.send("ALREADY HAS");
    else {
      db.get("shortcodes")
        .push({
          url: req.body.url,
          shortcode: req.body.shortcode,
          counter: 0,
        })
        .write();
      resp.json(req.body);
    }
  }
});

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
