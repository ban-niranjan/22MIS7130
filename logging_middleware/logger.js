const axios = require("axios");
require("dotenv").config();

const Log = async (stack, level, packageName, message) => {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack: stack,
        level: level,
        package: packageName,
        message: message,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Log created:", response.data);
  } catch (error) {
    console.log(
      "Logging failed:",
      error.response ? error.response.data : error.message
    );
  }
};

module.exports = Log;