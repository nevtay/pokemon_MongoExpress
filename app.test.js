/* eslint-disable no-undef */
const request = require("supertest");
const app = require("./app");
const Pokemon = require("./src/models/pokemon.model");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

const jwt = require("jsonwebtoken")
jest.mock("jsonwebtoken")

describe("pokemons", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri);
    } catch (err) {
      console.error(err);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const pokemonData = [
      {
        id: 1,
        name: "Pikachu",
        japaneseName: "ピカチュウ",
        baseHP: 35,
        category: "Mouse Pokemon",
      },
      {
        id: 2,
        name: "Squirtle",
        japaneseName: "ゼニガメ",
        baseHP: 44,
        category: "Tiny Turtle Pokemon",
      },
    ];
    await Pokemon.create(pokemonData);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await Pokemon.deleteMany();
  })

    describe("/pokemons", () => {
      it("GET should respond with all pokemons", async () => {
        const expectedPokemonData = [
          {
            id: 1,
            name: "Pikachu",
            japaneseName: "ピカチュウ",
            baseHP: 35,
            category: "Mouse Pokemon",
          },
          {
            id: 2,
            name: "Squirtle",
            japaneseName: "ゼニガメ",
            baseHP: 44,
            category: "Tiny Turtle Pokemon",
          },
        ];
    
        const { body: actualPokemons } = await request(app)
          .get("/pokemons")
          .expect(200);
          // actualPokemons.sort((a,b) => a.id > b.id)
        expect(actualPokemons).toMatchObject(expectedPokemonData);
        // console.log({body :actualPokemons})
      });
      it("POST / should post pokemon up", async () => {
        jwt.verify.mockReturnValueOnce({})
        const expectedPokemonData = {
            "id": 3,
            "name": "turtle man",
            "japaneseName": "カチュウ",
            "baseHP": 50,
            "category": "Man Pokemon"
          };
          const { body: actualPokemons } = await request(app)
          .post("/pokemons")
          .set("Cookie", "token=valid-token")
          .send(expectedPokemonData).expect(201);
          expect(actualPokemons).toMatchObject(expectedPokemonData);
        })
      it("PATCH / should change the pokemon name", async () => {
        const expectedPokemonData = {
            "name": "turtle man",
          };
          const { body: actualPokemons } = await request(app)
          .patch("/pokemons/2")
          .send(expectedPokemonData).expect(201);
          expect(actualPokemons).toMatchObject(expectedPokemonData);
      })
      it("PUT / should change the pokemon whole info", async () => {
        const expectedPokemonData = {
          "id": 2,
          "name": "turtle man",
          "japaneseName": "カチュウ",
          "baseHP": 50,
          "category": "Man Pokemon"
        };
          const { body: actualPokemons } = await request(app)
          .patch("/pokemons/2")
          .send(expectedPokemonData).expect(201);
          expect(actualPokemons).toMatchObject(expectedPokemonData);
        })
    });
      it("DELETE / should delete the same info", async () => {
        const expectedPokemonData = {
           id: 2,
            name: "Squirtle",
            japaneseName: "ゼニガメ",
            baseHP: 44,
            category: "Tiny Turtle Pokemon"
        };
          const { body: actualPokemons } = await request(app)
          .delete("/pokemons/2")
          .send(expectedPokemonData).expect(201);
          expect(actualPokemons).toMatchObject(expectedPokemonData);
        })
    // it("PUT / should respond wih error 400 when required name is not given", async () => {
    //   const errorPokemon = {
    //     id : 2
    //   }
    //   const { body } = await request(app)
    //   .put(`/pokemons/${errorPokemon.id}`)
    //   .send(errorPokemon)
    //   .expect(400)
    //   expect(body).toEqual({ error: "pokemonCookieCutter validation failed: name: Path `name` is required." })
    // })
    // it("POST ERR / should respond wih error 400 when post do not have the required id", async () => {
    //   jwt.verify.mockReturnValueOnce({})
    //   const errorPokemon = {
    //     "name": "turtle man",
    //     "japaneseName": "カチュウ",
    //     "baseHP": 50,
    //     "category": "Man Pokemon"
    //   }
    //   const { body } = await request(app)
    //   .post("/pokemons")
    //   .set("Cookie", "token=valid-token")
    //   .send(errorPokemon)
    //   .expect(400)
    //   expect(body).toEqual({ error: "pokemonCookieCutter validation failed: id: Path `id` is required." });

    // })
  })
