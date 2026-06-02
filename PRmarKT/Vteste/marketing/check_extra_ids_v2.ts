import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function check(id: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/workspaces/${id}?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      const data = await res.json();
      console.log(`[FOUND] ${id}`);
      console.log(data.fields.stateJson.stringValue);
    }
  } catch (e) {}
}

async function run() {
  const ids = ['smm_workspace_main', 'smm_workspace_production', 'smm_workspace_v1', 'smm_workspace_v2', 'smm_workspace_real', 'smm_workspace_final'];
  for (const id of ids) {
    await check(id);
  }
}
run();
