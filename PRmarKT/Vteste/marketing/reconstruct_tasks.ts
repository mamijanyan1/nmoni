import { GoogleGenAI, Type } from "@google/genai";
import fs from 'fs';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("API Key missing");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const team = [
  { id: "user_1779713984314", name: "Moni Antonyan", username: "@moni_antonyan" },
  { id: "user_1779713992112", name: "Alll", username: "" },
  { id: "user_1779715341323", name: "Mariam", username: "@Mariam" },
  { id: "user_1779715381041", name: "Anushik", username: "@Anushik" },
  { id: "user_1779884851526", name: "Gayush", username: "@Gayush" }
];

async function reconstruct() {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "Reconstruct 5 tasks for a Marketing team whose names are: 'Normal jam', 'Նկարել 3 ոչի', 'Նկարել Սերվիսի սթորիները', 'Նկարել Մարկետինգիները', 'Նկարել 3 հոլ'. Based on common SMM workflows. Assign each task to a team member (Moni, Mariam, Anushik or Gayush). Set realistic deadlines for the next 3 days. Armenian/English output.",
        config: {
            systemInstruction: `Return a JSON array of Task objects.
            Fields:
            - id: "task-rec-" + timestamp
            - title: string
            - description: Detailed string
            - assignedTo: [memberId]
            - deadline: ISO string
            - reminderType: "classic"
            - createdAt: past ISO
            - attachedFiles: []
            - completions: { assignmentId: { completed: false, status: "pending" } }
            
            Team: ${JSON.stringify(team)}
            `,
            responseMimeType: "application/json"
        }
    });

    console.log(response.text);
}

reconstruct();
