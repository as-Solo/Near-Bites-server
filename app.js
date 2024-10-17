// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

// const usersRoutes = require("./routes/users.routes");
// app.use("/api/users", usersRoutes);

// const restaurantsRoutes = require("./routes/restaurants.routes");
// app.use("/api/restaurants", restaurantsRoutes);

// const reviewsRoutes = require("./routes/reviews.routes");
// app.use("/api/reviews", reviewsRoutes);

// const bookingsRoutes = require("./routes/bookings.routes");
// app.use("/api/bookings", bookingsRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
