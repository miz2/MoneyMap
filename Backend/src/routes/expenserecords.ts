import express, { Request, Response } from "express";
import mongoose from "mongoose";
import InvestmentModel from "../schema/expense-record";

const router = express.Router();

// Get all investments for a specific user
router.get("/getAllByUserID/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const investments = await InvestmentModel.find({ userId });

    if (investments.length === 0) {
      return res.status(404).json({ message: "No investments found for the user." });
    }

    res.status(200).json(investments);
  } catch (error) {
    console.error("Error fetching investments by user ID:", error);
    res.status(500).json({
      message: "An error occurred while fetching investments.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get investments by user and date range
router.get("/getByUserAndDateRange/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!userId || !startDate || !endDate) {
      return res.status(400).json({ message: "User ID, start date, and end date are required." });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const investments = await InvestmentModel.find({
      userId,
      startDate: { $gte: start },
      endDate: { $lte: end },
    });

    if (investments.length === 0) {
      return res.status(404).json({ message: "No investments found for the specified date range." });
    }

    res.status(200).json(investments);
  } catch (error) {
    console.error("Error fetching investments by date range:", error);
    res.status(500).json({
      message: "An error occurred while fetching investments.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create a new investment
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, description, startDate, endDate, amount, firm } = req.body;

    // Validate input
    if (!userId || !description || !startDate || !endDate || !amount || !firm) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number." });
    }

    const newInvestment = new InvestmentModel({
      userId,
      description,
      startDate: start,
      endDate: end,
      amount: parsedAmount,
      firm,
    });

    const savedInvestment = await newInvestment.save();
    console.log("New investment created:", savedInvestment);

    res.status(201).json(savedInvestment);
  } catch (error) {
    console.error("Error creating investment:", error);
    res.status(500).json({
      message: "Failed to create a new investment.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update an investment by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid investment ID." });
    }

    const updatedInvestment = await InvestmentModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedInvestment) {
      return res.status(404).json({ message: "Investment not found." });
    }

    console.log("Investment updated:", updatedInvestment);
    res.status(200).json(updatedInvestment);
  } catch (error) {
    console.error("Error updating investment:", error);
    res.status(500).json({
      message: "Failed to update the investment.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Delete an investment by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid investment ID." });
    }

    const deletedInvestment = await InvestmentModel.findByIdAndDelete(id);

    if (!deletedInvestment) {
      return res.status(404).json({ message: "Investment not found." });
    }

    console.log("Investment deleted:", deletedInvestment);
    res.status(200).json({ message: "Investment deleted successfully.", deletedInvestment });
  } catch (error) {
    console.error("Error deleting investment:", error);
    res.status(500).json({
      message: "Failed to delete the investment.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
