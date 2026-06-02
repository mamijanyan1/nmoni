import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function fetchFull() {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/workspaces/smm_workspace_main?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      const data = await res.json();
      const stateJson = data.fields.stateJson.stringValue;
      console.log('--- RAW STATE ---');
      console.log(stateJson);
    }
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

fetchFull();
