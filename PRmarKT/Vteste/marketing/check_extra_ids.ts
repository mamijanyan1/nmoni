import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

const extraIds = [
  'mamijanyan77',
  'workspace_mamijanyan77',
  'smm_mamijanyan77',
  'marketing_task_manager',
  'marketing',
  'tasks',
  'tasks_prod',
  'production_v1'
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
        return true;
      }
    }
  } catch (e: any) {}
  return false;
}

async function run() {
  console.log('Checking more potential IDs...');
  for (const id of extraIds) {
    await checkDoc(id);
  }
}

run();
