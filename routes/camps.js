const router = require("express").Router();
const Camps = require("../models/camps");

router.get("/", async (req, res) => {
  try {
    const allCamps = await Camps.find();
    res.json(allCamps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", getCamps, (req, res) => {
  res.send(res.camps);
});

router.post("/", async (req, res) => {
  const camps = new Camps({
    alias: req.body.alias,
    location: req.body.location,
    condition: req.body.condition,
    description: req.body.dexcription,
  });

  try {
    const newCamp = await camps.save();
    res.status(201).json(newCamp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getCamps(req, res, next) {
  let camps;
  try {
    camps = await Camps.findById(req.params.id);
    if (!camps) return res.json(404).json({ message: "Tenda tidak ditemukan" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.camps = camps;
  next();
}

module.exports = router;
