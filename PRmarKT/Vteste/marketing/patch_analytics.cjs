const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startMarker = '{/* Google Connection Banner & SMM Configuration */}';
const endMarker = '{/* Filter Section */}';

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.log('Markers not found!');
    process.exit(1);
}

const wrapperStart = `
                  {/* Analytics Toolbar */}
                  <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Date</span>
                        <select 
                          value={analyticsTimeFilter}
                          onChange={(e) => setAnalyticsTimeFilter(e.target.value)}
                          className="bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
                        >
                          <option value="7days">Last 7 Days</option>
                          <option value="30days">Last 30 Days</option>
                          <option value="90days">Last 90 Days</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Source</span>
                        <select 
                          value={analyticsSourceFilter}
                          onChange={(e) => setAnalyticsSourceFilter(e.target.value)}
                          className="bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
                        >
                          <option value="all">All Sources</option>
                          <option value="organic">Organic Traffic</option>
                          <option value="social">Social Media</option>
                          <option value="paid">Paid Campaigns</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Website</span>
                        <select 
                          value={analyticsWebsiteFilter}
                          onChange={(e) => setAnalyticsWebsiteFilter(e.target.value)}
                          className="bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-indigo-500"
                        >
                          <option value="all">All Linked Sites</option>
                          <option value="redstore">Redstore.am</option>
                          <option value="blog">Promo Blog</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowIntegrations(!showIntegrations)}
                        className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer border border-zinc-200/50"
                      >
                        <Settings className="w-4 h-4" />
                        <span>{showIntegrations ? 'Hide Integrations' : 'Integrations Panel'}</span>
                      </button>

                      <button
                        onClick={async () => {
                          const instructions = \`Apply Time Filter: \${analyticsTimeFilter}, Source Filter: \${analyticsSourceFilter}, Website Filter: \${analyticsWebsiteFilter}. Give comprehensive analysis based on active filters!\`;
                          setAnalyticsInstruction(instructions);
                          const aiSection = document.getElementById('ai-analyst-panel');
                          if (aiSection) aiSection.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                      >
                        <Brain className="w-4 h-4 text-indigo-200" />
                        <span>AI Analysis Workflow</span>
                      </button>
                    </div>
                  </div>

                  {/* WRAP CURRENT CONNECTIONS */}
                  {showIntegrations && (
                    <div className="space-y-6 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 md:p-6 pb-8 border-dashed relative mt-4 shadow-inner">
                      <div className="absolute top-0 right-6 -mt-3 bg-zinc-800 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-0.5 rounded-full shadow-sm">
                        Integrations Sandbox & Settings
                      </div>
                      
`;

const wrapperEnd = `
                    </div>
                  )}
                  
`;

const newCode = code.substring(0, startIndex) + wrapperStart + code.substring(startIndex, endIndex) + wrapperEnd + code.substring(endIndex);

fs.writeFileSync('src/App.tsx', newCode);
console.log("Analytics tab patched successfully!");
