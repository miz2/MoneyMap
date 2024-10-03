import express, { Request, Response } from "express";
import InvestmentModel from "../schema/expense-record";
import mongoose from "mongoose";
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
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching investments.", error: error instanceof Error ? error.message : "Unknown error" });
  }
});

// Get investments for a specific user by date range
router.get("/getByUserAndDateRange/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start date and end date are required." });
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
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching investments by date range.", error: error instanceof Error ? error.message : "Unknown error" });
  }
});

// Create a new investment
router.post("/", async (req: Request, res: Response) => {
  try {
    const newInvestmentBody = req.body;

    // Validate the body content if needed
    if (!newInvestmentBody || typeof newInvestmentBody !== 'object') {
      return res.status(400).json({ message: "Invalid investment data." });
    }

    const newInvestment = new InvestmentModel(newInvestmentBody);
    const savedInvestment = await newInvestment.save();

    res.status(201).json(savedInvestment);
  } catch (error) {
    console.error(error);
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
    const updatedInvestmentBody = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid investment ID." });
    }

    // Check if ID exists in the request
    if (!id) {
      return res.status(400).json({ message: "Investment ID is required." });
    }

    // Find and update the investment
    const investment = await InvestmentModel.findByIdAndUpdate(id, updatedInvestmentBody, { new: true });

    if (!investment) {
      return res.status(404).json({ message: "Investment not found." });
    }

    res.status(200).json(investment);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update the investment.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});


// Delete an investment by ID
router.delete("/:id", async (req: Request, res: Response) => {
  console.log(req.params); // This will show the incoming parameters for debugging

  try {
    const { id } = req.params; // Use 'id' instead of '_id'

    if (!id) {
      return res.status(400).json({ message: "Investment ID is required." });
    }

    const investment = await InvestmentModel.findByIdAndDelete(id); // Use 'id' here as well

    if (!investment) {
      return res.status(404).json({ message: "Investment not found." });
    }

    res.status(200).json({ message: "Investment successfully deleted.", investment });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete the investment.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
