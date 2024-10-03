import mongoose, { Schema, Document } from "mongoose";
// Define the interface for Investment
interface Investment extends Document {
  userId: string; // Assuming you might want to associate investments with users
  description: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  firm: string; // New field to store firm name
}

// Define the schema
const investmentSchema = new Schema<Investment>({
  userId: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0 // Ensure amount is not negative
  },
  firm: {
    type: String,
    required: true // Make this field required
  }
}, { timestamps: true }); // Add timestamps for creation and updates

// Define the model
const InvestmentModel = mongoose.model<Investment>(
  "Investment",
  investmentSchema
);

export default InvestmentModel;
