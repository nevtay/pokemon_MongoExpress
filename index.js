/* eslint-disable no-undef */
const app = require("./app");
require("./src/utils/db");
require("dotenv").config()
const PORT = 3000


app.listen(PORT, () => {
  console.log(`Server start liao on http://localhost:${PORT}`)
})