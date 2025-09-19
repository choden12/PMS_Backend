import express from "express";
import signupRoutes from "./routes/signupRoutes";

const app = express();
const PORT = 5000;

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Welcome to the signup!');
});

// Routes
app.use("/api", signupRoutes);


app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
