import Database from "better-sqlite3";

const db = new Database('./data/database.sqlite')

db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vevo STRING,
    szamlaSzam STRING,
    szamlaKelt TEXT NOT NULL
)`).run()

db.prepare(`CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kiallito STRING,
    telj_dat TEXT NOT NULL,
    fiz_hat_ido TEXT NOT NULL,
    vegossz INT,
    afa INT
    )`).run()

export const getAllReceipt = () => db.prepare(`SELECT * FROM receipts`).all()
export const getReceiptById = (id) => db.prepare(`SELECT * FROM receipts WHERE id = ?`).get(id)
export const createReceipt = (kiallito, telj_dat, fiz_hat_ido, vegossz, afa) => db.prepare(`INSERT INTO receipts (kiallito, telj_dat, fiz_hat_ido, vegossz, afa) VALUES (?, ?, ?, ?, ?)`).run(kiallito, telj_dat, fiz_hat_ido, vegossz , afa);
export const updateReceipt = (id, kiallito, telj_dat, fiz_hat_ido, vegossz, afa) => db.prepare(`UPDATE receipts SET kiallito = ?, telj_dat = ?, fiz_hat_ido = ?, vegossz = ?, afa = ? WHERE id = ?`).run(kiallito, telj_dat, fiz_hat_ido, vegossz, afa, id);
export const deleteReceipt = (id) => db.prepare(`DELETE FROM receipts WHERE id = ?`).run(id)

export const getAllUsers = () => db.prepare(`SELECT * FROM users`).all()
export const getUserById = (id) => db.prepare(`SELECT * FROM users WHERE id = ?`).get(id)
export const createUser = (vevo, szamlaSzam, szamlaKelt) => db.prepare(`INSERT INTO users (vevo, szamlaSzam, szamlaKelt) VALUES (?, ?, ?)`).run(vevo, szamlaSzam, szamlaKelt);
export const updateUser = (id, vevo, szamlaSzam, szamlaKelt) => db.prepare(`UPDATE users SET vevo = ?, szamlaSzam = ?, szamlaKelt = ? WHERE id = ?`).run(vevo, szamlaSzam, szamlaKelt, id);
export const deleteUser = (id) => db.prepare(`DELETE FROM users WHERE id = ?`).run(id)

const users = [
    {vevo: 'Sanyi', szamlaSzam: '1234-5678-0000', szamlaKelt: ''},
    {vevo: 'Kati', szamlaSzam: '4431-2397-0203', szamlaKelt: ''},
    {vevo: 'Béla', szamlaSzam: '6713-2761-0104', szamlaKelt: ''}
]

const receipts = [
    {kiallito: 'Tesco', telj_dat: '', fiz_hat_ido: '', vegossz: 20000, afa: 27},
    {kiallito: 'Tesco', telj_dat: '', fiz_hat_ido: '', vegossz: 1500, afa: 27},
    {kiallito: 'Penny', telj_dat: '', fiz_hat_ido: '', vegossz: 45000, afa: 23},
    {kiallito: 'Penny', telj_dat: '', fiz_hat_ido: '', vegossz: 24563, afa: 24},
    {kiallito: 'Lidl', telj_dat: '', fiz_hat_ido: '', vegossz: 3745, afa: 25},
    {kiallito: 'Lidl', telj_dat: '', fiz_hat_ido: '', vegossz: 971379, afa: 25}
];

for (const receipt of receipts) createReceipt(receipt.kiallito, receipt.telj_dat, receipt.fiz_hat_ido, receipt.vegossz, receipt.afa);

for (const user of users) createUser(user.vevo, user.szamlaSzam, user.szamlaKelt);