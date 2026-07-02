// storage.js
// Barcha ma'lumotlarni (kalit so'z-javoblar, foydalanuvchilar, statistika) data.json faylida saqlaydi.

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

// Boshlang'ich (bo'sh) tuzilma
const DEFAULT_DATA = {
  autoReplies: [],     // [{ id, keyword, answer, createdAt }]
  pendingKeyword: {},  // adminlar uchun vaqtinchalik holat: { adminId: keyword }
  users: {},           // { userId: { id, username, firstName, firstSeen, lastSeen, messageCount } }
  stats: {
    totalMessages: 0,
    autoRepliedMessages: 0,
    startedAt: new Date().toISOString(),
  },
  admins: [],           // adminlarning Telegram ID ro'yxati
};

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    saveData(DEFAULT_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    // Eski fayllarda yangi maydonlar bo'lmasligi mumkin — birlashtiramiz
    return { ...JSON.parse(JSON.stringify(DEFAULT_DATA)), ...parsed };
  } catch (err) {
    console.error('data.json o\'qishda xatolik, yangi fayl yaratilmoqda:', err.message);
    saveData(DEFAULT_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = { loadData, saveData, DATA_FILE };
