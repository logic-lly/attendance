import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

export default class DepartmentController {
  static async createDepartment(name, code, password) {
    const hashedPassword = await argon2.hash(password);

    try {
      const department = await prisma.department.create({
        data: {
          name,
          code,
          hodPassword: hashedPassword,
        },
      });
      console.log(department);
      return department;
    } catch (error) {
      console.log("Couldn't create department: ", error);
      throw error;
    }
  }
}
