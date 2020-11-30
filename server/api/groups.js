const router = require("express").Router();
const { Group, User_Group, User } = require("../db/models");

//GET groups for a member
router.get("/", async (req, res, next) => {
  try {
    const group = await Group.findAll({
      include: [{
        model: User,
        where: {
          id: req.user.id
        }
      }]
    });
    res.json(group);
  } catch (err) {
    next(err);
  }
});


//GET single group
router.get("/:groupId", async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.groupId, {
      include: {
        model: User,
      }
    });
    res.json(group);
  } catch (err) {
    next(err);
  }
});

//POST - create group
router.post("/", async (req, res, next) => {
  try {
    const group = await Group.create({
      name: req.body.name,
      description: req.body.description,
    });
    await User_Group.create({
      userId: req.user.id,
      groupId: group.id,
      role: 'owner'
    });
    res.json(group);
  } catch (err) {
    next(err);
  }
});

//PUT group
router.put("/:groupId", async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.groupId);
    group.update(req.body);
    res.json(group);
  } catch (err) {
    next(err);
  }
});

//DELETE group
router.delete("/:groupId", async (req, res, next) => {
  try {
    await Group.destroy({
      where: { id: req.params.groupId },
    });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

//DELETE USER from group
// router.delete("/:groupId", async (req, res, next) => {
//   try {
//     const group = await Group.findOne({
//       where: { id: req.params.id },
//     });
//     console.log(group, "group inside delete route");
//     await User_Group.destroy({
//       where: {
//         groupId: group.id,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = router;
