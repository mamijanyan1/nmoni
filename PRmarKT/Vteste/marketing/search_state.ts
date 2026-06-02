import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function fetchAndSearch() {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/workspaces/smm_workspace_main?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      const data = await res.json();
      const stateStr = data.fields.stateJson.stringValue;
      console.log('Search Result for "jam":', stateStr.includes('jam'));
      console.log('Search Result for "Նկարել":', stateStr.includes('Նկարել'));
      
      const stateObj = JSON.parse(stateStr);
      console.log('Tasks found:', stateObj.tasks.map((t: any) => t.title));
    }
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

fetchAndSearch();
