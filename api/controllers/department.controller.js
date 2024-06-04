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

  static async getDepartment(code) {
    try {
      const department = await prisma.department.findUnique({
        where: {
          code,
        },
      });
      if (!department) {
        throw new Error("Department not found");
      }
      return department;
    } catch (err) {
      console.log("Couldn't get department: ", err);
      throw err;
    }
  }

  static async getModulesByDepartment(departmentCode) {
    try {
      // Find the department by name and include its modules
      const department = await prisma.department.findUnique({
        where: { name: departmentCode },
        include: { modules: true }, // Include the modules relation
      });

      // Check if the department was found
      if (!department) {
        throw new Error(`Department with code "${departmentCode}" not found.`);
      }

      // Extract and return only the modules
      return department.modules.map((module) => ({
        ...module,
        department: undefined, // Optional: Exclude the department to avoid circular references
      }));
    } catch (error) {
      console.error("Error fetching modules by department:", error);
      throw error; // Rethrow the error to handle it at a higher level
    }
  }
}
