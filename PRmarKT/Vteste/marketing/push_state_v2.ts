import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;
const WORKSPACE_DOC_ID = "smm_workspace_main";

async function push() {
  const state = JSON.parse(fs.readFileSync('tg-state.json', 'utf8'));
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/workspaces/${WORKSPACE_DOC_ID}?key=${apiKey}&updateMask.fieldPaths=stateJson`;

  const payload = {
    fields: {
      stateJson: {
        stringValue: JSON.stringify(state)
      }
    }
  };

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('Push Result:', JSON.stringify(data, null, 2));
  } catch (e: any) {
    console.error('Push Error:', e.message);
  }
}

push();
