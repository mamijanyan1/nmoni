import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

const ids = [
  'smm_workspace_main',
  'smm_workspace_v1',
  'smm_workspace_v2',
  'smm_workspace_v3',
  'smm_workspace_final',
  'smm_workspace_real',
  'smm_workspace_prod',
  'smm_workspace_production',
  'primary_workspace',
  'main_workspace',
  'nane_workspace',
  'mamijanyan_workspace',
  'workspace_1',
  'workspace_2',
  'workspace_3'
];

async function check(id: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/workspaces/${id}?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      const data = await res.json();
      const stateObj = JSON.parse(data.fields.stateJson.stringValue);
      console.log(`[FOUND] ${id} - Tasks:`, stateObj.tasks.map((t: any) => t.title));
    }
  } catch (e) {}
}

async function run() {
  for (const id of ids) {
    await check(id);
  }
}
run();
