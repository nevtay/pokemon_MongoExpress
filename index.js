/* eslint-disable no-undef */
const app = require("./app");
require("./src/utils/db");
require("dotenv").config()
const PORT = 3000


const server = app.listen(process.env.PORT || PORT, () => {
  console.log(`Express lab started on http://localhost:${PORT}`)
})