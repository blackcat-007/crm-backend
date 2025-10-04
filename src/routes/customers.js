import express from "express";
import Customer from "../models/Customer.js";
import Lead from "../models/Lead.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import { validateBody, customerSchema } from "../middleware/validateMiddleware.js";

const router = express.Router();

/**
 * @route   POST /customers
 * @desc    Create a new customer (Admin only)
 */
router.post("/", verifyToken, requireAdmin, validateBody(customerSchema), async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;

    const newCustomer = new Customer({
      name,
      email,
      phone,
      company,
      ownerId: req.user.id,
    });

    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /customers
 * @desc    List customers (any authenticated user) with pagination & search
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Search by name or email, only for owner
    const query = {
      ownerId: req.user.id,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const customers = await Customer.find(query)
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    const total = await Customer.countDocuments(query);

    res.json({ customers, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /customers/:id
 * @desc    Get a customer by ID, including their leads
 */
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer || customer.ownerId.toString() !== req.user.id)
      return res.status(404).json({ message: "Customer not found" });

    const leads = await Lead.find({ customerId: customer._id }).sort({ createdAt: -1 });

    res.json({ customer, leads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   PUT /customers/:id
 * @desc    Update a customer by ID (Admin only)
 */
router.put("/:id", verifyToken, requireAdmin, validateBody(customerSchema), async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const { name, email, phone, company } = req.body;

    customer.name = name ?? customer.name;
    customer.email = email ?? customer.email;
    customer.phone = phone ?? customer.phone;
    customer.company = company ?? customer.company;

    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /customers/:id
 * @desc    Delete a customer by ID (Admin only)
 */
router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    await customer.remove();

    // Optionally delete all leads associated with this customer
    await Lead.deleteMany({ customerId: req.params.id });

    res.json({ message: "Customer and associated leads deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
