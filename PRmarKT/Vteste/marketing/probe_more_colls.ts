import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function probe() {
  const colls = ['workspace', 'smm_workspace', 'smm_workspaces', 'smm_state', 'tg_state', 'bot_state', 'workspace_state', 'app_state'];
  for (const coll of colls) {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/${coll}?key=${apiKey}`;
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        console.log(`[FOUND COLLECTION] ${coll}`);
      }
    } catch (e) {}
  }
}

probe();
