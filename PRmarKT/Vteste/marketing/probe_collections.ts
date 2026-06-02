import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

const potentialCollections = [
  'tasks',
  'logs',
  'chats',
  'messages',
  'history',
  'backups',
  'botChatLogs',
  'bot',
  'updates'
];

async function checkCollection(col: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/${col}?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      const data = await res.json();
      console.log(`[FOUND COLLECTION] ${col}:`, JSON.stringify(data).substring(0, 1000));
    }
  } catch (e: any) {
    // ignore
  }
}

async function run() {
  console.log('Probing potential collection structures...');
  for (const col of potentialCollections) {
    await checkCollection(col);
  }
  console.log('Probing finished.');
}

run();
