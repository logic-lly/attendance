// Change from CommonJS import syntax to ES Module import syntax
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createDepartments() {
  const department1 = await prisma.department.create({
    data: {
      code: "CS",
      name: "Computer Studies",
      headOfDepartmentPassword: "password123", // Note: In a real scenario, passwords should be hashed before storing.
    },
  });

  const department2 = await prisma.department.create({
    data: {
      code: "EE",
      name: "Electrical Engineering",
      headOfDepartmentPassword: "password456", // Note: In a real scenario, passwords should be hashed before storing.
    },
  });

  const department3 = await prisma.department.create({
    data: {
      code: "CE",
      name: "Civil Engineering",
      headOfDepartmentPassword: "password789",
    },
  });

  console.log("Created Departments:", department1, department2, department3);
}

async function createTeachers(name, departmentCode) {
  return await prisma.teacher.create({
    data: {
      name,
      departmentCode,
    },
  });
}

async function createMoreTeachers() {
  const teacher1 = await createTeachers("John Doe", "CS");
  const teacher2 = await createTeachers("Jane Doe", "EE");
  const teacher3 = await createTeachers("John Doe", "CE");
  const teacher4 = await createTeachers("Jane Doe", "CS");
  const teacher5 = await createTeachers("Jane Doe", "CE");
  const teacher6 = await createTeachers("John Doe", "EE");

  console.log(
    "Created Teachers:",
    teacher1,
    teacher2,
    teacher3,
    teacher4,
    teacher5,
    teacher6
  );
}

const studentsData = [
  {
    name: "Jane Smith",
    registrationNumber: 20230001,
    courseId: 1,
    className: "OD20",
  },
  {
    name: "John Doe",
    registrationNumber: 20230002,
    courseId: 2,
    className: "BEng23",
  },
  {
    name: "Alice Johnson",
    registrationNumber: 20230003,
    courseId: 3,
    className: "MSc21",
  },
];

async function createMultipleStudents(studentsData) {
  const results = [];
  for (let studentData of studentsData) {
    const student = await prisma.student.create({
      data: {
        name: studentData.name,
        registrationNumber: studentData.registrationNumber,
        courseId: studentData.courseId,
        className: studentData.className,
      },
    });
    results.push(student);
  }
  return results;
}

async function createModules() {
  const module1 = await prisma.module.create({
    data: {
      code: "MOD001",
      name: "Introduction to Programming",
      departmentCode: "EE",
    },
  });

  const module2 = await prisma.module.create({
    data: {
      code: "MOD002",
      name: "Introduction to Networking",
      departmentCode: "CS",
    },
  });

  const module3 = await prisma.module.create({
    data: {
      code: "MOD003",
      name: "Introduction to ArchCAD",
      departmentCode: "CE",
    },
  });

  console.log("Created modules: ", module1, module2, module3);
}

async function createCourses() {
  return await prisma.course.createMany({
    data: [
      { name: "IT", departmentCode: "CS" },
      { name: "MNE", departmentCode: "CE" },
      { name: "EE", departmentCode: "EE" },
    ],
  });
}

async function createClasses() {
  return await prisma.class.createMany({
    data: [
      { name: "OD20", courseName: "EE" },
      { name: "BEng23", courseName: "CS" },
      { name: "MSc21", courseName: "CE" },
    ],
  });
}

async function main() {
  try {
    // createMoreTeachers();
    // createModules();
    // createDepartments();
    // const classes = await createClasses();
    // const courses = await createCourses();
    const createdStudents = await createMultipleStudents(studentsData);
    console.log(createdStudents);
  } catch (error) {
    console.error(error);
  }
}

await main().then(() => {
  console.log("Main Function Called: Check database");
});
