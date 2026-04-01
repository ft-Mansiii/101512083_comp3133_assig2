require("dotenv").config();
const app = require("./src/application");
const connectDB = require("./src/config/database");

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
  });
}

start();
