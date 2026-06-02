import React, { useState } from 'react';
import { MessageSquare, RefreshCw, Send, CheckCircle2, AlertTriangle, Users, Bot } from 'lucide-react';
import Markdown from 'react-markdown';

export default function LeadsTab({ showToast }: { showToast: (msg: string, type: 'success' | 'error' | 'info') => void }) {
  // Check for real connection (simulated for now, would check tokens in real app)
  const isConnected = false; 

  const [messages] = useState([
    { id: 1, platform: 'Instagram', user: '@anahittt3', content: "Hi! How much is the iPhone 15 Pro Max 256GB? And do you have 0% installments?", time: '2m ago', state: 'urgent', type: 'dm', aiAnalysis: "High purchase intent. Asking for price and credit options." },
    { id: 2, platform: 'Telegram', user: 'Sergey Grigoryan', content: "Does the Marshall Kilburn II connect to multiple devices at once?", time: '15m ago', state: 'unread', type: 'comment', aiAnalysis: "Technical question. Moderate purchase intent." },
    { id: 3, platform: 'Facebook', user: 'Mariam', content: "Your delivery took 5 days instead of 2. Very unhappy.", time: '1h ago', state: 'urgent', type: 'review', aiAnalysis: "Negative sentiment. Requires immediate apologetic resolution." },
    { id: 4, platform: 'Google My Business', user: 'David H.', content: "Best electronics store in Yerevan! Genuine Apple products.", time: '3h ago', state: 'handled', type: 'review', aiAnalysis: "Positive sentiment. Handled with thanks." }
  ]);
  
  const [selectedMsg, setSelectedMsg] = useState(messages[0]);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [aiDraft, setAiDraft] = useState("");
  const [naneStats] = useState({
     sla: "98.5%",
     avgResponse: "1m 12s",
     handledToday: 142
  });

  const handleGenerateReply = () => {
    if (!isConnected) {
       showToast("Divine authorization required to reply to real leads.", "error");
       return;
    }
    setIsGeneratingReply(true);
    setAiDraft("");
    
    // Simulate generation
    setTimeout(() => {
        if (selectedMsg.id === 1) {
            setAiDraft("Բարև Ձեզ, Անահիտ! 👋 iPhone 15 Pro Max 256GB այս պահին արժե 485,000 AMD: Այո, ունենք 0% ապառիկի տրամադրում տեղում կամ առցանց: Մոտենաք մեր մասնաճյուղ, թե՞ առաքում ձևակերպենք:");
        } else if (selectedMsg.id === 2) {
            setAiDraft("Hi Sergey! Yes, the Marshall Kilburn II features multi-host functionality so you can easily connect and switch between two Bluetooth devices. Want to drop by and test it out?");
        } else if (selectedMsg.id === 3) {
            setAiDraft("Dear Mariam, we sincerely apologize for the delay. This is not our standard. Please send us your order number via DM so we can investigate and offer a complimentary gift as an apology.");
        }
        setIsGeneratingReply(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-black text-emerald-900 tracking-tight">Community & Leads Inbox</h2>
          </div>
          <p className="text-sm font-medium text-emerald-800">
            Unified tracking of all incoming direct messages, post comments, and active conversations. Goddess Nane AI monitors interactions securely.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
             <span className={`bg-white border px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-xs ${isConnected ? 'border-emerald-200 text-zinc-600' : 'border-zinc-200 text-zinc-400 opacity-60'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-zinc-300'}`}></span> Instagram Sync
             </span>
             <span className={`bg-white border px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-xs ${isConnected ? 'border-emerald-200 text-zinc-600' : 'border-zinc-200 text-zinc-400 opacity-60'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-zinc-300'}`}></span> Telegram Bot
             </span>
             <span className="bg-white border border-emerald-200 px-2.5 py-1 rounded-lg text-[10px] font-bold text-zinc-600 flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Facebook Page
             </span>
          </div>
        </div>
        
        {/* Nane SLA Stats */}
        <div className="bg-white border border-emerald-100 p-4 rounded-xl shadow-xs min-w-[250px] space-y-2">
           <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Bot className="w-3.5 h-3.5 text-indigo-500" /> Goddess Nane SLA</span>
             <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
             </span>
           </div>
           <div className="grid grid-cols-2 gap-2 pt-1">
             <div>
               <p className="text-2xl font-black text-zinc-800">{isConnected ? naneStats.sla : '--%'}</p>
               <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Response SLA</p>
             </div>
             <div>
               <p className="text-2xl font-black text-zinc-800">{isConnected ? naneStats.avgResponse : '--s'}</p>
               <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Avg Time</p>
             </div>
           </div>
        </div>
      </div>
      
      {!isConnected ? (
        <div className="bg-white border border-zinc-200 rounded-3xl p-12 shadow-2xs flex flex-col items-center justify-center text-center space-y-4">
           <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 relative">
              <MessageSquare className="w-8 h-8 text-emerald-300" />
              <div className="absolute top-0 right-0 p-1 bg-amber-500 rounded-full border-2 border-white">
                 <AlertTriangle className="w-3 h-3 text-white" />
              </div>
           </div>
           <div>
              <h3 className="text-lg font-black text-zinc-900 tracking-tight">Divine Login Required</h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-1">
                Real-time community feeds and leads require **Sovereign Authorization**. Access will update automatically on administrative entry.
              </p>
           </div>
           <button className="bg-zinc-900 text-white font-bold text-xs px-8 py-3 rounded-xl hover:bg-zinc-800 transition">Establish Connection</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[550px]">
           {/* Inbox List */}
           <div className="md:col-span-5 bg-white border border-zinc-200 rounded-2xl flex flex-col overflow-hidden shadow-xs">
              <div className="bg-zinc-50 border-b border-zinc-200 p-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> All Inbox</span>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-2">
                 {messages.map(msg => (
                   <div onClick={() => setSelectedMsg(msg)} key={msg.id} className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedMsg.id === msg.id ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' : 'bg-white border-zinc-100 hover:border-indigo-100 hover:bg-zinc-50'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${msg.platform === 'Instagram' ? 'bg-pink-100 text-pink-700' : msg.platform === 'Telegram' ? 'bg-sky-100 text-sky-700' : 'bg-blue-100 text-blue-700'}`}>{msg.platform}</span>
                          <span className="text-[9px] text-zinc-400 font-mono">{msg.time}</span>
                        </div>
                        {msg.state === 'urgent' ? (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                        ) : msg.state === 'unread' ? (
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        ) : (
                           <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        )}
                      </div>
                      <p className="text-[11px] font-black text-zinc-800 mb-1">{msg.user}</p>
                      <p className="text-[10px] font-medium text-zinc-600 line-clamp-2">{msg.content}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* Message View & Reply Area */}
           <div className="md:col-span-7 bg-white border border-zinc-200 rounded-2xl flex flex-col overflow-hidden shadow-xs">
              {selectedMsg ? (
                 <>
                   <div className="p-5 border-b border-zinc-100 bg-zinc-50/50">
                      <div className="flex items-center justify-between mb-4">
                         <h3 className="text-sm font-black text-zinc-900">{selectedMsg.user} <span className="text-zinc-400 text-xs font-normal ml-1">via {selectedMsg.platform}</span></h3>
                         <span className="text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1 bg-zinc-100 px-2 py-1 rounded">Type: {selectedMsg.type}</span>
                      </div>
                      <div className="bg-white p-4 border border-zinc-100 rounded-xl shadow-2xs">
                          <p className="text-xs font-medium text-zinc-800 leading-relaxed">{selectedMsg.content}</p>
                      </div>
                      
                      {/* Goddess Nane Auto-Analysis */}
                      <div className="mt-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start gap-3">
                         <Bot className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                         <div className="space-y-1">
                            <p className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">Nane's Context Analysis</p>
                            <p className="text-[11px] font-medium text-indigo-800/80">{selectedMsg.aiAnalysis}</p>
                         </div>
                      </div>
                   </div>

                   <div className="flex-1 p-5 bg-zinc-50/30 flex flex-col justify-end gap-3">
                      {aiDraft ? (
                        <div className="bg-white border border-emerald-200 border-l-4 border-l-emerald-500 p-4 rounded-xl shadow-sm animate-in slide-in-from-bottom-2">
                          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-2 block">AI Draft Ready</span>
                          <textarea className="w-full text-xs font-medium text-zinc-800 bg-transparent resize-none focus:outline-hidden" rows={4} value={aiDraft} onChange={(e) => setAiDraft(e.target.value)} />
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-2 opacity-50">
                           <MessageSquare className="w-8 h-8 text-zinc-300" />
                           <p className="text-[11px] font-bold text-zinc-500">Awaiting intelligent response action...</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                         <button onClick={handleGenerateReply} disabled={isGeneratingReply || !!aiDraft} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-[11px] py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer">
                            {isGeneratingReply ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                            {isGeneratingReply ? "Nane is typing..." : "Generate AI Reply (Goddess Nane)"}
                         </button>
                         {aiDraft && (
                           <button onClick={() => {setAiDraft(""); showToast("Reply sent & logged!", "success");}} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                               <Send className="w-4 h-4" /> Send Reply
                           </button>
                         )}
                      </div>
                   </div>
                 </>
              ) : (
                 <div className="flex-1 flex items-center justify-center text-zinc-400 text-xs font-bold font-mono">
                   Select a lead or message.
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
