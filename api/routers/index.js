import express, { json, urlencoded } from "express";
import DepartmentController from "../controllers/department.controller.js";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const router = express.Router();
const prisma = new PrismaClient();

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.get("/", (req, res) => {
  return res.render("pages/index");
});

router.post("/log", (req, res) => {
  console.log(req.body); // Log the entire body to check its contents
  const data = req.body.data;
  console.log(data);
  return res.send(data);
});

router.post("/create-dept", async (req, res) => {
  const { name, code, password } = req.body;
  try {
    await prisma.$connect();
    console.log("Conneccted");
  } catch (err) {
    console.log("Couldn't reach database: ", err);
  } finally {
    // const hashedPassword = await argon2.hash(password);
    // const department = await prisma.department.create({
    //   data: {
    //     name,
    //     code,
    //     hodPassword: hashedPassword,
    //   },
    // });
    await prisma.$disconnect();
    console.log("Out of db");
  }
  return res.send("department");
});

export default router;
