"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const financial_records_1 = __importDefault(require("../schema/financial-records"));
const router = express_1.default.Router();
// Get all financial records for a specific user
router.get("/getAllByUserID/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const records = yield financial_records_1.default.find({ userId: userId });
        if (records.length === 0) {
            return res.status(404).json({ message: "No records found for the user." });
        }
        res.status(200).json(records);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while fetching records.", error: err });
    }
}));
// Create a new financial record
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newRecordBody = req.body;
        // Validate newRecordBody here, if necessary
        const newRecord = new financial_records_1.default(newRecordBody);
        const savedRecord = yield newRecord.save();
        res.status(201).json(savedRecord);
    }
    catch (err) {
        console.error(err);
        // Safely handling the error by checking if err is an instance of Error
        if (err instanceof Error) {
            res.status(500).json({ message: "Failed to create a new record.", error: err.message });
        }
        else {
            res.status(500).json({ message: "Failed to create a new record.", error: "Unknown error" });
        }
    }
}));
// Update a financial record by ID
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const newRecordBody = req.body;
        // Validate newRecordBody here, if necessary
        const record = yield financial_records_1.default.findByIdAndUpdate(id, newRecordBody, { new: true });
        if (!record) {
            return res.status(404).json({ message: "Record not found." });
        }
        res.status(200).json(record);
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            res.status(500).json({ message: "Failed to update the record.", error: err.message });
        }
        else {
            res.status(500).json({ message: "Failed to update the record.", error: "Unknown error" });
        }
    }
}));
// Delete a financial record by ID
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const record = yield financial_records_1.default.findByIdAndDelete(id);
        if (!record) {
            return res.status(404).json({ message: "Record not found." });
        }
        res.status(200).json({ message: "Record successfully deleted.", record });
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            res.status(500).json({ message: "Failed to delete the record.", error: err.message });
        }
        else {
            res.status(500).json({ message: "Failed to delete the record.", error: "Unknown error" });
        }
    }
}));
exports.default = router;
