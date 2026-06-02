import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function checkLogs() {
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents/workspaces/smm_workspace_main?key=${apiKey}`;
  try {
    const res = await fetch(url);
    if (res.status === 200) {
      const data = await res.json();
      const stateObj = JSON.parse(data.fields.stateJson.stringValue);
      console.log('--- Chat Logs ---');
      for (const [userId, logs] of Object.entries(stateObj.botChatLogs)) {
        console.log(`User ${userId}:`, logs);
      }
      console.log('--- Tasks ---');
      console.log(JSON.stringify(stateObj.tasks, null, 2));
    }
  } catch (e: any) {}
}

checkLogs();
