import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function probe() {
  const collections = ['workspaces', 'tasks', 'users', 'members', 'sessions', 'bot_state'];
  for (const coll of collections) {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/${coll}?key=${apiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.documents) {
        console.log(`[COLLECTION] ${coll} has ${data.documents.length} docs`);
        for (const doc of data.documents) {
          console.log(`  - ${doc.name.split('/').pop()}`);
          // If it's short, log it
          if (coll === 'workspaces') {
             // Already checked smm_workspace_main
          }
        }
      }
    } catch (e) {}
  }
}

probe();
