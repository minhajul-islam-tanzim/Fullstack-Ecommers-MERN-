require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

app.use((req, res, next) => {
  console.log("first", req.url, req.method);
  next();
});

app.use(
  cors({
    origin: process.env.FRONT_DOMAIN,
    credentials: true,
  }),
);

app.use(express.json());


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);




const PORT = process.env.PORT || 3001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("1st Wish is mongo connect successfully");

    app.listen(PORT, () => {
      console.log("2nd wish Server is running");
    });
  })
  .catch(() => {
    console.log("1st False there is somethong wrong connected with Server");
  });
