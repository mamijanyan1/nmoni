import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function runQuery() {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents:runQuery?key=${apiKey}`;
  const query = {
    structuredQuery: {
      from: [{ collectionId: 'workspaces' }],
      limit: 100
    }
  };
  
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(query)
    });
    const data = await res.json();
    console.log('Query Result:', JSON.stringify(data, null, 2));
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

runQuery();
