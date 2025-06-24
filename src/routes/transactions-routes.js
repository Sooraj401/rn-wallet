import express from 'express';
import { createTrasaction, deleteTransaction, getTransactionByUserId, getTransactions, getTransactionSummary, updateTransaction } from '../controllers/transactions-controller.js';

const router = express.Router();

router.post("/", createTrasaction);
router.get("/", getTransactions);
router.get("/:userId", getTransactionByUserId);
router.delete("/:id", deleteTransaction);
router.put("/update-transaction/:id", updateTransaction);
router.get("/summary/:userId", getTransactionSummary);

export default router;