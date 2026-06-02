import fs from 'fs';

const token = "8172614863:AAEi0rWYzg5eiP_R6ps9EEIYNY2WmekABA4";

async function getUpdates() {
  const url = `https://api.telegram.org/bot${token}/getUpdates?offset=-1`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Bot Last Update:', JSON.stringify(data, null, 2));
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

getUpdates();
