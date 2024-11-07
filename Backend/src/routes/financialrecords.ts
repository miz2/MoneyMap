import express, { Request, Response } from "express";
import FinancialRecordModel from "../schema/financial-records";

const router = express.Router();

// Get all financial records for a specific user
router.get("/getAllByUserID/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const records = await FinancialRecordModel.find({ userId: userId });
    
    if (records.length === 0) {
      return res.status(404).json({ message: "No records found for the user." });
    }
     
    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while fetching records.", error: err });
  }
});

// Get financial records for a specific user by month and year
router.get("/getByUserAndMonth/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { month, year } = req.query;

    // Ensure both month and year are provided and are valid numbers
    if (!month || !year || isNaN(Number(month)) || isNaN(Number(year))) {
      return res.status(400).json({ message: "Valid month and year are required." });
    }

    const monthNumber = Number(month);
    const yearNumber = Number(year);

    // Validate month and year ranges
    if (monthNumber < 1 || monthNumber > 12 || yearNumber < 1900 || yearNumber > new Date().getFullYear()) {
      return res.status(400).json({ message: "Month must be between 1 and 12, and year must be realistic." });
    }

    // Create the start and end date
    const startDate = new Date(yearNumber, monthNumber - 1, 1); // Months are 0-based in JavaScript
    const endDate = new Date(yearNumber, monthNumber, 1); // First day of the next month

    const records = await FinancialRecordModel.find({
      userId: userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    if (records.length === 0) {
      return res.status(404).json({ message: "No records found for the specified month." });
    }

    res.status(200).json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while fetching records by month."  });
  }
});

// Create a new financial record
router.post("/", async (req: Request, res: Response) => {
  try {
    const newRecordBody = req.body;

    const newRecord = new FinancialRecordModel(newRecordBody);
    const savedRecord = await newRecord.save();

    res.status(201).json(savedRecord);
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      res.status(500).json({ message: "Failed to create a new record.", error: err.message });
    } else {
      res.status(500).json({ message: "Failed to create a new record.", error: "Unknown error" });
    }
  }
});

// Update a financial record by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const newRecordBody = req.body;

    const record = await FinancialRecordModel.findByIdAndUpdate(id, newRecordBody, { new: true });

    if (!record) {
      return res.status(404).json({ message: "Record not found." });
    }

    res.status(200).json(record);
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      res.status(500).json({ message: "Failed to update the record.", error: err.message });
    } else {
      res.status(500).json({ message: "Failed to update the record.", error: "Unknown error" });
    }
  }
});

// Delete a financial record by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const record = await FinancialRecordModel.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({ message: "Record not found." });
    }

    res.status(200).json({ message: "Record successfully deleted.", record });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      res.status(500).json({ message: "Failed to delete the record.", error: err.message });
    } else {
      res.status(500).json({ message: "Failed to delete the record.", error: "Unknown error" });
    }
  }
});

export default router;
