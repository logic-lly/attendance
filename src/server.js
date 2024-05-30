import express from "express";
import router from "../api/routers/index.js";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

dotenv.config({
  encoding: "latin1",
  debug: false,
  override: false,
});

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4321;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public/"));

// app.set("view engine", "ejs");

// app.use("/", router);

app.get("/", (req, res) => {
  return res.sendFile("index.html");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
