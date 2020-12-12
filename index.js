const express = require("express");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const cryptoRandomString = require("crypto-random-string");

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

// GET - redirects to shortcode's url
app.get("/:shortcode", (req, resp, next) => {
  let shortcode = db
    .get("shortcodes")
    .find({ shortcode: req.params.shortcode });

  if (shortcode.value()) {
    shortcode.assign({ counter: shortcode.value().counter + 1 }).write();
    resp.redirect(shortcode.value().url);
  } else {
    // if it's not found in database
    const error = new Error("Shortcode not found");
    error.status = 404;
    next(error);
  }
});

app.get("/:shortcode/stats", (req, resp, next) => {
  const shortcode = db
    .get("shortcodes")
    .find({ shortcode: req.params.shortcode });

  if (shortcode.value()) {
    resp.send(shortcode.value());
  } else {
    // if it's not found in database
    const error = new Error("Shortcode not found");
    error.status = 404;
    next(error);
  }
});

app.post("/addShortcode", (req, resp, next) => {
  if (req.body.url) {
    if (!req.body.shortcode) {
      // generates 6 characters long string
      const shortcode = cryptoRandomString({ length: 6, type: "alphanumeric" });
      db.get("shortcodes")
        .push({
          url: req.body.url,
          shortcode: shortcode,
          counter: 0,
        })
        .write();
      resp.json({
        ...req.body,
        shortcode,
        counter: 0,
      });
    } else if (req.body.shortcode.length < 4) {
      const error = new Error("Shortcodes must be atleast 4 characters long");
      error.status = 400;
      next(error);
    } else {
      if (
        db.get("shortcodes").find({ shortcode: req.body.shortcode }).value()
      ) {
        const error = new Error("Shortcode already exists");
        error.status = 409;
        next(error);
      } else {
        db.get("shortcodes")
          .push({
            url: req.body.url,
            shortcode: req.body.shortcode,
            counter: 0,
          })
          .write();
        resp.json({ ...req.body, counter: 0 });
      }
    }
  } else {
    const error = new Error("Please provide an URL");
    error.status = 400;
    next(error);
  }
});

// 404 - Resource not found
app.use((req, resp, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// Error handling
app.use((err, req, resp, next) => {
  resp.status(err.status || 500);
  resp.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
  next();
});

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
