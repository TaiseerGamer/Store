
"use strict";

const SAVE_KEY = "storeEmpireSaveV1";
const BOX_PRICE = 50;

const CATALOG = [
  {id:"chair",name:"Wooden Chair",category:"Furniture",price:100,icon:"🪑",desc:"A classic chair for customers."},
  {id:"table",name:"Dining Table",category:"Furniture",price:250,icon:"🪵",desc:"A table for your dining area."},
  {id:"sofa",name:"Luxury Sofa",category:"Furniture",price:900,icon:"🛋️",desc:"A comfortable premium sofa."},
  {id:"stool",name:"Bar Stool",category:"Furniture",price:150,icon:"🪑",desc:"Perfect for counters and bars."},
  {id:"bench",name:"Garden Bench",category:"Furniture",price:400,icon:"🪑",desc:"A relaxing outdoor bench."},
  {id:"booth",name:"Dining Booth",category:"Furniture",price:1200,icon:"🛋️",desc:"A cozy booth for groups."},
  {id:"counter",name:"Service Counter",category:"Furniture",price:800,icon:"🧾",desc:"A professional service desk."},
  {id:"shelf",name:"Display Shelf",category:"Furniture",price:350,icon:"🗄️",desc:"Show off your store products."},
  {id:"cabinet",name:"Storage Cabinet",category:"Furniture",price:450,icon:"🗄️",desc:"Organize your supplies."},
  {id:"desk",name:"Office Desk",category:"Furniture",price:500,icon:"🪑",desc:"A desk for your back office."},
  {id:"plant",name:"Small Plant",category:"Decor",price:60,icon:"🪴",desc:"Add a little greenery."},
  {id:"palm",name:"Palm Plant",category:"Decor",price:180,icon:"🌴",desc:"A tropical decoration."},
  {id:"flower",name:"Flower Vase",category:"Decor",price:90,icon:"💐",desc:"A colorful table decoration."},
  {id:"painting",name:"Wall Painting",category:"Decor",price:220,icon:"🖼️",desc:"Give your walls personality."},
  {id:"clock",name:"Wall Clock",category:"Decor",price:130,icon:"🕒",desc:"A useful decorative clock."},
  {id:"rug",name:"Luxury Rug",category:"Decor",price:550,icon:"🟫",desc:"Make your floor stand out."},
  {id:"fountain",name:"Mini Fountain",category:"Decor",price:1500,icon:"⛲",desc:"A premium water feature."},
  {id:"aquarium",name:"Aquarium",category:"Decor",price:1800,icon:"🐠",desc:"A beautiful fish display."},
  {id:"statue",name:"Golden Statue",category:"Luxury",price:5000,icon:"🏆",desc:"A prestigious centerpiece."},
  {id:"sculpture",name:"Modern Sculpture",category:"Luxury",price:3500,icon:"🗿",desc:"An artistic statement piece."},
  {id:"chandelier",name:"Crystal Chandelier",category:"Lighting",price:2200,icon:"💎",desc:"An elegant ceiling light."},
  {id:"pendant",name:"Pendant Light",category:"Lighting",price:300,icon:"💡",desc:"Warm light over your tables."},
  {id:"lamp",name:"Table Lamp",category:"Lighting",price:140,icon:"🪔",desc:"A soft decorative light."},
  {id:"neon",name:"Neon Sign",category:"Lighting",price:750,icon:"🌟",desc:"A glowing shop sign."},
  {id:"spotlight",name:"Spotlight",category:"Lighting",price:420,icon:"🔦",desc:"Highlight a special area."},
  {id:"register",name:"Cash Register",category:"Equipment",price:650,icon:"💵",desc:"Essential store equipment."},
  {id:"fridge",name:"Commercial Fridge",category:"Equipment",price:1600,icon:"🧊",desc:"Keep products chilled."},
  {id:"oven",name:"Professional Oven",category:"Equipment",price:2500,icon:"♨️",desc:"High-grade kitchen equipment."},
  {id:"coffee",name:"Coffee Machine",category:"Equipment",price:1100,icon:"☕",desc:"Serve coffee to your guests."},
  {id:"shelf2",name:"Premium Display Case",category:"Luxury",price:2800,icon:"🏛️",desc:"Showcase premium products."},
  {id:"goldchair",name:"Gold-Trim Chair",category:"Luxury",price:2200,icon:"👑",desc:"A special luxury seat."},
  {id:"marble",name:"Marble Table",category:"Luxury",price:3200,icon:"⬜",desc:"A polished marble centerpiece."},
  {id:"speaker",name:"Music Speaker",category:"Equipment",price:700,icon:"🔊",desc:"Add music to your store."},
  {id:"plantwall",name:"Green Wall",category:"Decor",price:1250,icon:"🌿",desc:"A full wall of greenery."},
  {id:"lamp2",name:"Floor Lamp",category:"Lighting",price:390,icon:"💡",desc:"Stylish floor lighting."},
  {id:"umbrella",name:"Patio Umbrella",category:"Furniture",price:480,icon:"⛱️",desc:"Shade your outdoor seating."},
  {id:"sofa2",name:"Royal Sofa",category:"Luxury",price:4200,icon:"🛋️",desc:"An exclusive royal seat."},
  {id:"mirror",name:"Decorative Mirror",category:"Decor",price:320,icon:"🪞",desc:"Make the room feel brighter."},
  {id:"goldlamp",name:"Golden Floor Lamp",category:"Luxury",price:1700,icon:"🏮",desc:"An upscale light fixture."},
  {id:"sign",name:"Store Sign",category:"Decor",price:275,icon:"🪧",desc:"Make your store recognizable."},
  {id:"plant2",name:"Bonsai Tree",category:"Luxury",price:850,icon:"🌳",desc:"A carefully styled plant."}
];

let state = loadState();
let toastTimeout;

function defaultState() {
  return {players:[], selectedId:null, customersToday:100, orders:[], nextOrderId:1};
}

function loadState() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return defaultState();
    const parsed = JSON.parse(saved);
    if (!parsed || !Array.isArray(parsed.players) || !Array.isArray(parsed.orders)) {
      return defaultState();
    }
    parsed.customersToday = Math.max(0, Number(parsed.customersToday) || 0);
    parsed.nextOrderId = Math.max(1, Number(parsed.nextOrderId) || 1);
    parsed.players.forEach(p => {
      p.inventory ||= {};
      p.money = Math.max(0, Number(p.money) || 0);
      p.stockBoxes = Math.max(0, Number(p.stockBoxes) || 0);
      p.customersServed = Math.max(0, Number(p.customersServed) || 0);
      p.earningsToday = Math.max(0, Number(p.earningsToday) || 0);
      p.rating = Math.min(5, Math.max(0, Number(p.rating ?? 5)));
    });
    if (!parsed.players.some(p => p.id === parsed.selectedId)) parsed.selectedId = null;
    return parsed;
  } catch {
    return defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch {
    notify("Could not save. Browser storage may be full or disabled.");
    return false;
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[c]);
}

function money(value) {
  return "$" + (Number(value) || 0).toLocaleString("en-US", {
    maximumFractionDigits:2
  });
}

function getPlayer(id = state.selectedId) {
  return state.players.find(p => p.id === id) || null;
}

function selectedRequired() {
  const player = getPlayer();
  if (!player) {
    notify("Create or select a player first.");
    showTab("players");
    return null;
  }
  return player;
}

function notify(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => el.classList.remove("show"), 2800);
}

function showTab(tab) {
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.id === tab));
  document.querySelectorAll(".nav").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  if (tab === "furniture") renderShop();
  if (tab === "restock") renderRestock();
  if (tab === "admin") fillAdminForms();
  window.scrollTo({top:0, behavior:"smooth"});
}

function createPlayer(name) {
  const clean = name.trim().replace(/\s+/g, " ");
  if (!clean) return notify("Enter a player name.");
  if (state.players.some(p => p.name.toLowerCase() === clean.toLowerCase())) {
    return notify("A player with that name already exists.");
  }
  const player = {
    id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()),
    name: clean, money:1000, inventory:{}, stockBoxes:0,
    customersServed:0, earningsToday:0, rating:5
  };
  state.players.push(player);
  state.selectedId = player.id;
  saveState();
  renderAll();
  notify(clean + " has joined Store Empire!");
}

document.getElementById("playerForm").addEventListener("submit", event => {
  event.preventDefault();
  createPlayer(document.getElementById("playerName").value);
  document.getElementById("playerName").value = "";
});

function selectPlayer(id) {
  if (!state.players.some(p => p.id === id)) return;
  state.selectedId = id;
  saveState();
  renderAll();
  notify("Selected " + getPlayer().name + ".");
}

function removePlayer(id) {
  const p = getPlayer(id);
  if (!p) return;
  if (!confirm("Delete " + p.name + "'s profile and inventory? This cannot be undone.")) return;
  state.players = state.players.filter(x => x.id !== id);
  if (state.selectedId === id) state.selectedId = state.players[0]?.id || null;
  saveState();
  renderAll();
  notify("Player deleted.");
}

function renderPlayers() {
  const host = document.getElementById("playerList");
  document.getElementById("playerCount").textContent =
    state.players.length + (state.players.length === 1 ? " player" : " players");

  if (!state.players.length) {
    host.innerHTML = '<div class="empty">No players yet. Enter a name above to get started.</div>';
    return;
  }

  host.innerHTML = state.players.map(p => `
    <div class="player-card ${p.id === state.selectedId ? "selected" : ""}">
      <div class="player-top">
        <div class="avatar">${escapeHTML(p.name.charAt(0).toUpperCase())}</div>
        <div><div class="player-name">${escapeHTML(p.name)}</div>
        <div class="player-meta">${p.id === state.selectedId ? "● Selected player" : "Store owner"}</div></div>
      </div>
      <div class="muted">Available balance</div>
      <div class="card-money">${money(p.money)}</div>
      <div class="player-meta">Inventory: ${inventoryCount(p)} items · Stock: ${p.stockBoxes} boxes</div>
      <div class="card-actions" style="margin-top:15px">
        <button class="${p.id === state.selectedId ? "secondary" : "primary"}" onclick="selectPlayer('${p.id}')">
          ${p.id === state.selectedId ? "Selected ✓" : "Select"}
        </button>
        <button class="danger" onclick="removePlayer('${p.id}')">Delete</button>
      </div>
    </div>`).join("");
}

function inventoryCount(p) {
  return Object.values(p.inventory || {}).reduce((sum, qty) => sum + Math.max(0, Number(qty) || 0), 0);
}

function renderStores() {
  const totalServed = state.players.reduce((s,p) => s + p.customersServed, 0);
  const totalEarned = state.players.reduce((s,p) => s + p.earningsToday, 0);
  const avgRating = state.players.length
    ? state.players.reduce((s,p) => s + p.rating, 0) / state.players.length : 0;

  document.getElementById("storeSummary").innerHTML = `
    <div class="stat-card"><span>Total players</span><strong>${state.players.length}</strong></div>
    <div class="stat-card"><span>Today's total earnings</span><strong>${money(totalEarned)}</strong></div>
    <div class="stat-card"><span>Average store rating</span><strong>${avgRating.toFixed(1)} ★</strong></div>`;

  const host = document.getElementById("storeList");
  if (!state.players.length) {
    host.innerHTML = '<div class="empty">Create a player to open their store.</div>';
    return;
  }
  host.innerHTML = state.players.map(p => `
    <div class="store-card">
      <div class="player-top"><div class="avatar">🏪</div><div>
        <h3>${escapeHTML(p.name)}'s Store</h3>
        <div class="player-meta">Owner balance: ${money(p.money)}</div>
      </div></div>
      <div class="store-rating">${"★".repeat(Math.floor(p.rating))}${"☆".repeat(5-Math.floor(p.rating))} ${p.rating.toFixed(1)} / 5</div>
      <div class="store-mini-stats">
        <div><span>Customers served today</span><strong>${p.customersServed.toLocaleString()}</strong></div>
        <div><span>Money earned today</span><strong>${money(p.earningsToday)}</strong></div>
      </div>
      <button class="secondary full" style="margin-top:14px" onclick="selectPlayer('${p.id}');showTab('players')">Manage player</button>
    </div>`).join("");
}

function renderCustomers() {
  const total = state.customersToday;
  document.getElementById("customerTotal").textContent = total.toLocaleString();
  const served = state.players.reduce((s,p) => s + p.customersServed, 0);
  document.getElementById("customerProgress").style.width =
    (total ? Math.min(100, served / total * 100) : 0) + "%";
  document.getElementById("customerNote").textContent =
    `${served.toLocaleString()} customers served across all stores. The bar compares service totals with the daily traffic target.`;

  document.getElementById("customerTable").innerHTML = state.players.length
    ? state.players.map(p => `<tr>
        <td>${escapeHTML(p.name)}</td>
        <td>${p.customersServed.toLocaleString()}</td>
        <td>${money(p.earningsToday)}</td>
        <td>${p.rating.toFixed(1)} ★</td></tr>`).join("")
    : '<tr><td colspan="4">No player data available.</td></tr>';
}

function renderShop() {
  const p = getPlayer();
  document.getElementById("shopBalance").textContent = money(p?.money || 0);
  document.getElementById("shopNotice").textContent = p
    ? "Shopping as " + p.name + ". Purchases are paid from this player's balance."
    : "Select a player first to shop.";

  const search = document.getElementById("shopSearch").value.trim().toLowerCase();
  const category = document.getElementById("shopCategory").value;
  const items = CATALOG.filter(item =>
    (category === "All" || item.category === category) &&
    (item.name.toLowerCase().includes(search) || item.desc.toLowerCase().includes(search))
  );

  document.getElementById("shopGrid").innerHTML = items.map(item => `
    <div class="shop-card">
      <div class="item-art">${item.icon}</div>
      <div class="shop-card-content">
        <div class="item-category">${item.category}</div>
        <div class="item-title">${escapeHTML(item.name)}</div>
        <div class="item-desc">${escapeHTML(item.desc)}</div>
        <div class="item-buy"><strong>${money(item.price)}</strong>
          <button class="primary" ${!p || p.money < item.price ? "disabled" : ""}
            onclick="buyItem('${item.id}')">Buy</button>
        </div>
      </div>
    </div>`).join("") || '<div class="empty">No matching products.</div>';

  renderInventory();
}

function renderInventory() {
  const p = getPlayer();
  const host = document.getElementById("inventoryList");
  if (!p) {
    host.innerHTML = '<div class="empty">Select a player to see their inventory.</div>';
    return;
  }

  const entries = Object.entries(p.inventory).filter(([,qty]) => qty > 0);
  host.innerHTML = entries.length ? entries.map(([id, qty]) => {
    const item = CATALOG.find(x => x.id === id);
    if (!item) return "";
    return `<div class="inventory-row"><span class="inv-icon">${item.icon}</span>
      <div class="inv-name">${escapeHTML(item.name)}<small>${item.category}</small></div>
      <strong>× ${qty}</strong></div>`;
  }).join("") : '<div class="empty">Your inventory is empty. Buy some furniture above.</div>';
}

function addItem(p, itemId, qty) {
  if (!CATALOG.some(x => x.id === itemId)) throw new Error("Unknown item.");
  p.inventory[itemId] = Math.max(0, Number(p.inventory[itemId]) || 0) + qty;
}

function buyItem(itemId) {
  const p = selectedRequired();
  if (!p) return;
  const item = CATALOG.find(x => x.id === itemId);
  if (!item) return notify("Item not found.");
  if (p.money < item.price) return notify("Not enough money!");
  p.money -= item.price;
  addItem(p, item.id, 1);
  saveState();
  renderAll();
  notify("Purchased " + item.name + "!");
}

function updateRestockCost() {
  const input = document.getElementById("boxCount");
  const qty = Math.floor(Number(input.value) || 0);
  document.getElementById("restockCost").textContent = money(Math.max(0, qty) * BOX_PRICE);
}

function placeRestockOrder() {
  const p = selectedRequired();
  if (!p) return;
  const boxes = Math.floor(Number(document.getElementById("boxCount").value));
  if (!Number.isSafeInteger(boxes) || boxes < 1 || boxes > 1000) {
    return notify("Choose between 1 and 1,000 boxes.");
  }
  const cost = boxes * BOX_PRICE;
  if (p.money < cost) return notify("Not enough money for this order.");

  p.money -= cost;
  state.orders.push({
    id: state.nextOrderId++,
    playerId: p.id,
    boxes,
    cost,
    status:"Pending"
  });
  saveState();
  renderAll();
  notify("Restock order placed: " + boxes + " boxes.");
}

function renderRestock() {
  const p = getPlayer();
  document.getElementById("restockBalance").textContent = money(p?.money || 0);
  document.getElementById("boxCount").max = "1000";
  updateRestockCost();

  document.getElementById("restockTable").innerHTML = state.orders.length
    ? [...state.orders].reverse().map(o => {
      const owner = getPlayer(o.playerId);
      const status = o.status === "Fulfilled" ? "Fulfilled" : "Pending";
      return `<tr><td>#${o.id}</td><td>${escapeHTML(owner?.name || "Deleted player")}</td>
        <td>${o.boxes}</td><td>${money(o.cost)}</td><td>${status}</td>
        <td>${status === "Pending" && owner
          ? `<button class="primary" onclick="fulfillOrder(${o.id})">Fulfill</button>`
          : status === "Pending" ? "Unavailable" : "Completed"}</td></tr>`;
    }).join("")
    : '<tr><td colspan="6">No restock orders yet.</td></tr>';
}

function fulfillOrder(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order || order.status !== "Pending") return notify("Order is not pending.");
  const p = getPlayer(order.playerId);
  if (!p) return notify("The player no longer exists.");
  p.stockBoxes += order.boxes;
  order.status = "Fulfilled";
  saveState();
  renderAll();
  notify("Order fulfilled. " + order.boxes + " boxes added to " + p.name + "'s stock.");
}

function fillSelect(id, selectedId) {
  const select = document.getElementById(id);
  const oldValue = selectedId || select.value;
  select.innerHTML = state.players.map(p =>
    `<option value="${p.id}">${escapeHTML(p.name)}</option>`).join("");
  if (state.players.some(p => p.id === oldValue)) select.value = oldValue;
  else if (state.selectedId) select.value = state.selectedId;
  select.disabled = !state.players.length;
}

function fillAdminForms() {
  ["moneyPlayer","purchasePlayer","statsPlayer"].forEach(id => fillSelect(id));
  const itemSelect = document.getElementById("adminItem");
  itemSelect.innerHTML = CATALOG.map(item =>
    `<option value="${item.id}">${escapeHTML(item.name)} — ${money(item.price)}</option>`
  ).join("");
  document.getElementById("adminCustomers").value = state.customersToday;

  const p = getPlayer(document.getElementById("statsPlayer").value);
  if (p) {
    document.getElementById("statsCustomers").value = p.customersServed;
    document.getElementById("statsEarnings").value = p.earningsToday;
    document.getElementById("statsRating").value = p.rating;
  }
  renderAdminTable();
}

document.getElementById("statsPlayer").addEventListener("change", () => {
  const p = getPlayer(document.getElementById("statsPlayer").value);
  if (!p) return;
  document.getElementById("statsCustomers").value = p.customersServed;
  document.getElementById("statsEarnings").value = p.earningsToday;
  document.getElementById("statsRating").value = p.rating;
});

function adjustMoney(action) {
  const p = getPlayer(document.getElementById("moneyPlayer").value);
  const amount = Number(document.getElementById("moneyAmount").value);
  if (!p) return notify("Create a player first.");
  if (!Number.isSafeInteger(amount) || amount < 1 || amount > 1_000_000_000) {
    return notify("Enter a valid whole-dollar amount.");
  }
  if (action === "give") p.money += amount;
  else {
    if (p.money < amount) return notify("The player does not have enough money.");
    p.money -= amount;
  }
  saveState();
  renderAll();
  notify((action === "give" ? "Gave " : "Took ") + money(amount) + (action === "give" ? " to " : " from ") + p.name + ".");
}

function adminPurchase() {
  const p = getPlayer(document.getElementById("purchasePlayer").value);
  const item = CATALOG.find(x => x.id === document.getElementById("adminItem").value);
  const qty = Number(document.getElementById("purchaseQty").value);
  if (!p || !item) return notify("Select a player and item.");
  if (!Number.isSafeInteger(qty) || qty < 1 || qty > 1000) return notify("Quantity must be 1–1,000.");
  addItem(p, item.id, qty);
  saveState();
  renderAll();
  notify("Admin supplied " + qty + " × " + item.name + " to " + p.name + ".");
}

function updateStats() {
  const p = getPlayer(document.getElementById("statsPlayer").value);
  if (!p) return notify("Select a player.");
  const customers = Number(document.getElementById("statsCustomers").value);
  const earnings = Number(document.getElementById("statsEarnings").value);
  const rating = Number(document.getElementById("statsRating").value);

  if (!Number.isSafeInteger(customers) || customers < 0 ||
      !Number.isFinite(earnings) || earnings < 0 || earnings > 1e12 ||
      !Number.isFinite(rating) || rating < 0 || rating > 5) {
    return notify("Enter valid statistics and a rating from 0 to 5.");
  }
  p.customersServed = customers;
  p.earningsToday = earnings;
  p.rating = rating;
  saveState();
  renderAll();
  notify("Store statistics updated.");
}

function updateCustomers() {
  const n = Number(document.getElementById("adminCustomers").value);
  if (!Number.isSafeInteger(n) || n < 0 || n > 1_000_000_000) {
    return notify("Enter a valid customer count.");
  }
  state.customersToday = n;
  saveState();
  renderAll();
  notify("Daily customer count updated.");
}

function renderAdminTable() {
  document.getElementById("adminTable").innerHTML = state.players.length
    ? state.players.map(p => `<tr>
      <td>${escapeHTML(p.name)}</td><td>${money(p.money)}</td>
      <td>${inventoryCount(p)}</td><td>${p.stockBoxes}</td>
      <td><button class="secondary" onclick="selectPlayer('${p.id}');showTab('players')">Manage</button></td>
    </tr>`).join("")
    : '<tr><td colspan="5">No players to manage.</td></tr>';
}

function renderHeader() {
  const p = getPlayer();
  document.getElementById("activePlayer").textContent = p ? "♟ " + p.name : "No player selected";
}

function renderAll() {
  renderHeader();
  renderPlayers();
  renderStores();
  renderCustomers();
  renderShop();
  renderRestock();
  fillAdminForms();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "store-empire-save.json";
  a.click();
  URL.revokeObjectURL(url);
  notify("Save backup exported.");
}

function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const incoming = JSON.parse(reader.result);
      if (!incoming || !Array.isArray(incoming.players) || !Array.isArray(incoming.orders)) {
        throw new Error("Invalid save structure");
      }
      const ids = new Set();
      for (const p of incoming.players) {
        if (!p || typeof p.id !== "string" || typeof p.name !== "string" ||
            !p.name.trim() || ids.has(p.id) || !p.inventory || typeof p.inventory !== "object" ||
            !Number.isFinite(p.money) || p.money < 0 ||
            !Number.isFinite(p.rating) || p.rating < 0 || p.rating > 5 ||
            !Number.isSafeInteger(p.customersServed) || p.customersServed < 0 ||
            !Number.isFinite(p.earningsToday) || p.earningsToday < 0 ||
            !Number.isSafeInteger(p.stockBoxes) || p.stockBoxes < 0) {
          throw new Error("Invalid player data");
        }
        ids.add(p.id);
        for (const [itemId, qty] of Object.entries(p.inventory)) {
          if (!CATALOG.some(item => item.id === itemId) ||
              !Number.isSafeInteger(qty) || qty < 0) throw new Error("Invalid inventory");
        }
      }
      for (const o of incoming.orders) {
        if (!o || !Number.isSafeInteger(o.id) || !Number.isSafeInteger(o.boxes) ||
            o.boxes < 1 || o.boxes > 1000 ||
            !Number.isFinite(o.cost) || o.cost !== o.boxes * BOX_PRICE ||
            !["Pending","Fulfilled"].includes(o.status) ||
            !ids.has(o.playerId)) throw new Error("Invalid order data");
      }
      if (!Number.isSafeInteger(incoming.customersToday) || incoming.customersToday < 0 ||
          !Number.isSafeInteger(incoming.nextOrderId) || incoming.nextOrderId < 1) {
        throw new Error("Invalid game settings");
      }
      if (incoming.selectedId !== null && !ids.has(incoming.selectedId)) {
        throw new Error("Invalid selected player");
      }
      state = incoming;
      saveState();
      renderAll();
      notify("Save imported successfully.");
    } catch {
      notify("Import failed: invalid or incompatible save file.");
    }
    event.target.value = "";
  };
  reader.readAsText(file);
}

function resetGame() {
  if (!confirm("Delete ALL players, inventories, money, and orders from this browser? Export a backup first if needed.")) return;
  state = defaultState();
  saveState();
  renderAll();
  showTab("players");
  notify("Game data reset.");
}

renderAll();
