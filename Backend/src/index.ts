import express, { Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Importing cors package
import financialRecordsRouter from "./routes/financialrecords"; // Financial records routes
import investmentRouter from "./routes/expenserecords"; // Investment routes
import FinancialRecordModel from "./schema/financial-records";
import InvestmentModel from "./schema/expense-record"; // Imported but not directly used in this file

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware to enable CORS
app.use(cors({
  origin: "http://localhost:5173", // Adjust this to match the origin of your frontend
  methods: "GET,POST,PUT,DELETE",  // Allowed methods
  credentials: true                // Allow cookies to be sent with requests
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Enable Mongoose debug mode to log queries
mongoose.set('debug', true);

// Ensure CONNECTION_STRING is defined
const connectionString = process.env.CONNECTION_STRING;
if (!connectionString) {
  throw new Error("Please define the CONNECTION_STRING environment variable.");
}

// Root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Use the financial records routes
app.use('/financial-records', financialRecordsRouter);

// Use the investment routes
app.use('/investments', investmentRouter); // New route to handle investments

// Route for fetching records by userId, month, and year
app.get('/getByUserAndMonth/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query;

    // Type assertions for month and year
    const monthStr = typeof month === 'string' ? month : '';
    const yearStr = typeof year === 'string' ? year : '';

    if (!monthStr || !yearStr) {
      return res.status(400).json({ message: "Month and year query parameters are required." });
    }

    const records = await FinancialRecordModel.find({
      userId: userId,
      date: {
        $gte: new Date(`${yearStr}-${monthStr.padStart(2, '0')}-01`), // Start of the month
        $lt: new Date(`${yearStr}-${(parseInt(monthStr) + 1).toString().padStart(2, '0')}-01`), // Start of the next month
      }
    });

    if (records.length === 0) {
      return res.status(404).json({ message: "No records found for the specified user and month." });
    }

    res.status(200).json(records);
  } catch (err) {
    console.error("Error fetching records by user and month:", err);
    res.status(500).json({ message: "An error occurred while fetching records.", error: err });
  }
});

// Connect to MongoDB and start the server only after a successful connection
mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err); // Log connection errors
  });
