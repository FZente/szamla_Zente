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
        const { kiallito, telj_dat, fiz_hat_ido, vegossz, afa } = req.body;
        if (!kiallito || !telj_dat || !fiz_hat_ido || !vegossz || !afa) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const savedReceipt = db.createReceipt(kiallito, telj_dat, fiz_hat_ido, vegossz, afa);
        if (savedReceipt.changes != 1) {
            return res.status(422).json({ message: "Unprocessable Entity" });
        }
        res.status(201).json({ id: savedReceipt.lastInsertRowid, kiallito, telj_dat, fiz_hat_ido, vegossz, afa});
    } catch (error) {
        res.status(500).json({ message: `${error}` });
    }
});

app.put("/receipt/:id", (req, res) => {
    try {
        const { kiallito, telj_dat, fiz_hat_ido, vegossz, afa} = req.body;
        const id = req.params.id;
        const updatedReceipt = db.updatereceipt(id, kiallito, telj_dat, fiz_hat_ido, vegossz, afa);
        if (updatedReceipt.changes != 1) {
            return res.status(422).json({ message: "Unprocessable Entity" });
        }
        res.status(200).json({ kiallito, telj_dat, fiz_hat_ido, vegossz, afa });
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

app.get("/users/:id", (req, res) => {
	try {
		const user = db.getUserById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.post("/users", (req, res) => {
	try {
		const { vevo, szamlaSzam, szamlaKelt } = req.body;
		if (!vevo || !szamlaSzam || !szamlaKelt) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		const savedUser = db.createUser(vevo, szamlaSzam, szamlaKelt);
		if (savedUser.changes != 1) {
			return res.status(422).json({ message: "Unprocessable Entity" });
		}
		res.status(201).json({ id: savedUser.lastInsertRowid, vevo, szamlaSzam, szamlaKelt });
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.put("/users/:id", (req, res) => {
	try {
		const { vevo, szamlaSzam, szamlaKelt } = req.body;
		if (!vevo || !szamlaSzam || !szamlaKelt) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		const id = req.params.id;
		const updatedUser = db.updateUser(id, vevo, szamlaSzam, szamlaKelt);
		if (updatedUser.changes != 1) {
			return res.status(422).json({ message: "Unprocessable Entity" });
		}
		res.status(200).json({ id, vevo, szamlaSzam, szamlaKelt });
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.delete("/users/:id", (req, res) => {
	try {
		const deletedUser = db.deleteUser(req.params.id);
		if (deletedUser.changes != 1) {
			return res.status(422).json({ message: "Unprocessable Entity" });
		}
		res.status(200).json({ message: "Delete successful" });
	} catch (error) {
		res.status(500).json({ message: `${error}` });
	}
});

app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));