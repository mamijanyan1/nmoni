import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function listDocs() {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/workspaces?key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.documents) {
      console.log('Documents in workspaces:');
      data.documents.forEach((doc: any) => {
        console.log(doc.name);
      });
    } else {
      console.log('No documents found in workspaces.');
    }
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

listDocs();
