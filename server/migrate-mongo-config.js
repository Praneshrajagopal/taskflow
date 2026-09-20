import dotenv from "dotenv";

dotenv.config();

export default {
  mongodb: {
    url: process.env.MONGODB_URI,
    databaseName: "employee_task_manager",
  },

  migrationsDir: "migrations",

  changelogCollectionName: "changelog",

  migrationFileExtension: ".js",

  useFileHash: false,

  moduleSystem: "esm",
};