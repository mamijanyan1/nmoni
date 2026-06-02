import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function checkTgState() {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/workspaces/tg-state?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      const data = await res.json();
      console.log('--- tg-state FOUND ---');
      console.log(data.fields.stateJson.stringValue);
    } else {
      console.log('tg-state not found');
    }
  } catch (e: any) {}
}

checkTgState();
