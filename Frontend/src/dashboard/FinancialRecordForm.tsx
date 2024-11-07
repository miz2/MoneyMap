import { useState, useCallback, memo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useFinancialRecords } from "../context/financial-record-context";
import { useSnackbar } from "notistack";
import "./FinancialRecordForm.css";

const FinancialRecordForm = () => {
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const { addRecord } = useFinancialRecords();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth0();

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.sub) {
      enqueueSnackbar("User not authenticated!", { variant: "error" });
      return;
    }

    const formattedAmount = parseFloat(amount.replace(/,/g, ""));
    const newRecord = {
      userId: user.sub,
      date: date || new Date().toISOString(),
      description,
      amount: formattedAmount,
      category,
      paymentMethod,
    };

    try {
      await addRecord(newRecord);
      setDescription("");
      setAmount("");
      setCategory("");
      setPaymentMethod("");
      setDate("");
      enqueueSnackbar("Record added successfully!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to add record.", { variant: "error" });
    }
  }, [user, amount, date, description, category, paymentMethod, addRecord, enqueueSnackbar]);

  const handleAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setAmount(parts.join("."));
  }, []);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Description:</label>
          <input
            type="text"
            required
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label>Amount:</label>
          <input
            type="text"
            required
            className="input"
            value={amount}
            onChange={handleAmountChange}
          />
        </div>
        <div className="form-field">
          <label>Category:</label>
          <select
            required
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a Category</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Salary">Salary</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-field">
          <label>Payment Method:</label>
          <select
            required
            className="input"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select a Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <div className="form-field">
          <label>Date:</label>
          <input
            type="date"
            required
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit" className="button">
          Add Record
        </button>
      </form>
    </div>
  );
};

export default memo(FinancialRecordForm);
