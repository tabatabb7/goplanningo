const router = require("express").Router();
const { User } = require("../db/models");

function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).send("You don't have permission to view this page.");
  }
}

router.post("/", async (req, res, next) => {
  try {
    console.log("server received post signup request");
    const user = await User.create(req.body);
    req.login(user, (err) => (err ? next(err) : res.json(user)));
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else {
      next(err);
    }
  }
});

router.get("/", isAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "firstName", "lastName", "email", "isAdmin"],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});
//, {
//   attributes: ["firstName", "lastName", "email", "password"],
// });
router.get("/:userId", isAdmin, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    console.log(user, "user data from get route");
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put("/:userId", isAdmin, async (req, res, next) => {
  console.log("inside put route");
  try {
    if (req.body.password) {
      try {
        console.log("inside password check");
        await User.update(
          {
            password: req.body.password,
          },
          {
            where: {
              id: req.params.userId,
            },
          }
        );
      } catch (error) {
        next(error);
      }
    }

    await User.update(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      },
      {
        where: {
          id: req.params.userId,
        },
      }
    );
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
