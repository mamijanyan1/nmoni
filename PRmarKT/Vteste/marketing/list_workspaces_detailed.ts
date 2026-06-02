import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function listWorkspaces() {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/workspaces?key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.documents) {
      console.log('Found documents in workspaces:');
      for (const doc of data.documents) {
        const id = doc.name.split('/').pop();
        console.log(`- ${id}`);
        if (doc.fields && doc.fields.stateJson && doc.fields.stateJson.stringValue) {
            const stateObj = JSON.parse(doc.fields.stateJson.stringValue);
            const taskTitles = stateObj.tasks ? stateObj.tasks.map((t: any) => t.title) : [];
            console.log(`  Tasks:`, taskTitles);
        }
      }
    } else {
      console.log('No documents found in workspaces collection.');
    }
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

listWorkspaces();
