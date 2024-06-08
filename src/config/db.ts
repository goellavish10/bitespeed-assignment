import { Sequelize } from "sequelize";

const dbname = process.env.DATABASE_NAME as string;
const dbuser = process.env.DATABASE_USER as string;
const dbpassword = process.env.DATABASE_PASSWORD as string;
const dbhost = process.env.DATABASE_HOST;

export const sequelize = new Sequelize(dbname, dbuser, dbpassword, {
  host: dbhost,
  port: parseInt(process.env.DB_PORT!, 10),
  dialect: "mysql"
});

async function connectDB() {
  try {
    console.log(
      `Connecting to database ${dbname} on host ${dbhost} as ${dbuser}...`
    );

    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
}

export default connectDB;
