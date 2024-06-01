import express from "express";
import router from "../api/routers/index.js";
import dotenv from "dotenv";

const app = express();

dotenv.config({
  path: ".env",
});

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use("/", router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
