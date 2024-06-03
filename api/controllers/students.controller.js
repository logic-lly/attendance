import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class StudentsController {
  static async registerStudent(studentData) {
    return await prisma.student.create({
      data: studentData,
    });
  }
}
