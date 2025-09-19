import express from "express";
import signupRoutes from "./routes/signupRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());

// Routes
app.use("/api/signup", signupRoutes);

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
