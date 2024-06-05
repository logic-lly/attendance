import express, { json, urlencoded } from "express";
import DepartmentController from "../controllers/department.controller.js";
import { PrismaClient } from "@prisma/client";
import StudentsController from "../controllers/students.controller.js";
import TeachersController from "../controllers/teachers.controller.js";

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

router.get("/", async (req, res) => {
  return res.render("pages/index", {
    title: "Home",
    description: "This is the home page of the application",
    navlinks: navlinks.home,
  });
});

router.get("/home", (req, res) => {
  return res.redirect("/");
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

router.get("/register-teacher", (req, res) => {
  return res.render("pages/teachers", {
    title: "Teachers",
    description: "Fill in credentials below",
    navlinks: navlinks.teachers,
    newTeacher: true,
  });
});

router.post("/teacher-registration", async (req, res) => {
  const data = req.body;
  // Validate input data (example)
  if (!data.name || !data.departmentCode) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const teacherResponse = await TeachersController.registerTeacher(data);

    if (teacherResponse.error) {
      return res.status(409).json({ error: teacherResponse.error }); // Consider using 409 for conflict
    }

    // get the teacher's courses

    const departmentModules = await DepartmentController.getModulesByDepartment(
      teacherResponse.teacher.department.code
    );

    return res
      .status(201)
      .json({ success: true, teacher: teacherResponse.teacher })
      .render("pages/register-modules-teacher", {
        name: teacherResponse.teacher.name,
        title: "Module Registration",
        description: "Register your assigned modules here",
        navlinks: navlinks.teachers,
        modules: departmentModules,
      });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/register-modules-teacher", (req, res) => {
  return res.render("pages/register-modules-teacher", {
    title: "Module Registration",
    description: "Register your assigned modules here",
    navlinks: navlinks.teachers,
  });
});

router.post("/register-modules-teacher", async (req, res) => {
  // Access the values of the checkboxes
  const selectedModulesValues = Object.values(req.body);
  // Log the selected modules
  console.log(selectedModulesValues);
  return res.send(selectedModulesValues);
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
  const classes = [
    "Beng19 COE",
    "Beng19 MFT",
    "Beng19 IT",
    "Beng20 COE",
    "Beng20 MFT",
    "Beng20 IT",
    "Beng21 COE",
  ];
  return res.render("pages/classes", {
    title: "Classes",
    description: "This is the classes page of the application",
    navlinks: navlinks.classes,
    classes,
  });
});

async function generateAttendanceData(students) {
  let attendanceData = [];

  for (let student of students) {
    let lessonAttendance = [];
    let presentCount = 0; // Count of "Present" days
    for (let i = 1; i <= 15; i++) {
      let index = Math.floor(Math.random() * 2); // Randomly choose Present or Absent
      lessonAttendance.push(index === 0 ? "Present" : "Absent");
      presentCount += index === 0 ? 1 : 0; // Increment present count if "Present"
    }
    let attendancePercentage = (presentCount / 15) * 100; // Calculate percentage
    attendanceData.push({
      name: student,
      attendance: lessonAttendance,
      percentage: attendancePercentage.toFixed(2),
    });
  }

  return attendanceData;
}

router.get("/classes/:name", async (req, res) => {
  const { name } = req.params;
  let modules = [
    "Programming",
    "Networking",
    "Web Design",
    "Computer Maintenance",
  ];
  return res.render("pages/select-module", {
    title: `Modules for ${name}`,
    description: "Select Module to view attendance",
    _class: name,
    navlinks: navlinks.classes,
    modules,
  });
});

router.get("/classes/:name/:_module", async (req, res) => {
  const { name, _module } = req.params;
  let students = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Emily",
    "Frank",
    "Grace",
    "Hannah",
    "Ivan",
    "Julia",
  ];

  const attendanceData = await generateAttendanceData(students);

  let attendanceStatus = ["Present", "Absent"];
  let index = Math.floor(Math.random() * attendanceStatus.length);
  let classes = [];
  return res.render("pages/classDetails", {
    _class: name,
    _module,
    navlinks: navlinks.classes,
    classes,
    students: attendanceData, // Pass the students array to the template
    attendanceStatus: attendanceStatus[index], // Pass the attendance object to the template
  });
});

// try {
//   const _class = await ClassesController.getClass(name);
//   if (!_class) {
//     return res.status(404).send({
//       message: "Class not found",
//     });
//   } else {
//     console.log(_class);
//     return res.render("pages/classes", {
//       title: "Classes",
//       description: "This is the classes page of the application",
//       _class,
//     });
//   }
// } catch (error) {
//   console.error(error);
//   return res.status(500).send({
//     message: "Internal server error",
//   });
// }

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
