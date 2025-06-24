import { sql } from "../config/db.js";

export const createTrasaction = async (req, res) => {
        try {
           const {title, amount, category, user_id} = req.body;
           if(!title || !amount == undefined || !category || !user_id) {
               return res.status(400).json({
                success: false,
                message: "All fields are required"
               });
           }
           const transaction = await sql`INSERT INTO transactions (user_id, title, amount, category) 
           VALUES (${user_id}, ${title}, ${amount}, ${category})
           RETURNING *`;
           
           res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction[0]
           });
        } catch (error) {
            console.error("Error creating transaction:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
}

export const getTransactions = async (req, res) => {
        try {
        const transactions = await sql`SELECT * FROM transactions ORDER BY created_at DESC`;
        res.status(200).json({
            success: true,
            data: transactions
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const getTransactionByUserId = async (req, res) => {
        try {
           const { userId } = req.params; 
        //    if(isNaN(userId)) {
        //        return res.status(400).json({
        //            success: false,
        //            message: "Invalid user ID"
        //        });
        //    }
           const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`;
             if (transactions.length === 0) {
                  return res.status(404).json({
                    success: false,
                    message: "No transactions found for this user"
                  });
             } else {
                res.status(200).json({
                    success: true,
                    data: transactions
                });
             }
    
        } catch (error) {
            console.error("Error fetching transaction:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
            
        }
}

export const deleteTransaction = async (req, res) => {
        try {
            const { id } = req.params;
            if(isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid transaction ID"
                });
            }
    
            const deletedTransaction = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;
            if (deletedTransaction.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Transaction not found"
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "Transaction deleted successfully",
                    data: deletedTransaction[0]
                });
            }
        } catch (error) {
            console.error("Error deleting transaction:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
}

export const updateTransaction = async (req, res) => {
        try {
         const { id } = req.params;
         const { title, amount, category } = req.body;
         const updatedTransaction = await sql`
            UPDATE transactions 
            SET title = ${title}, amount = ${amount}, category = ${category}
            WHERE id = ${id} 
            RETURNING *`;   
            if (updatedTransaction.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Transaction not found"
                });
            }
            res.status(200).json({
                success: true,
                message: "Transaction updated successfully",
                data: updatedTransaction[0]
            });
        } catch (error) {
            console.error("Error updating transaction:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });   
        }
}

export const getTransactionSummary = async (req, res) => {
        try {
       const { userId } = req.params;
    //    if(isNaN(userId)) {
    //        return res.status(400).json({
    //            success: false,
    //            message: "Invalid user ID"
    //        });
    //        }
           const balanceResult = await sql`SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId}`;

           const incomeResult = await sql`SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount > 0`;

           const expenseResult = await sql`SELECT COALESCE(SUM(amount), 0) AS income FROM transactions WHERE user_id = ${userId} AND amount < 0`;

           res.status(200).json({
               success: true,
               summary: {
                   balance: parseFloat(balanceResult[0].balance),
                   income: parseFloat(incomeResult[0].income),
                   expense: parseFloat(expenseResult[0].income)
               }
           });
    } catch (error) {
        console.error("Error fetching transaction summary:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        
    }
}