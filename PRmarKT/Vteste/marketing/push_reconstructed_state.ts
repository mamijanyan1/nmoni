import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

const state = JSON.parse(fs.readFileSync('tg-state.json', 'utf8'));
const WORKSPACE_DOC_ID = 'smm_workspace_main';

async function pushState() {
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
    if (res.ok) {
      console.log('State pushed successfully to Firestore.');
    } else {
      console.error('Failed to push state:', await res.text());
    }
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

pushState();
