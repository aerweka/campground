const router = require("express").Router();
const Order = require("../models/order");
const Camps = require("../models/camps");
const { check, validationResult } = require("express-validator");

const inputValidation = [
  check("customer_name")
    .isEmpty()
    .withMessage("Nama tidak boleh kosong")
    .isLength({ min: 5 })
    .withMessage("Nama harus lebih dari 5 karakter"),
  check("customer_phone")
    .isEmpty()
    .withMessage("Nomor HP tidak boleh kosong")
    .isLength({ min: 5 })
    .withMessage("Nomor HP harus lebih dari 5 karakter")
    .matches("[0-9]")
    .withMessage("Nomor HP harus angka")
    .trim(),
  check("ordered_camps")
    .isEmpty()
    .withMessage("Mohon pilih tenda yang ingin disewa")
    .trim(),
  check("rent_start").isEmpty().withMessage("Mohon pilih tanggal mulai sewa"),
  check("rent_end").isEmpty().withMessage("Mohon pilih tanggal mulai sewa"),
  check("payment").isEmpty().withMessage("Mohon pilih metode pembayaran"),
];

// retrieve all orders
router.get("/", async (req, res) => {
  try {
    const allOrder = await Order.find();
    res.json(allOrder);
    // res.sendFile(__dirname+'/static/order/index.html')
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// retrieve an order by id
router.get("/:id", getOrder, (req, res) => {
  res.send(res.order);
});

// router.post("/", inputValidation, async (req, res) => {
router.post("/", async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const order = new Order({
    customer_name: req.body.customer_name,
    customer_phone: req.body.customer_phone,
    ordered_camps: req.body.ordered_camps,
    rent_start: req.body.rent_start,
    rent_end: req.body.rent_end,
    payment: req.body.payment,
  });

  try {
    req.body.ordered_camps.forEach(async (element) => {
      let orderedCamps = await Camps.findById(element);
      orderedCamps.status = "Terpesan";
      await orderedCamps.save();
    });
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", inputValidation, getOrder, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  if (req.body.customer_name) res.order.customer_name = req.body.customer_name;
  if (req.body.customer_phone)
    res.order.customer_phone = req.body.customer_phone;
  if (req.body.ordered_camps) res.order.ordered_camps = req.body.ordered_camps;
  if (req.body.rent_start) res.order.rent_start = req.body.rent_start;
  if (req.body.rent_end) res.order.rent_end = req.body.rent_end;
  if (req.body.payment) res.order.payment = req.body.payment;

  try {
    const updatedOrder = await res.order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", getOrder, async (req, res) => {
  try {
    await res.order.remove();
    res.json({ message: "Order berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getOrder(req, res, next) {
  let order;
  try {
    order = await Order.findById(req.params.id);
    if (order == null) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.order = order;
  next();
}

module.exports = router;
