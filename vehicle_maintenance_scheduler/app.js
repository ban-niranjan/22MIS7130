const express = require("express");
const axios = require("axios");
require("dotenv").config();

const optimizeTasks = require("./scheduler");
const Log = require("./utils/logger");

const app = express();

app.get("/schedule", async (req, res) => {

  try {

    await Log(
      "backend",
      "info",
      "route",
      "Schedule API called"
    );

    const headers = {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
    };

    const depotsResponse = await axios.get(
      "http://4.224.186.213/evaluation-service/depots",
      { headers }
    );

    const vehiclesResponse = await axios.get(
      "http://4.224.186.213/evaluation-service/vehicles",
      { headers }
    );

    const depots = depotsResponse.data.depots;
    const vehicles = vehiclesResponse.data.vehicles;

    const result = [];

    for (const depot of depots) {

      const optimized = optimizeTasks(
        vehicles,
        depot.MechanicHours
      );

      result.push({
        depotID: depot.ID,
        mechanicHours: depot.MechanicHours,
        totalImpact: optimized.totalImpact,
        selectedTasks: optimized.selectedTasks
      });

      await Log(
        "backend",
        "info",
        "service",
        `Optimized depot ${depot.ID}`
      );
    }

    res.json({
      success: true,
      schedules: result
    });

  } catch (error) {

    await Log(
      "backend",
      "error",
      "handler",
      "Failed to generate schedules"
    );

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});