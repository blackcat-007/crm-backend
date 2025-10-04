import express from "express";
import Lead from "../models/Lead.js";
import Customer from "../models/Customer.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import { validateBody, leadSchema, updateLeadSchema } from "../middleware/validateMiddleware.js";

const router = express.Router();

/**
 * @route   POST /leads/:customerId
 * @desc    Create a new lead for a customer (any authenticated user)
 */
router.post("/:customerId", verifyToken, validateBody(leadSchema), async (req, res) => {
  try {
    const { customerId } = req.params;
    const { title, description, status, value } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Only owner or admin can add
    if (customer.ownerId.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const newLead = new Lead({ customerId, title, description, status, value });
    await newLead.save();

    res.status(201).json(newLead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /leads/:customerId
 * @desc    Get all leads for a customer (with optional status filter)
 */
router.get("/:customerId", verifyToken, async (req, res) => {
  try {
    const { customerId } = req.params;
    const { status } = req.query;

    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Only owner or admin can view
    if (customer.ownerId.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const filter = { customerId };
    if (status) filter.status = status;

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /leads/lead/:id
 * @desc    Get a single lead by ID
 */
router.get("/lead/:id", verifyToken, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const customer = await Customer.findById(lead.customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Only owner or admin can view
    if (customer.ownerId.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    res.json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   PUT /leads/lead/:id
 * @desc    Update a lead by ID
 */
router.put("/lead/:id", verifyToken, validateBody(updateLeadSchema), async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const customer = await Customer.findById(lead.customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Only owner or admin can update
    if (customer.ownerId.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const { title, description, status, value } = req.body;

    lead.title = title ?? lead.title;
    lead.description = description ?? lead.description;
    lead.status = status ?? lead.status;
    lead.value = value ?? lead.value;

    await lead.save();
    res.json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /leads/lead/:id
 * @desc    Delete a lead by ID
 */
router.delete("/lead/:id", verifyToken, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const customer = await Customer.findById(lead.customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    // Only owner or admin can delete
    if (customer.ownerId.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    await lead.deleteOne();

    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
