import express from "express";
import { dbConnection } from "./db/dbConnection.js";
import ApplianceModel from "./models/applianceSchema.js";
import cors from "cors";

const app = express();
const PORT = 4211;

app.use(cors());
app.use(express.json());
dbConnection();

// app.post("/create-defaults", async (req, res) => {
//   try {
//     const defaults = [
//       { name: "fan", state: "off", lastUpdated: new Date() },
//       { name: "light", state: "off", lastUpdated: new Date() },
//     ];

//     await ApplianceModel.insertMany(defaults);
//     res.json({ message: "Defaults inserted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Add this to your backend
app.get("/control", async (req, res) => {
  try {
    const appliances = await ApplianceModel.find();
    const response = {
      light: appliances.find((a) => a.name === "light").state,
      fan: appliances.find((a) => a.name === "fan").state,
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", async (req, res) => {
  try {
    const appliances = await ApplianceModel.find();
    res.json({
      appliances,
    });
  } catch (error) {
    response.json({
      message: error.message || "something went wrong",
      status: false,
    });
  }
});

app.post("/update/:id", async (req, res) => {
  try {
    const applianceId = req.params.id;
    const body = req.body;
    const updated = await ApplianceModel.findByIdAndUpdate(applianceId, body, {
      new: true,
    });

    res.json({
      message: "Appliance updated",
      updated,
    });
  } catch (error) {
    response.json({
      message: error.message || "something went wrong",
      status: false,
    });
  }
});

app.listen(PORT, () => {
  console.log("server is running on 4211");
});
