(() => {
  "use strict";

  const SAVE_KEY = "storeEmpireSaveV2";
  const OLD_SAVE_KEY = "storeEmpireSaveV1";
  const $ = (id) => document.getElementById(id);
  const money = (amount) => "$" + Math.floor(Number(amount) || 0).toLocaleString("en-US");
  const now = () => Date.now();
  let viewOnlyMode = false;
  let state;
  let toastTimer = null;

  const CATALOG = [
    {id:"chair",name:"Modern Chair",category:"Seating",price:120,emoji:"🪑",description:"A simple chair for a welcoming store."},
    {id:"sofa",name:"Luxury Sofa",category:"Seating",price:480,emoji:"🛋️",description:"A comfortable centerpiece for any space."},
    {id:"stool",name:"Wooden Stool",category:"Seating",price:65,emoji:"🪑",description:"Small, useful, and affordable."},
    {id:"desk",name:"Office Desk",category:"Tables",price:260,emoji:"🪵",description:"A sturdy desk for your business."},
    {id:"table",name:"Display Table",category:"Tables",price:350,emoji:"▤",description:"Show off your products in style."},
    {id:"coffeeTable",name:"Coffee Table",category:"Tables",price:180,emoji:"🪵",description:"A low table with a clean design."},
    {id:"shelf",name:"Wooden Shelf",category:"Storage",price:220,emoji:"🗄️",description:"Keep products organized and visible."},
    {id:"cabinet",name:"Storage Cabinet",category:"Storage",price:390,emoji:"🗃️",description:"Extra storage for your growing empire."},
    {id:"locker",name:"Staff Locker",category:"Storage",price:310,emoji:"🚪",description:"A practical storage locker."},
    {id:"lamp",name:"Desk Lamp",category:"Lighting",price:90,emoji:"💡",description:"A little extra light for your store."},
    {id:"floorLamp",name:"Floor Lamp",category:"Lighting",price:210,emoji:"🛋️",description:"Brighten up a corner."},
    {id:"neon",name:"Neon Sign",category:"Decor",price:550,emoji:"🌈",description:"A bright sign to catch attention."},
    {id:"plant",name:"Indoor Plant",category:"Decor",price:75,emoji:"🪴",description:"Add a touch of greenery."},
    {id:"painting",name:"Wall Painting",category:"Decor",price:240,emoji:"🖼️",description:"Give your store some personality."},
    {id:"clock",name:"Wall Clock",category:"Decor",price:110,emoji:"🕒",description:"A classic wall decoration."},
    {id:"rug",name:"Patterned Rug",category:"Decor",price:190,emoji:"🟫",description:"Make the floor feel more inviting."},
    {id:"computer",name:"Office Computer",category:"Electronics",price:720,emoji:"🖥️",description:"A useful workstation upgrade."},
    {id:"tablet",name:"Sales Tablet",category:"Electronics",price:430,emoji:"📱",description:"A handy portable device."},
    {id:"speaker",name:"Sound System",category:"Electronics",price:650,emoji:"🔊",description:"Fill your store with sound."},
    {id:"camera",name:"Security Camera",category:"Electronics",price:380,emoji:"📹",description:"A visible security upgrade."},
    {id:"register",name:"Cash Register",category:"Equipment",price:500,emoji:"🧾",description:"Essential equipment for sales."},
    {id:"counter",name:"Checkout Counter",category:"Equipment",price:800,emoji:"🏪",description:"A professional checkout station."},
    {id:"cart",name:"Shopping Cart",category:"Equipment",price:140,emoji:"🛒",description:"Help customers carry their shopping."},
    {id:"basket",name:"Shopping Basket",category:"Equipment",price:45,emoji:"🧺",description:"A basic customer basket."},
    {id:"fridge",name:"Display Fridge",category:"Appliances",price:1250,emoji:"🧊",description:"Keep display products cool."},
    {id:"microwave",name:"Microwave",category:"Appliances",price:320,emoji:"♨️",description:"A compact staff-room appliance."},
    {id:"vending",name:"Vending Machine",category:"Appliances",price:1450,emoji:"🥤",description:"A vending machine for your business."},
    {id:"plantLarge",name:"Large Plant",category:"Decor",price:320,emoji:"🌳",description:"A larger decorative plant."},
    {id:"goldChair",name:"Golden Chair",category:"Seating",price:2500,emoji:"👑",description:"A premium statement piece."},
    {id:"crystalLamp",name:"Crystal Lamp",category:"Lighting",price:3200,emoji:"💎",description:"An expensive decorative light."},
    {id:"marbleDesk",name:"Marble Desk",category:"Tables",price:4200,emoji:"🏛️",description:"A premium desk for a top-tier store."},
    {id:"arcade",name:"Arcade Machine",category:"Entertainment",price:2100,emoji:"🕹️",description:"Give customers a fun extra."},
    {id:"poolTable",name:"Pool Table",category:"Entertainment",price:3900,emoji:"🎱",description:"A premium entertainment item."},
    {id:"aquarium",name:"Aquarium",category:"Decor",price:1800,emoji:"🐠",description:"A relaxing display for your store."},
    {id:"trophy",name:"Gold Trophy",category:"Decor",price:5000,emoji:"🏆",description:"Show off your business achievements."},
    {id:"robot",name:"Helper Robot",category:"Equipment",price:8500,emoji:"🤖",description:"A futuristic item for your empire."},
    {id:"safe",name:"Security Safe",category:"Storage",price:1150,emoji:"🔐",description:"A secure storage upgrade."},
    {id:"sofaDeluxe",name:"Deluxe Sofa",category:"Seating",price:2200,emoji:"🛋️",description:"Premium comfort with extra style."},
    {id:"goldRegister",name:"Gold Register",category:"Equipment",price:6200,emoji:"💰",description:"A luxurious checkout register."},
    {id:"fountain",name:"Mini Fountain",category:"Decor",price:7200,emoji:"⛲",description:"An eye-catching luxury decoration."}
  ];

  const EVENT_INFO = {
    doubleCoins:{name:"Double Coins",emoji:"💰",description:"Daily quest rewards are doubled while this event is active."},
    furnitureDiscount:{name:"Furniture Discounts",emoji:"🛋️",description:"Furniture shop prices are reduced by 25%."},
    customerRush:{name:"Customer Rush",emoji:"👥",description:"The active player's displayed daily customer count gets a temporary 50% boost."}
  };

  const QUEST_TEMPLATES = [
    {id:"buy3",title:"Stock Up",description:"Purchase 3 items from the Furniture Shop.",emoji:"🛍️",target:3,reward:250,type:"buy"},
    {id:"buy5",title:"Big Shopper",description:"Purchase 5 items from the Furniture Shop.",emoji:"🛒",target:5,reward:450,type:"buy"},
    {id:"spend500",title:"Smart Investment",description:"Spend $500 in the Furniture Shop.",emoji:"💸",target:500,reward:300,type:"spend"},
    {id:"sell2",title:"Clear Some Space",description:"Sell 2 items from your inventory.",emoji:"📦",target:2,reward:220,type:"sell"},
    {id:"sell5",title:"Reseller",description:"Sell 5 items from your inventory.",emoji:"🔁",target:5,reward:500,type:"sell"},
    {id:"restock1",title:"Keep Stock Moving",description:"Place 1 restock order.",emoji:"🚚",target:1,reward:200,type:"restock"},
    {id:"restock3",title:"Bulk Buyer",description:"Place 3 restock orders.",emoji:"📋",target:3,reward:420,type:"restock"}
  ];

  function localDateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
  }
  function uid() { return "p_" + Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-4); }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  }
  function itemById(id) { return CATALOG.find(item => item.id === id); }
  function activePlayer() { return state.players.find(p => p.id === state.selectedId) || null; }
  function totalInventory(player) { return Object.values(player?.inventory || {}).reduce((sum,qty) => sum + Math.max(0,Number(qty)||0),0); }
  function totalItems() { return state.players.reduce((sum,p) => sum + totalInventory(p),0); }
  function totalMoney() { return state.players.reduce((sum,p) => sum + (Number(p.money)||0),0); }
  function isActiveEvent(type) { return state.events.some(e => e.type === type && e.endsAt > now()); }
  function activeEvents() { return state.events.filter(e => e.endsAt > now()); }
  function effectivePrice(item) { return Math.max(1, Math.floor(item.price * (isActiveEvent("furnitureDiscount") ? 0.75 : 1))); }
  function eventCustomerCount(player) { return Math.floor((Number(player?.customersToday)||0) * (isActiveEvent("customerRush") ? 1.5 : 1)); }
  function canEdit() {
    if (!viewOnlyMode) return true;
    toast("View-only mode is enabled. Toggle it off to make changes.", "error");
    return false;
  }
  function logActivity(message) {
    state.activity.unshift({id:uid(),message,at:now()});
    state.activity = state.activity.slice(0,12);
  }
  function toast(message, type = "success") {
    const region = $("toastRegion");
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = message;
    region.appendChild(el);
    setTimeout(() => el.remove(), 3300);
  }

  function defaultState() {
    return {players:[],selectedId:null,events:[],orders:[],nextOrderId:1,activity:[],version:2};
  }
  function normalizePlayer(p) {
    return {
      id: String(p.id || uid()),
      name: String(p.name || "Player").slice(0,24),
      money: Math.max(0,Number(p.money)||0),
      inventory: p.inventory && typeof p.inventory === "object" ? p.inventory : {},
      stores: Array.isArray(p.stores) ? p.stores : [],
      customersToday: Math.max(0,Number(p.customersToday)||0),
      reputation: Math.max(0,Math.min(100,Number(p.reputation ?? 50)||0)),
      level: Math.max(1,Number(p.level)||1),
      stats: p.stats && typeof p.stats === "object" ? p.stats : {},
      dailyQuests: p.dailyQuests && typeof p.dailyQuests === "object" ? p.dailyQuests : null
    };
  }
  function loadState() {
    try {
      let raw = localStorage.getItem(SAVE_KEY);
      if (!raw) raw = localStorage.getItem(OLD_SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const base = defaultState();
        state = {...base,...parsed};
        state.players = (Array.isArray(parsed.players) ? parsed.players : []).map(normalizePlayer);
        state.events = Array.isArray(parsed.events) ? parsed.events : [];
        state.orders = Array.isArray(parsed.orders) ? parsed.orders : [];
        state.activity = Array.isArray(parsed.activity) ? parsed.activity : [];
        state.selectedId = state.players.some(p=>p.id===parsed.selectedId) ? parsed.selectedId : (state.players[0]?.id || null);
        state.nextOrderId = Math.max(1,Number(parsed.nextOrderId)||1);
      } else {
        state = defaultState();
        const starter = normalizePlayer({id:uid(),name:"My First Store",money:2500,stores:[{id:uid(),name:"Starter Store",createdAt:now()}],customersToday:100,reputation:50,level:1,inventory:{}});
        state.players.push(starter);
        state.selectedId = starter.id;
        logActivity("Welcome to Store Empire! Your first player has been created.");
        saveState();
      }
    } catch (error) {
      console.error("Could not load Store Empire save:",error);
      state = defaultState();
      const starter = normalizePlayer({id:uid(),name:"My First Store",money:2500,stores:[{id:uid(),name:"Starter Store",createdAt:now()}],customersToday:100,reputation:50,level:1,inventory:{}});
      state.players.push(starter); state.selectedId = starter.id;
      toast("Your save could not be read, so a fresh save was started.", "error");
    }
    expireEvents();
    state.players.forEach(ensureDailyQuests);
  }
  function saveState() {
    try { localStorage.setItem(SAVE_KEY,JSON.stringify(state)); }
    catch (error) { console.error("Could not save Store Empire:",error); toast("Save failed. Your browser may be out of storage.", "error"); }
  }

  function expireEvents() {
    const before = state.events.length;
    state.events = state.events.filter(e => Number(e.endsAt) > now());
    if (state.events.length !== before) {
      logActivity("One or more timed events expired.");
      saveState();
    }
  }

  function shuffled(items) {
    const arr = items.slice();
    for (let i=arr.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
    return arr;
  }
  function ensureDailyQuests(player) {
    const today = localDateKey();
    if (player.dailyQuests?.date === today && Array.isArray(player.dailyQuests.quests)) return;
    const picks = shuffled(QUEST_TEMPLATES).slice(0,3);
    player.dailyQuests = {date:today,claimedRewards:0,quests:picks.map(q=>({...q,progress:0,claimed:false}))};
  }
  function updateQuestProgress(player, type, amount) {
    if (!player) return;
    ensureDailyQuests(player);
    player.dailyQuests.quests.forEach(q => {
      if (q.type === type && !q.claimed) q.progress = Math.min(q.target, (Number(q.progress)||0) + amount);
    });
  }

  function showTab(tab) {
    const valid = ["overview","players","stores","shop","inventory","restock","quests","events","dashboard","admin"];
    if (!valid.includes(tab)) tab = "overview";
    document.querySelectorAll(".tab-page").forEach(el => el.classList.toggle("active",el.id === `tab-${tab}`));
    document.querySelectorAll(".nav[data-tab]").forEach(el => el.classList.toggle("active",el.dataset.tab === tab));
    const names = {overview:"Overview",players:"Players",stores:"Stores",shop:"Furniture Shop",inventory:"Inventory",restock:"Restocking",quests:"Daily Quests",events:"Events",dashboard:"View-Only Dashboard",admin:"Admin Panel"};
    $("pageTitle").textContent = names[tab];
    if (tab === "dashboard") renderDashboard();
    if (tab === "admin") renderAdminForms();
    if (tab === "quests") renderQuests();
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function createPlayer(name, startingMoney) {
    if (!canEdit()) return;
    name = String(name || "").trim().slice(0,24);
    if (!name) return toast("Enter a player name.", "error");
    const player = normalizePlayer({id:uid(),name,money:Math.max(0,Number(startingMoney)||0),stores:[],inventory:{},customersToday:0,reputation:50,level:1});
    ensureDailyQuests(player);
    state.players.push(player); state.selectedId = player.id;
    logActivity(`Created player ${player.name}.`); saveState(); renderAll(); showTab("players"); toast(`Player "${player.name}" created.`);
  }
  function selectPlayer(id) {
    if (!state.players.some(p=>p.id===id)) return;
    state.selectedId = id; saveState(); renderAll();
  }
  function removePlayer(id) {
    if (!canEdit()) return;
    const p = state.players.find(x=>x.id===id);
    if (!p) return;
    if (!confirm(`Delete player "${p.name}" and their inventory? This cannot be undone.`)) return;
    state.players = state.players.filter(x=>x.id!==id);
    if (state.selectedId===id) state.selectedId = state.players[0]?.id || null;
    logActivity(`Deleted player ${p.name}.`); saveState(); renderAll(); toast("Player deleted.");
  }
  function addStore() {
    if (!canEdit()) return;
    const p = activePlayer(); if (!p) return toast("Create a player first.","error");
    const name = prompt("Name your new store:",`Store ${p.stores.length+1}`);
    if (name === null) return;
    if (!name.trim()) return toast("Store name cannot be empty.","error");
    p.stores.push({id:uid(),name:name.trim().slice(0,40),createdAt:now()});
    logActivity(`${p.name} added store "${name.trim()}".`); saveState(); renderAll(); toast("Store added.");
  }

  function renderHeader() {
    const select = $("activePlayerSelect");
    const current = state.selectedId;
    select.innerHTML = state.players.length ? state.players.map(p=>`<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}</option>`).join("") : `<option value="">No players</option>`;
    select.value = current || "";
    select.disabled = viewOnlyMode || !state.players.length;
    $("headerMoney").textContent = money(activePlayer()?.money||0);
    $("modeLabel").textContent = viewOnlyMode ? "View-only mode" : "Owner controls";
    $("modeHint").textContent = viewOnlyMode ? "Editing is disabled" : "Changes are enabled";
    document.body.classList.toggle("mode-readonly",viewOnlyMode);
    $("viewModeButton").innerHTML = viewOnlyMode ? "<span>◉</span> Turn Off View-Only" : "<span>◉</span> Toggle View-Only";
    $("questNavDot").style.display = state.players.some(p=>p.dailyQuests?.quests?.some(q=>q.progress>=q.target&&!q.claimed)) ? "block" : "none";
    document.querySelectorAll("button.primary,button.danger,.file-button").forEach(el=>{
      if (el.id === "viewModeButton") return;
      if (viewOnlyMode && !el.closest("#tab-dashboard") && !el.closest("#tab-events")) el.setAttribute("data-view-disabled","true");
      else el.removeAttribute("data-view-disabled");
    });
    document.querySelectorAll("[data-view-disabled='true']").forEach(el=>{ if ("disabled" in el) el.disabled=true; });
    if (!viewOnlyMode) document.querySelectorAll("button:disabled[data-view-disabled]").forEach(el=>{el.disabled=false;el.removeAttribute("data-view-disabled");});
  }
  function renderOverview() {
    $("statPlayers").textContent = state.players.length;
    $("statMoney").textContent = money(totalMoney());
    $("statItems").textContent = totalItems();
    $("statEvents").textContent = activeEvents().length;
    $("overviewEvents").innerHTML = activeEvents().length ? activeEvents().map(e=>`<div class="compact-row"><div class="compact-icon">${EVENT_INFO[e.type]?.emoji||"✦"}</div><div><b>${escapeHtml(EVENT_INFO[e.type]?.name||e.type)}</b><small>${timeLeft(e.endsAt)} remaining</small></div></div>`).join("") : `<div class="empty-state">No active events right now.</div>`;
    $("activityList").innerHTML = state.activity.length ? state.activity.slice(0,6).map(a=>`<div class="activity-row"><div class="compact-icon">↗</div><div><b>${escapeHtml(a.message)}</b><small>${new Date(a.at).toLocaleString()}</small></div></div>`).join("") : `<div class="empty-state">Your recent actions will appear here.</div>`;
  }
    function renderPlayers() {
    $("playersList").innerHTML = state.players.length ? state.players.map(p=>`<div class="player-card"><div class="player-avatar">${escapeHtml(p.name.slice(0,1).toUpperCase())}</div><div class="player-card-main"><b>${escapeHtml(p.name)} ${p.id===state.selectedId?'<span class="qty-badge">ACTIVE</span>':""}</b><small>${money(p.money)} · ${p.stores.length} stores · ${totalInventory(p)} items</small></div><div class="player-card-actions"><button class="small-button" data-select-player="${escapeHtml(p.id)}">Select</button><button class="small-button danger-small" data-delete-player="${escapeHtml(p.id)}" title="Delete player">✕</button></div></div>`).join("") : `<div class="empty-state"><div class="empty-icon">♙</div>No players yet. Create a player to begin.</div>`;
    const p = activePlayer();
    $("selectedPlayerDetails").innerHTML = p ? `<div class="detail-grid"><div class="detail-tile"><span>Balance</span><b>${money(p.money)}</b></div><div class="detail-tile"><span>Stores</span><b>${p.stores.length}</b></div><div class="detail-tile"><span>Items</span><b>${totalInventory(p)}</b></div><div class="detail-tile"><span>Customers today</span><b>${eventCustomerCount(p).toLocaleString()}</b></div><div class="detail-tile"><span>Reputation</span><b>${p.reputation}/100</b></div><div class="detail-tile"><span>Level</span><b>${p.level}</b></div></div>` : `<div class="empty-state">Select or create a player to see details.</div>`;
  }
  function renderStores() {
    const p = activePlayer();
    $("storeCount").textContent = p?.stores.length||0;
    $("storeCustomers").textContent = p ? eventCustomerCount(p).toLocaleString() : "0";
    $("storeReputation").textContent = p?.reputation??0;
    $("storeLevel").textContent = p?.level||1;
    $("storesList").innerHTML = p?.stores.length ? `<div class="table-wrap"><table><thead><tr><th>Store</th><th>Opened</th><th>Status</th></tr></thead><tbody>${p.stores.map(s=>`<tr><td><div class="item-name"><span class="item-emoji">🏬</span><b>${escapeHtml(s.name)}</b></div></td><td>${new Date(s.createdAt||now()).toLocaleDateString()}</td><td><span class="status-badge">Open</span></td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state">No stores yet. Use “Add Store” to create one for this player.</div>`;
  }
  function renderShop() {
    const category = $("shopCategory").value || "all";
    const query = $("shopSearch").value.trim().toLowerCase();
    const items = CATALOG.filter(item=>(category==="all"||item.category===category)&&(`${item.name} ${item.category} ${item.description}`.toLowerCase().includes(query)));
    $("shopEventNotice").innerHTML = isActiveEvent("furnitureDiscount") ? `<div class="event-banner shop-notice">🛋️ Furniture Discounts active! All furniture prices are 25% off.</div>` : "";
    $("shopGrid").innerHTML = items.map(item=>{
      const price = effectivePrice(item);
      const discount = price < item.price;
      return `<article class="product-card"><div class="product-art"><span class="category-pill">${escapeHtml(item.category)}</span>${item.emoji}</div><div class="product-info"><h4>${escapeHtml(item.name)}</h4><p>${escapeHtml(item.description)}</p><div class="product-bottom"><div class="product-price">${money(price)}${discount?`<span class="old-price">${money(item.price)}</span>`:""}</div><button class="primary" data-buy-item="${item.id}" ${!activePlayer()||viewOnlyMode||activePlayer().money<price?"disabled":""}>Buy</button></div></div></article>`;
    }).join("") || `<div class="empty-state">No items match your search.</div>`;
  }
  function renderInventory() {
    const p = activePlayer();
    const rows = p ? CATALOG.filter(item=>(Number(p.inventory[item.id])||0)>0) : [];
    $("inventoryValue").textContent = money(rows.reduce((sum,item)=>sum+item.price*(Number(p.inventory[item.id])||0),0));
    $("inventoryList").innerHTML = rows.length ? `<div class="table-wrap"><table><thead><tr><th>Item</th><th>Quantity</th><th>Original price</th><th>Sell price</th><th>Action</th></tr></thead><tbody>${rows.map(item=>{const qty=Number(p.inventory[item.id])||0;const sell=Math.floor(item.price*.5);return `<tr><td><div class="item-name"><span class="item-emoji">${item.emoji}</span><div><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.category)}</small></div></div></td><td><span class="qty-badge">×${qty}</span></td><td>${money(item.price)}</td><td class="green-text">${money(sell)}</td><td><button class="small-button" data-sell-item="${item.id}" ${viewOnlyMode?"disabled":""}>Sell 1</button> <button class="small-button" data-sell-all="${item.id}" ${viewOnlyMode?"disabled":""}>Sell all</button></td></tr>`;}).join("")}</tbody></table></div>` : `<div class="empty-state"><div class="empty-icon">📦</div>Your inventory is empty.<br>Visit the Furniture Shop to buy your first item.</div>`;
  }
  function buyItem(id) {
    if (!canEdit()) return;
    const p = activePlayer(), item = itemById(id);
    if (!p||!item) return;
    const price = effectivePrice(item);
    if (p.money < price) return toast("Not enough money to buy this item.","error");
    p.money -= price; p.inventory[id] = (Number(p.inventory[id])||0)+1;
    updateQuestProgress(p,"buy",1); updateQuestProgress(p,"spend",price);
    logActivity(`${p.name} bought ${item.name} for ${money(price)}.`);
    saveState(); renderAll(); toast(`${item.name} added to inventory.`);
  }
  function sellItem(id, all = false) {
    if (!canEdit()) return;
    const p = activePlayer(), item = itemById(id);
    if (!p||!item) return;
    const qty = Number(p.inventory[id])||0;
    if (qty < 1) return toast("You don't own this item.","error");
    const count = all ? qty : 1;
    const payout = Math.floor(item.price*.5)*count;
    p.inventory[id] = qty-count;
    if (p.inventory[id] <= 0) delete p.inventory[id];
    p.money += payout; updateQuestProgress(p,"sell",count);
    logActivity(`${p.name} sold ${count} × ${item.name} for ${money(payout)}.`);
    saveState(); renderAll(); toast(`Sold ${count} item${count>1?"s":""} for ${money(payout)}.`);
  }

  function renderRestock() {
    const select = $("restockItem");
    select.innerHTML = CATALOG.map(item=>`<option value="${item.id}">${item.emoji} ${escapeHtml(item.name)} — ${money(item.price)} each</option>`).join("");
    $("restockList").innerHTML = state.orders.length ? `<div class="table-wrap"><table><thead><tr><th>Order</th><th>Player</th><th>Item</th><th>Quantity</th><th>Total</th><th>Status</th><th>Action</th></tr></thead><tbody>${state.orders.slice().reverse().map(o=>{const item=itemById(o.itemId);return `<tr><td>#${o.id}</td><td>${escapeHtml(state.players.find(p=>p.id===o.playerId)?.name||"Deleted player")}</td><td>${item?item.emoji+" "+escapeHtml(item.name):"Unknown item"}</td><td>${o.quantity}</td><td>${money(o.total)}</td><td><span class="status-badge ${o.status==="Pending"?"pending":""}">${escapeHtml(o.status)}</span></td><td>${o.status==="Pending"?`<button class="small-button" data-fulfill-order="${o.id}" ${viewOnlyMode?"disabled":""}>Fulfill</button>`:"—"}</td></tr>`;}).join("")}</tbody></table></div>` : `<div class="empty-state">No restock orders yet.</div>`;
  }
  function placeRestockOrder(itemId, quantity) {
    if (!canEdit()) return;
    const p = activePlayer(), item = itemById(itemId);
    quantity = Math.floor(Number(quantity));
    if (!p||!item||!Number.isFinite(quantity)||quantity<1||quantity>100) return toast("Choose an item and quantity from 1 to 100.","error");
    const total = item.price*quantity;
    if (p.money < total) return toast(`You need ${money(total)} for this order.`,"error");
    p.money -= total;
    const order = {id:state.nextOrderId++,playerId:p.id,itemId:item.id,quantity,total,status:"Pending",createdAt:now()};
    state.orders.push(order); updateQuestProgress(p,"restock",1);
    logActivity(`${p.name} placed restock order #${order.id}.`);
    saveState(); renderAll(); toast(`Restock order #${order.id} placed.`);
  }
  function fulfillOrder(id) {
    if (!canEdit()) return;
    const order = state.orders.find(o=>Number(o.id)===Number(id));
    if (!order||order.status!=="Pending") return;
    const p = state.players.find(x=>x.id===order.playerId);
    if (!p) return toast("The player for this order no longer exists.","error");
    p.inventory[order.itemId] = (Number(p.inventory[order.itemId])||0)+order.quantity;
    order.status = "Fulfilled"; order.fulfilledAt=now();
    logActivity(`Restock order #${order.id} fulfilled for ${p.name}.`);
    saveState(); renderAll(); toast("Restock order fulfilled and items added to inventory.");
  }

  function renderQuests() {
    const p = activePlayer();
    $("questDate").textContent = new Date().toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric",year:"numeric"});
    if (!p) {
      $("questsList").innerHTML = `<div class="empty-state">Create a player to receive daily quests.</div>`;
      $("questsCompleted").textContent="0 / 3"; $("questsClaimed").textContent="$0"; return;
    }
    ensureDailyQuests(p);
    const quests = p.dailyQuests.quests;
    $("questsCompleted").textContent = `${quests.filter(q=>q.claimed).length} / ${quests.length}`;
    $("questsClaimed").textContent = money(p.dailyQuests.claimedRewards||0);
    $("questsList").innerHTML = quests.map(q=>{
      const complete = q.progress>=q.target;
      const pct = Math.min(100,Math.floor(q.progress/q.target*100));
      const reward = q.reward*(isActiveEvent("doubleCoins")?2:1);
      return `<article class="quest-card"><div class="quest-card-top"><div class="quest-icon">${q.emoji}</div><div><h4>${escapeHtml(q.title)}</h4><p>${escapeHtml(q.description)}</p></div></div><div class="quest-reward">🎁 Reward: ${money(reward)}</div><div class="quest-progress"><div class="quest-progress-fill" style="width:${pct}%"></div></div><div class="quest-progress-label"><span>Progress</span><span>${Math.min(q.progress,q.target)} / ${q.target}</span></div>${q.claimed?`<button class="secondary" disabled>✓ Reward Claimed</button>`:complete?`<button class="primary" data-claim-quest="${escapeHtml(q.id)}" ${viewOnlyMode?"disabled":""}>Claim Reward</button>`:`<button class="secondary" disabled>In Progress</button>`}</article>`;
    }).join("");
  }
  function claimQuest(id) {
    if (!canEdit()) return;
    const p = activePlayer(); if (!p) return;
    ensureDailyQuests(p);
    const q = p.dailyQuests.quests.find(x=>x.id===id);
    if (!q||q.claimed||q.progress<q.target) return toast("This quest is not ready to claim.","error");
    const reward = q.reward*(isActiveEvent("doubleCoins")?2:1);
    q.claimed = true; p.money += reward; p.dailyQuests.claimedRewards = (p.dailyQuests.claimedRewards||0)+reward;
    logActivity(`${p.name} claimed "${q.title}" for ${money(reward)}.`);
    saveState(); renderAll(); toast(`Quest reward claimed: ${money(reward)}!`);
  }

  function timeLeft(end) {
    const ms = Math.max(0,Number(end)-now());
    const minutes = Math.ceil(ms/60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes/60), mins = minutes%60;
    if (hours < 24) return `${hours}h ${mins}m`;
    return `${Math.floor(hours/24)}d ${hours%24}h`;
  }
  function renderEvents() {
    expireEvents();
    const events = activeEvents();
    $("eventsList").innerHTML = events.length ? events.map(e=>`<article class="event-card"><div class="event-card-top"><div class="event-icon">${EVENT_INFO[e.type]?.emoji||"✦"}</div><div><h4>${escapeHtml(EVENT_INFO[e.type]?.name||e.type)}</h4><p>${escapeHtml(EVENT_INFO[e.type]?.description||"A timed event is active.")}</p></div></div><div class="event-status">● ACTIVE</div><div class="event-time">Time remaining: ${timeLeft(e.endsAt)}</div></article>`).join("") : `<div class="empty-state"><div class="empty-icon">🎉</div>No active events right now.<br>Check back later or ask the admin to start one.</div>`;
    $("adminEventStatus").textContent = events.length ? events.map(e=>`${EVENT_INFO[e.type]?.name||e.type}: ${timeLeft(e.endsAt)} left`).join(" · ") : "No active events.";
    $("dashboardEvents").innerHTML = events.length ? events.map(e=>`<div class="compact-row"><div class="compact-icon">${EVENT_INFO[e.type]?.emoji||"✦"}</div><div><b>${escapeHtml(EVENT_INFO[e.type]?.name||e.type)}</b><small>${timeLeft(e.endsAt)} remaining</small></div></div>`).join("") : `<div class="empty-inline">No active events.</div>`;
    $("statEvents").textContent = events.length;
  }
  function startEvent(type, durationMinutes) {
    if (!canEdit()) return;
    if (!EVENT_INFO[type]) return toast("Choose a valid event.","error");
    durationMinutes = Math.max(1,Number(durationMinutes)||15);
    state.events = state.events.filter(e=>e.type!==type && e.endsAt>now());
    state.events.push({id:uid(),type,startedAt:now(),endsAt:now()+durationMinutes*60000});
    logActivity(`Started ${EVENT_INFO[type].name} for ${durationMinutes} minutes.`);
    saveState(); renderAll(); toast(`${EVENT_INFO[type].name} started.`);
  }
  function endEvents() {
    if (!canEdit()) return;
    if (!state.events.length) return toast("There are no active events.","error");
    state.events=[]; logActivity("Admin ended all active events."); saveState(); renderAll(); toast("All events ended.");
  }
    function renderDashboard() {
    $("dashPlayers").textContent = state.players.length;
    $("dashMoney").textContent = money(totalMoney());
    $("dashItems").textContent = totalItems();
    $("dashOrders").textContent = state.orders.length;
    $("dashboardPlayerTable").innerHTML = state.players.length ? `<div class="table-wrap"><table><thead><tr><th>Player</th><th>Balance</th><th>Stores</th><th>Items</th><th>Level</th></tr></thead><tbody>${state.players.map(p=>`<tr><td>${escapeHtml(p.name)}</td><td>${money(p.money)}</td><td>${p.stores.length}</td><td>${totalInventory(p)}</td><td>${p.level}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-inline">No players saved.</div>`;
    const select = $("dashboardPlayerSelect"), old = select.value;
    select.innerHTML = state.players.length ? state.players.map(p=>`<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}</option>`).join("") : `<option value="">No players</option>`;
    if (state.players.some(p=>p.id===old)) select.value=old;
    renderDashboardInventory();
  }
  function renderDashboardInventory() {
    const p = state.players.find(x=>x.id===$("dashboardPlayerSelect").value);
    if (!p) { $("dashboardInventory").innerHTML=`<div class="empty-inline">No player selected.</div>`; return; }
    const rows = CATALOG.filter(item=>(Number(p.inventory[item.id])||0)>0);
    $("dashboardInventory").innerHTML = rows.length ? `<div class="table-wrap"><table><thead><tr><th>Item</th><th>Category</th><th>Quantity</th><th>Sell value</th></tr></thead><tbody>${rows.map(item=>`<tr><td>${item.emoji} ${escapeHtml(item.name)}</td><td>${escapeHtml(item.category)}</td><td>${p.inventory[item.id]}</td><td>${money(Math.floor(item.price*.5)*(Number(p.inventory[item.id])||0))}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-inline">This player's inventory is empty.</div>`;
  }

  function renderAdminForms() {
    const p=activePlayer();
    $("adminCustomers").value=p?.customersToday||0;
    $("adminReputation").value=p?.reputation??50;
    $("adminLevel").value=p?.level||1;
  }
  function adjustMoney(amount, action) {
    if (!canEdit()) return;
    const p=activePlayer(); if (!p) return toast("Create a player first.","error");
    amount=Math.floor(Number(amount));
    if (!Number.isFinite(amount)||amount<1) return toast("Enter a valid amount.","error");
    if (action==="remove"&&p.money<amount) return toast("The player doesn't have that much money.","error");
    p.money += action==="remove" ? -amount : amount;
    logActivity(`${action==="remove"?"Removed":"Added"} ${money(amount)} ${action==="remove"?"from":"to"} ${p.name}.`);
    saveState(); renderAll(); toast("Money updated.");
  }
  function updateStats(customers,reputation,level) {
    if (!canEdit()) return;
    const p=activePlayer(); if (!p) return toast("Create a player first.","error");
    p.customersToday=Math.max(0,Math.floor(Number(customers)||0));
    p.reputation=Math.max(0,Math.min(100,Math.floor(Number(reputation)||0)));
    p.level=Math.max(1,Math.floor(Number(level)||1));
    logActivity(`Updated statistics for ${p.name}.`); saveState(); renderAll(); toast("Player statistics saved.");
  }

  function renderAll() {
    expireEvents();
    state.players.forEach(ensureDailyQuests);
    renderHeader(); renderOverview(); renderPlayers(); renderStores(); renderShop(); renderInventory(); renderRestock(); renderQuests(); renderEvents(); renderDashboard(); renderAdminForms();
  }
  function exportData() {
    if (!canEdit()) return;
    const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob), a=document.createElement("a");
    a.href=url; a.download=`store-empire-save-${localDateKey()}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    toast("Save exported.");
  }
  function importData(file) {
    if (!canEdit()) return;
    if (!file) return;
    const reader=new FileReader();
    reader.onload=()=>{
      try {
        const parsed=JSON.parse(String(reader.result));
        if (!parsed||!Array.isArray(parsed.players)) throw new Error("Invalid save file");
        if (!confirm("Import this save? It will replace the current browser save.")) return;
        state={...defaultState(),...parsed};
        state.players=parsed.players.map(normalizePlayer);
        state.events=Array.isArray(parsed.events)?parsed.events:[];
        state.orders=Array.isArray(parsed.orders)?parsed.orders:[];
        state.activity=Array.isArray(parsed.activity)?parsed.activity:[];
        state.selectedId=state.players.some(p=>p.id===parsed.selectedId)?parsed.selectedId:(state.players[0]?.id||null);
        state.nextOrderId=Math.max(1,Number(parsed.nextOrderId)||1);
        state.players.forEach(ensureDailyQuests); saveState(); renderAll(); toast("Save imported successfully.");
      } catch (error) { toast("That file is not a valid Store Empire save.","error"); }
      $("importFile").value="";
    };
    reader.onerror=()=>toast("Could not read that file.","error");
    reader.readAsText(file);
  }
  function resetGame() {
    if (!canEdit()) return;
    if (!confirm("Reset Store Empire? This deletes the saved game in this browser. Export a backup first if needed.")) return;
    localStorage.removeItem(SAVE_KEY); localStorage.removeItem(OLD_SAVE_KEY);
    state=defaultState();
    const p=normalizePlayer({id:uid(),name:"My First Store",money:2500,stores:[{id:uid(),name:"Starter Store",createdAt:now()}],customersToday:100,reputation:50,level:1,inventory:{}});
    state.players.push(p);state.selectedId=p.id;ensureDailyQuests(p);logActivity("Game reset. Welcome back!");saveState();renderAll();showTab("overview");toast("Game reset.");
  }

  function initializeControls() {
    document.querySelectorAll(".nav[data-tab]").forEach(button=>button.addEventListener("click",()=>showTab(button.dataset.tab)));
    document.querySelectorAll("[data-goto]").forEach(button=>button.addEventListener("click",()=>showTab(button.dataset.goto)));
    $("activePlayerSelect").addEventListener("change",e=>selectPlayer(e.target.value));
    $("viewModeButton").addEventListener("click",()=>{
      viewOnlyMode=!viewOnlyMode;
      renderAll();
      toast(viewOnlyMode?"View-only mode enabled. Editing controls are disabled.":"View-only mode disabled.");
    });
    $("createPlayerButton").addEventListener("click",()=>{
      if (!canEdit()) return;
      $("newPlayerName").value=""; $("startingMoney").value="1000"; $("playerDialog").showModal(); $("newPlayerName").focus();
    });
    $("closePlayerDialog").addEventListener("click",()=>$("playerDialog").close());
    $("cancelPlayerButton").addEventListener("click",()=>$("playerDialog").close());
    $("newPlayerForm").addEventListener("submit",e=>{e.preventDefault();if(!canEdit())return;const name=$("newPlayerName").value;const cash=$("startingMoney").value;$("playerDialog").close();createPlayer(name,cash);});
    $("addStoreButton").addEventListener("click",addStore);
    $("shopSearch").addEventListener("input",renderShop);
    $("shopCategory").addEventListener("change",renderShop);
    $("restockForm").addEventListener("submit",e=>{e.preventDefault();placeRestockOrder($("restockItem").value,$("restockQuantity").value);});
    $("moneyForm").addEventListener("submit",e=>{e.preventDefault();adjustMoney($("moneyAmount").value,$("moneyAction").value);});
    $("statsForm").addEventListener("submit",e=>{e.preventDefault();updateStats($("adminCustomers").value,$("adminReputation").value,$("adminLevel").value);});
    $("eventForm").addEventListener("submit",e=>{e.preventDefault();startEvent($("eventType").value,$("eventDuration").value);});
    $("endEventButton").addEventListener("click",endEvents);
    $("exportButton").addEventListener("click",exportData);
    $("importFile").addEventListener("change",e=>importData(e.target.files?.[0]));
    $("resetButton").addEventListener("click",resetGame);
    $("dashboardPlayerSelect").addEventListener("change",renderDashboardInventory);
    document.addEventListener("click",e=>{
      const target=e.target.closest("button"); if(!target)return;
      if(target.dataset.selectPlayer) selectPlayer(target.dataset.selectPlayer);
      if(target.dataset.deletePlayer) removePlayer(target.dataset.deletePlayer);
      if(target.dataset.buyItem) buyItem(target.dataset.buyItem);
      if(target.dataset.sellItem) sellItem(target.dataset.sellItem,false);
      if(target.dataset.sellAll) sellItem(target.dataset.sellAll,true);
      if(target.dataset.fulfillOrder) fulfillOrder(target.dataset.fulfillOrder);
      if(target.dataset.claimQuest) claimQuest(target.dataset.claimQuest);
    });
  }
  function initializeCategorySelect() {
    const categories=[...new Set(CATALOG.map(item=>item.category))].sort();
    $("shopCategory").innerHTML='<option value="all">All categories</option>'+categories.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  }

  loadState();
  initializeCategorySelect();
  initializeControls();
  renderAll();
  showTab("overview");
  window.setInterval(()=>{
    const before=activeEvents().map(e=>e.id).join(",");
    expireEvents();
    const after=activeEvents().map(e=>e.id).join(",");
    if(before!==after) renderAll();
    else if(activeEvents().length) { renderEvents(); renderOverview(); renderStores(); }
  },30000);
})();