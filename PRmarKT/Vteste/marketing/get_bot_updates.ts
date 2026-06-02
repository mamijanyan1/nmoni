import fs from 'fs';

const token = "8172614863:AAEi0rWYzg5eiP_R6ps9EEIYNY2WmekABA4";

async function getUpdates() {
  // Try higher offset or just 100
  const url = `https://api.telegram.org/bot${token}/getUpdates?limit=100&allowed_updates=["message","callback_query"]`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Bot Updates:', JSON.stringify(data, null, 2));
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

getUpdates();
