import app from './src/app'
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server start with http://localhost:8080");
});
