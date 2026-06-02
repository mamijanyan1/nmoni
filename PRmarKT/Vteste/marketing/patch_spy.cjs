const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetSectionStart = `<div className="lg:col-span-8 bg-zinc-50 border border-zinc-200/60 rounded-2xl min-h-[500px] flex flex-col p-1">`;

const startIdx = code.indexOf(targetSectionStart);
if (startIdx === -1) {
    console.error('Start index not found');
    process.exit(1);
}

// Find the end of this div (the end of the spy grid)
const gridEndMarker = `</div>\n                    </div>\n                  </div>\n                </div>\n              )}\n\n              {/* TAB: UNIFIED CREATIVE STUDIO */}`;
const endIdx = code.indexOf(gridEndMarker);

if (endIdx === -1) {
    console.error('End index not found');
    process.exit(1);
}

const replacement = `<div className="lg:col-span-8 bg-zinc-50 border border-zinc-200/60 rounded-2xl min-h-[500px] flex flex-col overflow-hidden shadow-inner">
                        <div className="bg-white border-b border-zinc-200 p-2 flex items-center justify-between">
                          <div className="flex space-x-1">
                            <button onClick={() => setSpyInnerTab('oracle')} className={\`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider \${spyInnerTab === 'oracle' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-500 hover:bg-zinc-100'}\`}>AI Oracle</button>
                            <button onClick={() => setSpyInnerTab('ads')} className={\`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider \${spyInnerTab === 'ads' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-500 hover:bg-zinc-100'}\`}>Ad Library Spy</button>
                            <button onClick={() => setSpyInnerTab('pricing')} className={\`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider \${spyInnerTab === 'pricing' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-500 hover:bg-zinc-100'}\`}>Price Tracker</button>
                            <button onClick={() => setSpyInnerTab('seo')} className={\`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider \${spyInnerTab === 'seo' ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-500 hover:bg-zinc-100'}\`}>SEO & Traffic</button>
                          </div>
                          
                          {spyMarkdown && spyInnerTab === 'oracle' && (
                            <button
                              onClick={() => handleCopyToClipboard(spyMarkdown)}
                              className="text-[9px] bg-zinc-100 hover:bg-zinc-200 px-2 py-1 rounded font-bold text-zinc-600 transition tracking-wider border border-zinc-200/50"
                            >
                              EXPORT REPORT
                            </button>
                          )}
                        </div>
                        
                        <div className="flex-1 p-6 overflow-y-auto no-scrollbar relative min-h-[450px]">
                          {spyInnerTab === 'oracle' && (
                            <>
                              {isGeneratingSpy ? (
                                <div className="flex flex-col items-center justify-center h-full space-y-4 absolute inset-0">
                                  <div className="relative">
                                    <RefreshCw className="w-10 h-10 text-blue-200 animate-slow-spin" />
                                    <Search className="w-5 h-5 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs font-bold text-zinc-600">Gathering digital crumbs...</p>
                                    <p className="text-[10px] text-zinc-400 font-medium">Analyzing organic search, social engagement and domain authority.</p>
                                  </div>
                                </div>
                              ) : spyMarkdown ? (
                                <div className="prose prose-sm prose-zinc max-w-none prose-headings:text-zinc-900 prose-headings:font-black prose-headings:tracking-tight prose-strong:text-zinc-800">
                                  <Markdown>{spyMarkdown}</Markdown>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full space-y-3 absolute inset-0 opacity-60">
                                  <Eye className="w-12 h-12 text-zinc-300" />
                                  <p className="text-xs text-zinc-500 font-bold max-w-[200px] text-center">Run intelligence scan to populate AI insights.</p>
                                </div>
                              )}
                            </>
                          )}

                          {spyInnerTab === 'ads' && (
                            <div className="animate-in fade-in h-full flex flex-col">
                                <h4 className="text-sm font-black text-blue-900 mb-1">Meta Ads Transparency Tracker</h4>
                                <p className="text-[10px] text-zinc-500 font-medium mb-5">Simulated real-time interception of active Facebook and Instagram advertisement campaigns launched by {spyCompetitor || 'target'}.</p>
                                
                                {spyCompetitor ? (
                                  <div className="space-y-4 flex-1">
                                    {[1, 2, 3].map(ad => (
                                      <div key={ad} className="bg-white border border-blue-50 p-4 rounded-xl shadow-xs flex gap-4">
                                         <div className="w-20 h-20 bg-zinc-100 rounded-lg shrink-0 flex items-center justify-center border border-zinc-200 overflow-hidden">
                                            <ImageIcon className="w-6 h-6 text-zinc-300" />
                                         </div>
                                         <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                              <span className="text-[9px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold uppercase">Active • Started {ad*2} days ago</span>
                                              <span className="text-[9px] text-zinc-400 font-mono">ID: {Math.random().toString(36).substring(2,8).toUpperCase()}</span>
                                            </div>
                                            <p className="text-xs font-medium text-zinc-800 line-clamp-2">"Huge discounts on premium electronics! Shop the latest arrivals now at {spyCompetitor}. Free delivery across Yerevan."</p>
                                            <div className="flex space-x-3 pt-2">
                                              <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1"><Eye className="w-3 h-3" /> ~{Math.floor(Math.random()*50)}k Imp.</span>
                                              <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><Zap className="w-3 h-3" /> High Conversion</span>
                                            </div>
                                         </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center flex-1 space-y-2">
                                     <ShieldAlert className="w-8 h-8 text-zinc-300" />
                                     <p className="text-[11px] text-zinc-500 font-bold">Awaiting Target Designation</p>
                                  </div>
                                )}
                            </div>
                          )}

                          {spyInnerTab === 'pricing' && (
                            <div className="animate-in fade-in h-full flex flex-col">
                                <h4 className="text-sm font-black text-rose-900 mb-1">Pricing & Elasticity Heatmap</h4>
                                <p className="text-[10px] text-zinc-500 font-medium mb-5">Continuous monitoring of key product categories (Apple, Dyson, Marshall) to detect hidden discounts.</p>
                                
                                {spyCompetitor ? (
                                  <div className="space-y-3">
                                      <div className="bg-red-50/50 border border-red-100 p-3 rounded-xl flex items-center justify-between">
                                          <div>
                                            <p className="text-xs font-bold text-zinc-800">Apple iPhone 15 Pro 256GB</p>
                                            <p className="text-[10px] text-zinc-500">Last updated: 2 hours ago</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm font-black text-rose-600">485,000 AMD</p>
                                            <p className="text-[10px] font-bold text-zinc-400 line-through">505,000 AMD</p>
                                          </div>
                                      </div>
                                      <div className="bg-white border border-zinc-200 p-3 rounded-xl flex items-center justify-between shadow-xs">
                                          <div>
                                            <p className="text-xs font-bold text-zinc-800">Sony PlayStation 5 Slim</p>
                                            <p className="text-[10px] text-zinc-500">Last updated: 1 day ago</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm font-black text-zinc-700">240,000 AMD</p>
                                            <p className="text-[10px] font-bold text-emerald-600">Stable Price</p>
                                          </div>
                                      </div>
                                      <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl flex items-center justify-between">
                                          <div>
                                            <p className="text-xs font-bold text-zinc-800">Marshall Kilburn II Black</p>
                                            <p className="text-[10px] text-zinc-500">Last updated: 12 mins ago</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm font-black text-blue-700">149,000 AMD</p>
                                            <p className="text-[10px] font-bold text-blue-500 bg-blue-100/50 px-1.5 py-0.5 rounded inline-block">Credit Promo 0%</p>
                                          </div>
                                      </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center flex-1 space-y-2">
                                     <PieChartIcon className="w-8 h-8 text-zinc-300" />
                                     <p className="text-[11px] text-zinc-500 font-bold">Select Competitor to Load Matrix</p>
                                  </div>
                                )}
                            </div>
                          )}

                          {spyInnerTab === 'seo' && (
                            <div className="animate-in fade-in h-full flex flex-col">
                                <h4 className="text-sm font-black text-emerald-900 mb-1">Traffic & Domain SEO Footprint</h4>
                                <p className="text-[10px] text-zinc-500 font-medium mb-5">Synthesized estimation of organic monthly visits, top keywords, and domain authority score.</p>
                                
                                {spyCompetitor ? (
                                  <div className="grid grid-cols-2 gap-4">
                                      <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/50 text-center space-y-2">
                                          <p className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Est. Monthly Traffic</p>
                                          <p className="text-3xl font-black text-emerald-600">~{20 + Math.floor(Math.random()*80)}K</p>
                                          <p className="text-[10px] font-bold text-emerald-700/60">+12% vs last month</p>
                                      </div>
                                      <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-100/50 text-center space-y-2">
                                          <p className="text-[10px] font-black uppercase text-indigo-800 tracking-wider">Domain Authority Rating</p>
                                          <p className="text-3xl font-black text-indigo-600">{15 + Math.floor(Math.random()*25)}<span className="text-lg text-indigo-400">/100</span></p>
                                          <p className="text-[10px] font-bold text-indigo-700/60">Medium-High Trust</p>
                                      </div>
                                      <div className="col-span-2 bg-white border border-zinc-200 p-4 rounded-xl shadow-xs">
                                         <p className="text-[10px] font-black uppercase text-zinc-500 tracking-wider mb-3">Top Shared Keywords Map</p>
                                         <div className="flex flex-wrap gap-2">
                                            {['iphone 15 pro max yerevan', 'airpods pro 2', 'samsung galaxy s24', 'marshall acton 3', 'macbook pro m3 price', 'dyson airwrap'].map(kw => (
                                              <span key={kw} className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded-md text-[10px] font-mono border border-zinc-200">{kw}</span>
                                            ))}
                                         </div>
                                      </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center flex-1 space-y-2 min-h-[300px]">
                                     <BarChart className="w-8 h-8 text-zinc-300" />
                                     <p className="text-[11px] text-zinc-500 font-bold">Radar Offline - Choose Target</p>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      </div>`;

const newCode = code.substring(0, startIdx) + replacement + '\n' + code.substring(endIdx);
fs.writeFileSync('src/App.tsx', newCode);
console.log('Spy UI tab patched successfully');
