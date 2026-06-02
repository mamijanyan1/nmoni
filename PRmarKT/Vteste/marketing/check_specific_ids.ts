import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function checkDoc(id: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/workspaces/${id}?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      const data = await res.json();
      console.log(`[FOUND] ${id}:`, data.fields.stateJson.stringValue.substring(0, 500));
    }
  } catch (e: any) {}
}

async function run() {
  await checkDoc('default');
  await checkDoc('production');
  await checkDoc('real_state');
  await checkDoc('tg-state');
}
run();
