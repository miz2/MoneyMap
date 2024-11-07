"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Importing cors package
const financialrecords_1 = __importDefault(require("./routes/financialrecords"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware to enable CORS
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Adjust this to match the origin of your frontend
    methods: "GET,POST,PUT,DELETE", // Allowed methods
    credentials: true // Allow cookies to be sent with requests
}));
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Enable Mongoose debug mode to log queries
mongoose_1.default.set('debug', true);
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
app.use('/financial-records', financialrecords_1.default);
// Connect to MongoDB and start the server only after a successful connection
mongoose_1.default.connect(connectionString)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
})
    .catch(err => {
    console.error('MongoDB connection error:', err); // Log connection errors
});
