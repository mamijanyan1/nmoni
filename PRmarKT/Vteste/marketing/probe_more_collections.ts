import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

const commonCollections = [
  'tasks',
  'users',
  'messages',
  'state',
  'logs',
  'config',
  'app_state',
  'workspace',
  'members',
  'sm_tasks'
];

async function checkCollection(name: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/${name}?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      const data = await res.json();
      if (data.documents) {
        console.log(`[FOUND COLLECTION] ${name} - ${data.documents.length} docs`);
        for (const doc of data.documents.slice(0, 3)) {
             console.log(`  - Doc: ${doc.name.split('/').pop()}`);
        }
      }
    }
  } catch (e) {}
}

async function run() {
  console.log('Probing collections...');
  for (const c of commonCollections) {
    await checkCollection(c);
  }
}

run();
