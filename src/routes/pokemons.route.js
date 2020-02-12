const express = require("express")
const router = express.Router()
const pokemonCookieCutter = require("../models/pokemon.model");
const wrapAsync = require("../../wrapAsync");
const { protectRoute } = require("../middlewares/auth");

  
  const requireJsonContent = (req, res, next) => {
    if (req.headers["content-type"] !== "application/json") {
      res.status(400).send("Server wants application/json!");
    } else {
      next();
    }
  };
  
  const findAll = async () => {
    const foundPokemons = await pokemonCookieCutter.find();
    return foundPokemons
  }
  // .filter(pokemon => (req.query.name ? pokemon.name === req.query.name : true))
  // .filter(pokemon => (req.query.category ? pokemon.category === req.query.category : true))
  // .filter(pokemon => (req.query.BaseHP ? pokemon.BaseHP === req.query.BaseHP : true))
  
  const getAllPokemon = async (req,res) => {
    const pokemons = (await findAll())
    res
    .status(200)
    .send(pokemons)
  }
  
  router.get("/", wrapAsync(getAllPokemon))
  
  const getSinglePokemon = (async (req,res) => {
      const pokemons = (await findAll())
      const result = pokemons.filter(pokemon => String(pokemon.id) === req.params.id)
      res.json(result)
    })
  
    router.get("/:id", wrapAsync(getSinglePokemon))
    
  
  const addPokemon = (async (req, res, next) => {
      const pokemon = new pokemonCookieCutter(req.body)
      await pokemonCookieCutter.init()
      const newPokemon = await pokemon.save()
      res
      .status(201)
      .send(newPokemon)
  });
  
  router.post("/",protectRoute, requireJsonContent, wrapAsync(addPokemon))
  
  const replacePokemon = (async (req, res, done) => {
    const pokemonId = String(req.params.id);
    const newPokemon = req.body;
    const foundPokemon = await pokemonCookieCutter.findOneAndReplace(
      { id: pokemonId },
      newPokemon,
      { new: true }
    );
    res.status(201).send(foundPokemon);
    done();
  })
  router.put("/:id", requireJsonContent, wrapAsync(replacePokemon))
  
  const changePokemonDetail = (async (req, res, done) => {
    const pokemonId = String(req.params.id);
    const newPokemon = req.body;
    const foundPokemon = await pokemonCookieCutter.findOneAndUpdate(
      { id: pokemonId },
      newPokemon,
      { new: true }
    );
    res.status(201).send(foundPokemon);
    done();
  })
  
  router.patch("/:id", requireJsonContent, wrapAsync(changePokemonDetail))
  
  // const pokemons = await pokemonCookieCutter.find()
  // const index = pokemons.filter(pokemon => String(pokemon.id) === req.params.id)
  // const removedPokemon = pokemons.splice(index,2)
  // res.json(removedPokemon)
  const deletePokemon = (async( req,res,next) => {
    const pokemonId = String(req.params.id);
    const deletedPokemon = await pokemonCookieCutter.findOneAndRemove({
      id: pokemonId
    });
    res.status(201).send(deletedPokemon);
  });
  
  router.delete("/:id", wrapAsync(deletePokemon))
  
  router.use((err,req,res,next) => {
    if (err.name === "ValidationError") {
      err.statusCode = 400;
    }
    next(err)
  })
  
  module.exports = router