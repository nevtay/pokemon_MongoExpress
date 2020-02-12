/* eslint-disable no-undef */
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PokemonSchema = Schema ({

  id: {
    type : Number,
    required: true,
    minlength: 1, 
    unique: true,
  },
  name: {
    type : String,
    required: true,
    minlength: 3, 
    unique : true,
  },
  japaneseName: String,
  baseHP: Number,
  category: String,

})

const pokemonCookieCutter = mongoose.model("pokemonCookieCutter", PokemonSchema)

module.exports = pokemonCookieCutter