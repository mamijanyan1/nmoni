import React from 'react';
import { AlertCircle, CheckCircle2, Loader2, Sparkles, X } from 'lucide-react';

interface TaskMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  onConfirm: () => void;
  pendingTasks: any[];
  taskMakerText: string;
  setTaskMakerText: (txt: string) => void;
  isCreatingTask: boolean;
  isAnalyzing: boolean;
  taskMakerError: string;
  setTaskMakerError: (err: string) => void;
  taskMakerSuccessMessage: string;
}

export default function TaskMakerModal({
  isOpen,
  onClose,
  onCreate,
  onConfirm,
  pendingTasks,
  taskMakerText,
  setTaskMakerText,
  isCreatingTask,
  isAnalyzing,
  taskMakerError,
  setTaskMakerError,
  taskMakerSuccessMessage,
}: TaskMakerModalProps) {
  if (!isOpen) return null;

  const hasPreview = pendingTasks && pendingTasks.length > 0;

  return (
    <div id="task-maker-modal" className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg border border-zinc-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-violet-50/50">
          <div className="flex items-center space-x-2 text-violet-700">
            <Sparkles className="w-5 h-5 fill-violet-100 animate-pulse" />
            <h2 className="font-bold text-sm tracking-tight text-violet-900">
              AI Task Extraction & Confirmation
            </h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-left">
          {!hasPreview ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-zinc-50 border border-zinc-200 text-zinc-650 rounded-xl p-4 text-[11px] space-y-2 leading-relaxed">
                <p className="font-semibold text-zinc-800">💡 Step 1: Input Instructions</p>
                <p>
                  Paste your raw text, chat logs, or voice notes. The AI will cross-reference our team database and generate structured SMM tasks.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 font-mono">
                  Instruction Input
                </label>
                <textarea
                  value={taskMakerText}
                  onChange={(e) => {
                    setTaskMakerText(e.target.value);
                    if (taskMakerError) setTaskMakerError('');
                  }}
                  rows={6}
                  disabled={isAnalyzing}
                  placeholder="e.g. 'Moni needs to fix the website banners by Friday. Mariam, please call the client tomorrow morning...'"
                  className="w-full text-xs font-sans text-zinc-800 border border-zinc-200/90 rounded-xl p-4 h-44 focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/85 bg-white transition-all disabled:opacity-60 resize-none font-mono leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-right-4">
               <div className="flex items-center justify-between">
                 <h3 className="text-xs font-black text-zinc-900 uppercase tracking-tighter">Review Parsed Operations ({pendingTasks.length})</h3>
                 <button 
                   onClick={onCreate} 
                   className="text-[10px] font-bold text-violet-600 hover:underline"
                   disabled={isAnalyzing}
                 >
                   Re-analyze
                 </button>
               </div>
               
               <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                 {pendingTasks.map((task, i) => (
                   <div key={i} className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-black text-zinc-800">{task.title}</span>
                        <span className="text-[9px] font-mono font-black text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded uppercase">{task.assignedTo[0] || 'all'}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 italic leading-snug line-clamp-2">"{task.description}"</p>
                      <div className="pt-1 flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                         📅 {new Date(task.deadline).toLocaleString()}
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Error Message */}
          {taskMakerError && (
            <div className="flex items-start space-x-2 bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-3 rounded-xl text-xs shadow-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium">{taskMakerError}</span>
            </div>
          )}

          {/* Success Message */}
          {taskMakerSuccessMessage && (
            <div className="flex items-start space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-3 rounded-xl text-xs shadow-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium">{taskMakerSuccessMessage}</span>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="p-5 border-t border-zinc-100 flex items-center justify-end gap-2 bg-zinc-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isCreatingTask || isAnalyzing}
            className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800 border border-zinc-200 hover:bg-white rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          
          {!hasPreview ? (
            <button
              type="button"
              onClick={onCreate}
              disabled={isAnalyzing || !taskMakerText.trim()}
              className="flex items-center space-x-1.5 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer select-none active:scale-95 disabled:opacity-55 shadow-lg shadow-violet-100 uppercase tracking-widest"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 fill-white/10" />
                  <span>Analyze Text</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isCreatingTask}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer select-none active:scale-95 disabled:opacity-55 shadow-lg shadow-emerald-100 uppercase tracking-widest"
            >
              {isCreatingTask ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deploying Tasks...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm & Save</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
