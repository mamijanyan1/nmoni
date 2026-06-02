import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function check(id: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/${id}?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      console.log(`[FOUND] ROOT DOCUMENT: ${id}`);
    }
  } catch (e) {}
}

async function run() {
  const ids = ['tg-state', 'state', 'production', 'workspace', 'main'];
  for (const id of ids) {
    await check(id);
  }
}
run();
