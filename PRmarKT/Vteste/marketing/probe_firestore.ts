import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

const potentialIds = [
  'smm_workspace_main',
  'smm_workspace',
  'smm_workspace_prod',
  'smm_workspace_backup',
  'smm',
  'tg_state',
  'tg_state_backup',
  'workspace',
  'workspace_main',
  'default',
  'main',
  'production',
  'prod',
  'state'
];

async function checkDoc(id: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/workspaces/${id}?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      const data = await res.json();
      if (data && data.fields && data.fields.stateJson && data.fields.stateJson.stringValue) {
        const stateObj = JSON.parse(data.fields.stateJson.stringValue);
        const taskTitles = stateObj.tasks ? stateObj.tasks.map((t: any) => t.title) : [];
        console.log(`[FOUND] ${id} - Tasks:`, taskTitles);
        return { id, tasks: stateObj.tasks, doc: stateObj };
      } else {
        console.log(`[FOUND with NO stateJson] ${id}`);
      }
    } else {
      // console.log(`[NOT FOUND] ${id} (${res.status})`);
    }
  } catch (e: any) {
    console.error(`Error checking ${id}:`, e.message);
  }
  return null;
}

async function run() {
  console.log('Scanning potential Firestore workspace document IDs...');
  const results = [];
  for (const id of potentialIds) {
    const res = await checkDoc(id);
    if (res) results.push(res);
  }
  console.log('Scan finished. Total found:', results.length);
}

run();
