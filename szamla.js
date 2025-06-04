async function fetchReceipts() {
  try {
    const res = await fetch('http://localhost:3000/receipt');
    const receipts = await res.json();
    renderReceipts(receipts);
  } catch (err) {
    console.error(err);
    alert('Hiba történt a számlák betöltésekor!');
  }
}

async function fetchReceiptById() {
  const id = document.getElementById('receipt-id-input').value;
  if (!id) return alert("Adj meg egy számla ID-t!");

  const res = await fetch('http://localhost:3000/receipt');
  const receipts = await res.json();
  const receipt = receipts.find(r => r.id == id);

  if (!receipt) {
    document.getElementById('receipt-container').innerHTML =
      `<p class="text-center bg-danger text-light w-25 mx-auto d-block p-2">Nem található ilyen ID-jű számla.</p>`;
    return;
  }

  renderReceipts([receipt]);
}

function renderReceipts(receipts) {
  const container = document.getElementById('receipt-container');
  container.innerHTML = '';

  receipts.forEach(receipt => {
    const card = document.createElement('div');
    const afaOsszeg = Math.round(receipt.vegossz * (receipt.afa / 100));
    const brutto = receipt.vegossz + afaOsszeg;
    card.className = 'col-sm-6 col-lg-4';
    card.innerHTML = `
      <div class="card h-100 shadow">
        <div class="card-body">
          <p><strong>Kiállító:</strong> ${receipt.kiallito_nev}</p>
          <p><strong>Vevő:</strong> ${receipt.vevo_nev}</p>
          <p><strong>Számlaszám:</strong> ${receipt.szamlaSzam || '-'}</p>
          <p><strong>Számla kelt:</strong> ${receipt.szamlaKelt ? formatDate(receipt.szamlaKelt) : '-'}</p>
          ${generateFieldRow({ ...receipt, telj_dat: formatDate(receipt.telj_dat) }, 'Teljesítés dátuma', 'telj_dat')}
          ${generateFieldRow({ ...receipt, fiz_hat_ido: formatDate(receipt.fiz_hat_ido) }, 'Fizetési határidő', 'fiz_hat_ido')}
          <p><strong>Nettó összeg:</strong> ${receipt.vegossz} Ft</p>
          <p><strong>ÁFA:</strong> ${receipt.afa}% → ${afaOsszeg} Ft</p>
          <p><strong>Végösszeg:</strong> ${brutto} Ft</p>
          <button class="btn btn-danger w-10 mt-3" onclick="deleteReceipt(${receipt.id})">Törlés</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function formatDate(isoString) {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function generateFieldRow(receipt, label, key) {
  const isDateField = ['telj_dat', 'fiz_hat_ido', 'szamlaKelt'].includes(key);
  return `
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div><strong>${label}:</strong> ${receipt[key] || ''}</div>
      ${
        isDateField
          ? ''
          : `<div class="btn-group btn-group-sm">
              <button class="btn btn-outline-warning m-1" onclick="editField(${receipt.id}, '${key}', '${receipt[key] || ''}')">✏️</button>
              <button class="btn btn-outline-danger m-1" onclick="clearField(${receipt.id}, '${key}')">🗑</button>
            </div>`
      }
    </div>
  `;
}

async function showUsers() {
  try {
    const res = await fetch('http://localhost:3000/users');
    const users = await res.json();
    renderUsers(users);
  } catch (err) {
    console.error(err);
    alert('Hiba történt a vevők betöltésekor!');
  }
}

function renderUsers(users) {
  const container = document.getElementById('users-container');
  container.innerHTML = `
    <div class="position-relative">
      <button class="btn-close position-absolute top-0 end-0 m-2" onclick="hideUsers()" aria-label="Bezárás"></button>
      <h3>Vevők</h3>
      <table class="table table-bordered table-striped">
        <thead><tr>
          <th>ID</th><th>Név</th><th>Cím</th><th>Adószám</th><th>Számlaszám</th><th>Számla kelt</th>
        </tr></thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>${user.id}</td>
              <td>${user.vevo}</td>
              <td>${user.cime}</td>
              <td>${user.adoszam}</td>
              <td>${user.szamlaSzam}</td>
              <td>${user.szamlaKelt || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function showKiall() {
  try {
    const res = await fetch('http://localhost:3000/kiall');
    const kiall = await res.json();
    renderKiall(kiall);
  } catch (err) {
    console.error(err);
    alert('Hiba történt a kibocsátók betöltésekor!');
  }
}

function renderKiall(kiallList) {
  const container = document.getElementById('kiall-container');
  container.innerHTML = `
    <div class="position-relative">
      <button class="btn-close position-absolute top-0 end-0 m-2" onclick="hideKiall()" aria-label="Bezárás"></button>
      <h3>Kiállítók</h3>
      <table class="table table-bordered table-striped">
        <thead><tr>
          <th>ID</th><th>Név</th><th>Cím</th><th>Adószám</th>
        </tr></thead>
        <tbody>
          ${kiallList.map(k => `
            <tr>
              <td>${k.id}</td>
              <td>${k.ki_neve}</td>
              <td>${k.ki_cime}</td>
              <td>${k.ki_adoszam}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function hideUsers() {
  document.getElementById('users-container').innerHTML = '';
}

function hideKiall() {
  document.getElementById('kiall-container').innerHTML = '';
}

async function editField(id, field, currentValue) {
  const newValue = prompt(`Új érték (${field}):`, currentValue);
  if (newValue === null || newValue.trim() === '' || newValue === currentValue) return;

  const res = await fetch('http://localhost:3000/receipt');
  const receipt = (await res.json()).find(r => r.id === id);
  receipt[field] = newValue;

  await fetch(`http://localhost:3000/receipt/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(receipt)
  });

  fetchReceipts();
}

async function clearField(id, field) {
  if (!confirm(`Biztosan törlöd a(z) "${field}" mezőt?`)) return;

  const res = await fetch('http://localhost:3000/receipt');
  const receipt = (await res.json()).find(r => r.id === id);
  receipt[field] = '';

  await fetch(`http://localhost:3000/receipt/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(receipt)
  });

  fetchReceipts();
}

async function deleteReceipt(id) {
  if (confirm('Biztosan törlöd a számlát?')) {
    await fetch(`http://localhost:3000/receipt/${id}`, {
      method: 'DELETE'
    });
    fetchReceipts();
  }
}

function toggleForm() {
  const formContainer = document.getElementById('receipt-form-container');
  formContainer.classList.toggle('d-none');
}

document.getElementById('receipt-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const kiallito_id = document.getElementById('kiallito_id').value.trim();
  const vevo_id = document.getElementById('vevo_id').value.trim();
  const vegossz = document.getElementById('vegossz').value.trim();
  const afa = document.getElementById('afa').value.trim();

  if (!kiallito_id || !vevo_id || !vegossz || !afa) {
    alert("Minden mezőt ki kell tölteni!");
    return;
  }

  try {
    await fetch('http://localhost:3000/receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kiallito_id: Number(kiallito_id),
        vevo_id: Number(vevo_id),
        vegossz: Number(vegossz),
        afa: Number(afa)
      })
    });

    e.target.reset();
    document.getElementById('receipt-form-container')?.classList.add('d-none');
    fetchReceipts(); // újratölti a számlalistát
  } catch (err) {
    console.error(err);
    alert('Hiba történt a számla mentésekor.');
  }
});