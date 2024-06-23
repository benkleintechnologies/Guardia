import express from "express";
import cors from "cors";
import locations from "./api/locations.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/locations", locations);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;