const { app, db } = require("./index");
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>
  console.log(`Running on http://localhost:${PORT}`)
);

module.exports = { server, db };
