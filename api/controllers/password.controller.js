import argon2 from "argon2";

export default class PasswordController {
  static async hashPassword(password) {
    try {
      const hash = await argon2.hash(password);
      return hash;
    } catch (err) {
      console.error(err);
      throw err; // Rethrow error after logging
    }
  }

  static async verifyPassword(password, hash) {
    try {
      const verified = await argon2.verify(hash, password);
      if (verified) {
        console.log("Password is valid");
        return true;
      } else {
        console.log("Invalid password");
        return false;
      }
    } catch (err) {
      console.error(err);
      throw err; // Rethrow error after logging
    }
  }
}
