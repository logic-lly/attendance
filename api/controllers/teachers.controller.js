import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class TeachersController {
  static async registerTeacher(data) {
    try {
      const existingTeacher = await prisma.teacher.findFirst({
        where: {
          name: data.name,
        },
      });

      if (existingTeacher) {
        return { error: "Teacher already exists" };
      }

      const newTeacher = await prisma.teacher.create({
        data: {
          name: data.name,
          departmentCode: data.departmentCode,
        },
        select: {
          id: true,
          name: true,
          department: true,
        },
      });

      return { success: true, teacher: newTeacher };
    } catch (error) {
      console.error(error);
      return { error: "Couldn't register new teacher" };
    }
  }

  static async getCourseId(courseName) {
    try {
      // Attempt to find the first course matching the given name
      const course = await prisma.course.findFirst({
        where: {
          name: courseName,
        },
        select: {
          id: true,
        },
      });

      // Check if a course was found
      if (!course) {
        throw new Error(`Course with name "${courseName}" not found.`);
      }

      // Return the course ID
      return course.id;
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error fetching course ID:", error);

      // Optionally, you can rethrow the error to handle it at a higher level
      // or return a specific error response depending on your application's needs
      throw error;
    }
  }

  /**
   * Fetches a course by its ID and returns its modules.
   * @param {number} courseId The ID of the course to fetch.
   */
  static async getCourseModules(courseId) {
    try {
      // Fetch the course by ID
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { modules: true }, // Include the modules relation
      });

      if (!course) {
        throw new Error("Course not found");
      }

      // Return the course along with its modules
      return {
        ...course,
        modules: course.modules.map((module) => ({
          ...module,
          course: undefined, // Remove the course relation to avoid circular references
        })),
      };
    } catch (error) {
      console.error("Failed to fetch course modules:", error);
      throw error; // Rethrow the error to handle it upstream
    }
  }
}
