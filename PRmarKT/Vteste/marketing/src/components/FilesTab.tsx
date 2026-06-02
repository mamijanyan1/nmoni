import React, { useState } from 'react';
import { Task, TeamMember } from '../types';

interface FilesTabProps {
  tasks: Task[];
  teamMembers: TeamMember[];
}

export default function FilesTab({ tasks, teamMembers }: FilesTabProps) {
  const [memberFilter, setMemberFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  const allFiles: any[] = [];
  if (tasks && Array.isArray(tasks)) {
    tasks.forEach(task => {
      if (task && task.attachedFiles && Array.isArray(task.attachedFiles)) {
        task.attachedFiles.forEach(file => {
          allFiles.push({
            ...file,
            taskId: task.id,
            taskTitle: task.title,
            ownerId: 'manager',
            createdAt: task.createdAt
          });
        });
      }

      if (task && task.completions && typeof task.completions === 'object') {
        Object.entries(task.completions).forEach(([memberId, completion]) => {
          if (completion && completion.completedFile) {
            allFiles.push({
              ...completion.completedFile,
              taskId: task.id,
              taskTitle: task.title,
              ownerId: memberId,
              createdAt: completion.completedAt || task.createdAt
            });
          }
        });
      }
    });
  }

  const filteredFiles = allFiles.filter(file => {
    const matchesMember = memberFilter === 'all' || file.ownerId === memberFilter;
    const matchesDate = !dateFilter || file.createdAt.startsWith(dateFilter);
    return matchesMember && matchesDate;
  });

  return (
    <div className="space-y-4 font-sans">
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
        <select
          value={memberFilter}
          onChange={e => setMemberFilter(e.target.value)}
          className="text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden"
        >
          <option value="all">All Team Members</option>
          {teamMembers.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden"
        />
      </div>

      <div className="grid gap-2">
        {filteredFiles.map((file, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white border border-zinc-100 rounded-xl hover:border-zinc-200 transition-all shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="text-xl">📎</div>
              <div>
                <p className="text-xs font-bold text-zinc-900">{file.name}</p>
                <div className="flex gap-4">
                  <p className="text-[10px] text-zinc-400">Task: {file.taskTitle}</p>
                  <p className="text-[10px] text-zinc-400">
                    Sender: {file.ownerId === 'manager' ? 'Manager' : (teamMembers.find(m => m.id === file.ownerId)?.name || 'Unknown')}
                  </p>
                </div>
              </div>
            </div>
            <button
               className="text-[10px] font-bold text-zinc-600 hover:text-zinc-950 cursor-pointer bg-zinc-50 hover:bg-zinc-150 border border-zinc-200/60 px-2.5 py-1 rounded-lg transition"
               onClick={() => {
                 if (file.dataUrl && file.dataUrl !== '#') {
                   const link = document.createElement('a');
                   link.href = file.dataUrl;
                   link.setAttribute('download', file.name);
                   document.body.appendChild(link);
                   link.click();
                   document.body.removeChild(link);
                 } else {
                   const blob = new Blob([`Redstore SMM Asset Reference:\nFile Name: ${file.name}\nTask Origin: ${file.taskTitle}\nSender: ${file.ownerId}`], { type: 'text/plain' });
                   const url = URL.createObjectURL(blob);
                   const link = document.createElement('a');
                   link.href = url;
                   link.setAttribute('download', file.name.includes('.') ? file.name : `${file.name}.txt`);
                   document.body.appendChild(link);
                   link.click();
                   document.body.removeChild(link);
                   URL.revokeObjectURL(url);
                 }
               }}
            >
              Download
            </button>
          </div>
        ))}
        {filteredFiles.length === 0 && (
          <p className="text-sm text-zinc-400 text-center py-10">No files found</p>
        )}
      </div>
    </div>
  );
}
