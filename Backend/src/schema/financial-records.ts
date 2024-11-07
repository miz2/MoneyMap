import mongoose, { Schema, Document } from "mongoose";

// Define the interface for FinancialRecord
interface FinancialRecord extends Document {
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

// Define the schema
const financialRecordSchema = new Schema<FinancialRecord>({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now // Default to current date if not provided
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0 // Ensure amount is not negative
  },
  category: {
    type: String,
    required: true,
    enum: ["Food", "Rent", "Salary", "Utilities", "Entertainment", "Healthcare", "Other"] // Valid categories
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ["Credit Card", "Debit Card", "Cash", "Bank Transfer"] // Valid payment methods
  }
}, { timestamps: true }); // Add timestamps for creation and updates

// Define the model
const FinancialRecordModel = mongoose.model<FinancialRecord>(
  "FinancialRecord",
  financialRecordSchema
);

export default FinancialRecordModel;
