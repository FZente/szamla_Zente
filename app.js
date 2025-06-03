import express from "express";
import * as db from "./util/database.js";
import cors from 'cors'
import bodyParser from 'body-parser';

const PORT = 3000;
const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.json())

app.get("/receipt", (req, res) => {
    try {
        const receipts = db.getAllReceipt();
        res.status(200).json(receipts);
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.get("/receipt/:id", (req, res) => {
    try {
        const receipt = db.getReceiptById(req.params.id);
        if (!receipt) {
            return res.status(404).json({ message: "receipt is not found" });
        }
        res.status(200).json(receipt);
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.post("/receipt", (req, res) => {
    try {
		console.log("POST /receipt body:", req.body);
        if (
		typeof kiallito_id !== 'number' || isNaN(kiallito_id) ||
		typeof vevo_id !== 'number' || isNaN(vevo_id) ||
		typeof vegossz !== 'number' || isNaN(vegossz) ||
		typeof afa !== 'number' || isNaN(afa)
		) {
		return res.status(400).json({ message: "Invalid credentials" });
		}
        const savedReceipt = db.createReceipt(kiallito_id,vevo_id, vegossz, afa);
        if (savedReceipt.changes != 1) {
            return res.status(422).json({ message: "Unprocessable Entity" });
        }
		const existingKiall = db.getAllKi().find(k => k.id === kiallito_id);
		const existingVevo = db.getAllUser().find(u => u.id === vevo_id);
		if (!existingKiall || !existingVevo) {
		return res.status(400).json({ message: "Hibás ID: nincs ilyen kibocsátó vagy vevő." });
		}
        res.status(201).json({ id: savedReceipt.lastInsertRowid, kiallito_id, vevo_id, vegossz, afa});
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
	const info = db.creatReceipt(kiallito_id, vevo_id, vegossz, afa);
	console.log("INSERT eredmény:", info);
});

app.put("/receipt/:id", (req, res) => {
    try {
        const { kiallito_id, vevo_id, vegossz, afa} = req.body;
        const id = req.params.id;
        const updatedReceipt = db.updatereceipt(id, kiallito_id, vevo_id, vegossz, afa);
        if (updatedReceipt.changes != 1) {
            return res.status(422).json({ message: "Unprocessable Entity" });
        }
        res.status(200).json({ kiallito_id, vevo_id, vegossz, afa });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.delete("/receipt/:id", (req, res) => {
    try {
        const deletedReceipt = db.deleteReceipt(req.params.id);
        if (deletedReceipt.changes != 1) {
            return res.status(422).json({ message: "Unprocessable Entity" });
        }
        res.status(200).json({ message: "Delete successful" });
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.get("/users", (req, res) => {
	try {
		const users = db.getAllUsers();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.get("/kiall", (req, res) => {
  try {
    const kiall = db.getAllKi();
    res.status(200).json(kiall);
  } catch (error) {
    res.status(500).json({ message: `${error}` });
  }
});

app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));