import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey } = firebaseConfig;

async function checkDefaultDb() {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/workspaces/smm_workspace_main?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      const data = await res.json();
      console.log('--- DEFAULT DB smm_workspace_main FOUND ---');
      console.log(data.fields.stateJson.stringValue);
    } else {
      console.log('Document not found in (default) database (Status:', res.status, ')');
    }
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

checkDefaultDb();
