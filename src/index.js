import app from "./app.js";
import { connectDB } from "./database/connection.js";

async function main() {
  try {
    await connectDB();
    app.listen(process.env.PORT);
    console.log(
      `>>> Server is running on port http://localhost:${process.env.PORT}`
    );
  } catch (error) {
    console.log(error);
  }
}

main();
