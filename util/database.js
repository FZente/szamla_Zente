import Database from "better-sqlite3";

const db = new Database('./data/database.sqlite')

db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vevo STRING,
    cime STRING, 
    adoszam STRING,
    szamlaSzam STRING,
    szamlaKelt TEXT NOT NULL
)`).run()

db.prepare(`CREATE TABLE IF NOT EXISTS kiall (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ki_neve STRING,
    ki_cime STRING, 
    ki_adoszam STRING
)`).run()

db.prepare(`CREATE TABLE IF NOT EXISTS receipts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kiallito_id INTEGER,
    vevo_id INTEGER,
    telj_dat TEXT NOT NULL,
    fiz_hat_ido TEXT NOT NULL,
    vegossz INT,
    afa INT,
    FOREIGN KEY (kiallito_id) REFERENCES kiall(id),
    FOREIGN KEY (vevo_id) REFERENCES users(id)
    )`).run();

export const getAllReceipt = () => db.prepare(`
  SELECT receipts.*,
         kiall.ki_neve AS kiallito_nev,
         users.vevo AS vevo_nev,
         users.szamlaSzam,
         users.szamlaKelt
  FROM receipts
  LEFT JOIN kiall ON receipts.kiallito_id = kiall.id
  LEFT JOIN users ON receipts.vevo_id = users.id
`).all();
export const getReceiptById = (id) => db.prepare(`SELECT * FROM receipts WHERE id = ?`).get(id)
export const creatReceipt = (kiallito_id, vevo_id, vegossz, afa) => {
  const now = new Date();
  const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();

  return db.prepare(`
    INSERT INTO receipts (kiallito_id, vevo_id, vegossz, afa, telj_dat, fiz_hat_ido)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(kiallito_id, vevo_id, vegossz, afa, now.toISOString(), twoWeeksLater);
}
export const deleteReceipt = (id) => db.prepare(`DELETE FROM receipts WHERE id = ?`).run(id)

export const getAllUsers = () => db.prepare(`SELECT * FROM users`).all()

export const getAllKi = () => db.prepare(`SELECT * FROM kiall`).all()

const users = [
    {vevo: 'Sanyi', cime: 'Valahol Sima utca 1.', adoszam: '1234567-1234567', szamlaSzam: '1234-5678-0000', szamlaKelt: '2020-03-02'},
    {vevo: 'Kati', cime: 'Itt Semmi utca 10.', adoszam: '9875432-98765432', szamlaSzam: '4431-2397-0203', szamlaKelt: '2021-10-30'},
    {vevo: 'Béla', cime: 'Senkiföldje Fő út 54.', adoszam: '65412389-32198746', szamlaSzam: '6713-2761-0104', szamlaKelt: '2015-07-10'}
]

const kiall = [
    {ki_neve: 'Cég1', ki_cime: 'Budapest Felső sor 11.', ki_adoszam: '2492675-1349765'},
    {ki_neve: 'Cég2', ki_cime: 'Pécs Ratér utca 35.', ki_adoszam: '7812654-3298457'},
    {ki_neve: 'Cég3', ki_cime: 'Szeged Arany utca 4.', ki_adoszam: '9746315-1973642'}
]

const receipts = [
    {kiallito_id: 1, vevo_id: 1, vegossz: 20000, afa: 27},
    {kiallito_id: 2, vevo_id: 1, vegossz: 15300, afa: 27},
    {kiallito_id: 3, vevo_id: 1, vegossz: 45000, afa: 23},
    {kiallito_id: 1, vevo_id: 2, vegossz: 24563, afa: 24},
    {kiallito_id: 2, vevo_id: 2, vegossz: 374215, afa: 25},
    {kiallito_id: 3, vevo_id: 2, vegossz: 971379, afa: 25},
    {kiallito_id: 1, vevo_id: 3, vegossz: 24563, afa: 24},
    {kiallito_id: 2, vevo_id: 3, vegossz: 3745, afa: 25},
    {kiallito_id: 3, vevo_id: 3, vegossz: 971379, afa: 25}
];

const insertUser = db.prepare(`INSERT INTO users (vevo, cime, adoszam, szamlaSzam, szamlaKelt) VALUES (?, ?, ?, ?, ?)`);
const existingUsers = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
if (existingUsers === 0) {
  users.forEach(user =>
    insertUser.run(user.vevo, user.cime, user.adoszam, user.szamlaSzam, user.szamlaKelt)
  );
}

// 2. Kibocsátók betöltése
const insertKiall = db.prepare(`INSERT INTO kiall (ki_neve, ki_cime, ki_adoszam) VALUES (?, ?, ?)`);
const existingKiall = db.prepare('SELECT COUNT(*) AS count FROM kiall').get().count;
if (existingKiall === 0) {
  kiall.forEach(ki => insertKiall.run(ki.ki_neve, ki.ki_cime, ki.ki_adoszam));
}

// 3. Számlák betöltése CSAK akkor, ha a fenti kettő már megtörtént
const insertReceipt = db.prepare(`
  INSERT INTO receipts (kiallito_id, vevo_id, vegossz, afa, telj_dat, fiz_hat_ido)
  VALUES (?, ?, ?, ?, ?, ?)
`);
const existingReceipts = db.prepare('SELECT COUNT(*) AS count FROM receipts').get().count;
if (existingReceipts === 0) {
  const now = new Date().toISOString();
  const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  receipts.forEach(receipt =>
    insertReceipt.run(receipt.kiallito_id, receipt.vevo_id, receipt.vegossz, receipt.afa, now, twoWeeksLater)
  );
}

// for (const receipt of receipts) creatReceipt(receipt.kiallito_id, receipt.vevo_id, receipt.vegossz, receipt.afa);

// for (const user of users) createUser(user.vevo, user.cime, user.adoszam, user.szamlaSzam, user.szamlaKelt);

// for (const ki of kiall) createKi(ki.ki_neve, ki.ki_cime, ki.ki_adoszam)