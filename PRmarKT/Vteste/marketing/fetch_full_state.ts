import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function fetchFullState() {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/workspaces/smm_workspace_main?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      const data = await res.json();
      if (data && data.fields && data.fields.stateJson && data.fields.stateJson.stringValue) {
        console.log('--- FULL STATE START ---');
        console.log(data.fields.stateJson.stringValue);
        console.log('--- FULL STATE END ---');
      } else {
        console.log('Document found but no stateJson field.');
      }
    } else {
      console.log('Document not found (Status:', res.status, ')');
    }
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

fetchFullState();
