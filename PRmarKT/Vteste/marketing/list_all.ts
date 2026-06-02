import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const { projectId, apiKey, firestoreDatabaseId } = firebaseConfig;

async function listCollections() {
    // There is no direct REST API to list collections in Firestore without knowing parent.
    // But we can try common ones or use the structures found in blueprint.
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents?key=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log('Root Documents:', JSON.stringify(data, null, 2));
    } catch (e: any) {
        console.error('Error:', e.message);
    }
}

listCollections();
