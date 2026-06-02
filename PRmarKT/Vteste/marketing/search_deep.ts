import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function searchDeep() {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/workspaces/smm_workspace_main?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      const data = await res.json();
      const stateStr = data.fields.stateJson.stringValue;
      console.log('Includes Maral ID?', stateStr.includes('1448901787'));
      console.log('Includes Maral name?', stateStr.includes('Maral'));
      
      const stateObj = JSON.parse(stateStr);
      console.log('TG Chat IDs:', stateObj.tgChatIds);
    }
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

searchDeep();
