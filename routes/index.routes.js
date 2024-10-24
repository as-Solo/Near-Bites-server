const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

const usersRoutes = require("../routes/user.routes");
router.use("/users", usersRoutes);

const restaurantsRoutes = require("../routes/restaurant.routes");
router.use("/restaurants", restaurantsRoutes);

const reviewsRoutes = require("../routes/review.routes");
router.use("/reviews", reviewsRoutes);

const bookingsRoutes = require("../routes/booking.routes");
router.use("/bookings", bookingsRoutes);

const authRoutes = require("../routes/auth.routes");
router.use("/auth", authRoutes);

const uploadRoutes = require("./upload.routes");
router.use("/upload", uploadRoutes);

const adminsRoutes = require("./admins.routes");
router.use("/admins", adminsRoutes);

module.exports = router;
