import express, { json, urlencoded } from "express";
import DepartmentController from "../controllers/department.controller.js";
import { PrismaClient } from "@prisma/client";
import StudentsController from "../controllers/students.controller.js";

const router = express.Router();
const prisma = new PrismaClient();

const navlinks = {
  home: {
    link1: "students",
    link2: "teachers",
    link3: "classes",
  },
  students: {
    link1: "home",
    link2: "teachers",
    link3: "classes",
  },
  teachers: {
    link1: "home",
    link2: "students",
    link3: "classes",
  },
  classes: {
    link1: "home",
    link2: "students",
    link3: "teachers",
  },
};

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get("/", (req, res) => {
  return res.render("pages/index", {
    title: "Home",
    description: "This is the home page of the application",
    navlinks: navlinks.home,
  });
});


router.get("/home", (req, res) => {
  return res.render("pages/index", {
    title: "Home",
    description: "This is the home page of the application",
    navlinks: navlinks.home,
  });
});

router.get("/students", (req, res) => {
  return res.render("pages/students", {
    title: "Students",
    description: "This is the students page of the application",
    navlinks: navlinks.students,
  });
});

router.get("/teachers", (req, res) => {
  return res.render("pages/teachers", {
    title: "Teachers",
    description: "This is the teachers page of the application",
    navlinks: navlinks.teachers,
  });
});

router.post("/create-dept", async (req, res) => {
  const { name, code, hodPassword } = req.body;
  console.log(name, code, hodPassword);
  if (!name || !code || !hodPassword) {
    return res.status(400).send({
      message: "Please provide all required fields",
    });
  }
  try {
    const department = await DepartmentController.createDepartment(
      name,
      code,
      hodPassword
    );
    return res.status(200).send(department);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

/**
 * Retrieves a list of departments based on the provided department code.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.body.code - The department code to search for.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 */
router.post("/get-dept", async (req, res) => {
  const { code } = req.body;
  console.log(req.body);
  try {
    console.log("connected");
    const departments = await DepartmentController.getDepartment(code);
    if (!departments) {
      return res.status(404).send({
        message: "Department not found",
      });
    } else {
      console.log(departments);
      return res.status(200).send(departments);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

router.get("/classes", async (req, res) => {
  // const classes = await prisma.department.findMany({});
  // console.log(classes);
  return res.render("pages/classes", {
    title: "Classes",
    description: "This is the classes page of the application",
    navlinks: navlinks.classes,
  });
});

router.get("/classes/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const Class = await ClassesController.getClass(name);
    if (!Class) {
      return res.status(404).send({
        message: "Class not found",
      });
    } else {
      console.log(Class);
      return res.render("pages/classes", {
        title: "Classes",
        description: "This is the classes page of the application",
        Class,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
});

router.post("/student-registration", async (req, res) => {
  const data = req.body;
  try {
    const student = await StudentsController.registerStudent(data);
    return res.status(200).send(student.name);
  } catch (error) {
    console.log("Couldn't register student\n", error);
    // throw(error);
    return res.redirect("back");
  }
});

export default router;
