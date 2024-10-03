"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the schema
const financialRecordSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    description: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
        type: String,
        required: true,
        enum: ["Food", "Rent", "Salary", "Utilities", "Entertainment", "Healthcare", "Other"],
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["Credit Card", "Debit Card", "Cash", "Bank Transfer"],
    },
}, { timestamps: true }); // Add timestamps
// Define the model
const FinancialRecordModel = mongoose_1.default.model("FinancialRecord", financialRecordSchema);
exports.default = FinancialRecordModel;
