import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey } = firebaseConfig;

async function listDatabases() {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases?key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Databases:', JSON.stringify(data, null, 2));
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

listDatabases();
