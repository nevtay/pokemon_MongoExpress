/* eslint-disable no-undef */
const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")
const pokemonsRouter = require("./src/routes/pokemons.route")
const trainersRouter = require("./src/routes/trainer.route")
// const cors = require("cors")

app.get("/", (req,res) => {
  res.send(
    {
      "0": "GET    /",
      "1": "GET   /pokemons",
      "2": "GET   /pokemons?name=pokemonNameNotExact",
      "3": "POST    /pokemons",
      "4": "GET /pokemons/:id",
      "5": "PUT /pokemons/:id",
      "6": "PATCH /pokemons/:id",
      "7": "DELETE /pokemons/:id"
    }
  )
  })

app.use(express.json())
app.use(cookieParser())
// app.use(cors(corsOptions));

app.use("/trainers", trainersRouter)
app.use("/pokemons", pokemonsRouter)

app.use((err,req,res,next) => {
  res.status(err.statusCode || 500)
  console.error(err)
  if (err.statusCode){
    res.send({error :err.message})
  } else {
    res.send({error : "internal server error"})
  }
})


module.exports = app;
