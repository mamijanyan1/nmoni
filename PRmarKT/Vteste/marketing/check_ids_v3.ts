import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function check(id: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/workspaces/${id}?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      console.log(`[FOUND] ${id}`);
    }
  } catch (e) {}
}

async function run() {
  const ids = ['workspace_124730c1e64b1eeec1344d', 'workspace_779564695736', 'workspace_subtle-music-zwh20', 'workspace_mamijanyan77'];
  for (const id of ids) {
    await check(id);
  }
}
run();
