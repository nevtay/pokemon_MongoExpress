/* eslint-disable no-undef */
const request = require("supertest");
const app = require("./app");
const trainer = require("./src/models/trainer.model");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

const jwt = require("jsonwebtoken")
jest.mock("jsonwebtoken")

describe( "Trainers", () => {
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
      const trainerData = [
        {
          "username": "ash3",
          "password": "iWannaB3DVeryBest"
        },
        {
          "username": "ash5",
          "password": "simplepassword"
        },
          
      ];
      await trainer.create(trainerData);
      // implementation below doesn't matter
      // reduces error from appearing too cluttered
      jest.spyOn(console, "error")
      console.error.mockReturnValueOnce({});
    });
  
    afterEach(async () => {
      jest.resetAllMocks()
      await trainer.deleteMany();
    })
  

  describe("/trainers/register", () => {
    it("POST should create a new trainer", async () => {
      const expectedTrainer =
      {
        username: "ash1",
        password: "123123123"
      }
      const {body : trainer} = await request(app)
      .post("/trainers/register")
      .send(expectedTrainer).expect(201)
      expect(trainer.username).toBe(expectedTrainer.username);
      expect(trainer.password).not.toBe(expectedTrainer.password)
    })
  })
  describe("/trainers/:username", () => {
    it("GET should respond with trainer details when correct trainer logs in", async () => {
      const expectedTrainer =
      {
        "username": "ash3",
      }
      jwt.verify.mockReturnValueOnce({ name: expectedTrainer.username })
      const {body : trainer} = await request(app)
      .get(`/trainers/${expectedTrainer.username}`)
      .send(expectedTrainer)
      .set("Cookie","token=valid-token")
      .expect(200);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(trainer[0]).toMatchObject(expectedTrainer)
    })
    it("GET shoulder respond with 404 when wrong trainer logs in", async () => {
      const wrongTrainer =
      {
        "username": "ash1",
      }
      jwt.verify.mockReturnValueOnce({name: wrongTrainer.username})
      const {body : error} = await request(app)
      .get(`/trainers/ash3`)
      .send(wrongTrainer)
      .set("Cookie","token=valid-token")
      .expect(403);
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(error).toEqual({error: "Incorrect user!"})
    })

    it('GET should deny access when there is no token provided', async()=> {
      const {body : error} = await request(app)
      .get(`/trainers/ash3`)
      .expect(401)
      expect(jwt.verify).not.toHaveBeenCalled();
      expect(error).toEqual({"error": "You are not authorized"})
    })

    // it('POST should not add a new trainer when password length is less than 8', async () => {
    //   const wrongTrainer = {
    //     username: "Ash3",
    //     password: "1234567"
    //   };
    //   const { body: error }
    // })
  })

  describe("/trainers/login", () => {
    it('should login when password is correct', async ()=> {
      const expectedTrainer =
      {
        "username": "ash5",
        "password": "simplepassword"
      }
      const {text : message} = await request(app)
      .post("/trainers/login")
      .send(expectedTrainer)
      .expect(200);
      expect(message).toEqual("You are now logged in!")
    })
    it('should not log in when password is wrong', async() => {
      const expectedTrainer =
      {
        "username": "ash5",
        "password": "simple"
      }
      const { body: message } = await request(app)
      .post("/trainers/login")
      .send(expectedTrainer)
      .expect(400);
      expect(message).toEqual({ "error":"Login failed" })
    })

    it("GET should deny access when token is invalid", async () => {
      const errorMessage = "Invalid token provided";
      jwt.verify.mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      const { body: error } = await request(app)
        .get(`/trainers/ash2`)
        .set("Cookie","token=valid-token")
        .expect(401);
        
        expect(jwt.verify).toHaveBeenCalledTimes(1);
        expect(error.error).toEqual("Invalid token provided");
    })
  })
})

