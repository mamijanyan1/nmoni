import { TeamMember } from '../types';
import { Shield, Award } from 'lucide-react';

interface MiniAppHeaderProps {
  currentRole: 'manager' | 'member';
  currentUser: TeamMember | null;
  totalTasks: number;
  completedTasksCount: number;
  googleSyncActive?: boolean;
  googleUserEmail?: string | null;
  onGoToStats?: () => void;
}

export default function MiniAppHeader({
  currentRole,
  currentUser,
  totalTasks,
  completedTasksCount,
  googleSyncActive,
  googleUserEmail,
  onGoToStats
}: MiniAppHeaderProps) {
  return (
    <div id="mini-app-header" className="bg-white p-5 rounded-t-3xl border-b border-zinc-100 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-left">
          {currentUser ? (
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs border border-zinc-100 ${currentUser.color}`}>
              {currentUser.avatarCode}
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800 shadow-md flex items-center justify-center">
              <img src="/avatar.png" alt="Head Specialist" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          )}
          
          <div>
            <h2 className="font-bold text-sm text-zinc-900 leading-none font-sans">
              {currentRole === 'manager' ? 'Nane' : `${currentUser?.name}`}
            </h2>
            <div className="flex items-center space-x-1 mt-1">
              <span className="text-[11px] text-zinc-500 font-medium tracking-wide font-sans">
                {currentRole === 'manager' ? '⚡️ Head Specialist [Marketing]' : `${currentUser?.role}`}
              </span>
              {googleSyncActive && (
                <>
                  <span className="mx-1 text-zinc-300">|</span>
                  <button 
                    type="button"
                    onClick={onGoToStats}
                    className="inline-flex items-center space-x-1 bg-emerald-50 border border-emerald-100/80 hover:bg-emerald-100/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-emerald-700 transition cursor-pointer"
                    title={`Connected via Google: ${googleUserEmail || 'Integration active'}`}
                  >
                    <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span>Google Connect ✅</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider mb-0.5">Total Completed</div>
          <div className="text-base font-bold tabular-nums text-zinc-900 flex items-baseline justify-end gap-1 font-mono">
            <span>{completedTasksCount}</span>
            <span className="text-xs text-zinc-450 font-normal">/</span>
            <span className="text-xs text-zinc-450 font-bold">{totalTasks}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
