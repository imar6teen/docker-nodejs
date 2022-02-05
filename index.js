require("dotenv").config();
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  SESSION_SECRET,
  REDIS_PORT,
} = require("./config/config");
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});

const postRoutes = require("./routes/PostRoutes");
const userRoutes = require("./routes/UserRoutes");

const connectWithRetry = () => {
  mongoose
    .connect(
      `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
    )
    .then(() => console.log("connected to DB"))
    .catch((err) => {
      console.log(err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.enable("trust proxy");
app.use(cors());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    name: "connect.sid",
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30000,
    },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/api/v1", (req, res) => {
  res.send("<h2>Hi Aimars</h2>");
  console.log("yeah it ran");
});

//?localhost:3000/api/v1/posts/
app.use("/api/v1/posts", postRoutes);

app.use("/api/v1/users", userRoutes);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
