import React, { useState } from 'react';
import { 
  BarChart3, Upload, Calendar, RefreshCw, Layers, Brain, FileText, 
  Settings, CheckCircle2, AlertCircle, ChevronDown, Download, MessageSquare
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsCenter() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reports' | 'integrations'>('dashboard');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [fileAttached, setFileAttached] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  const mockChartData = [
    { date: 'Mon', google: 4000, meta: 2400, yandex: 2400, tiktok: 1200 },
    { date: 'Tue', google: 3000, meta: 1398, yandex: 2210, tiktok: 1100 },
    { date: 'Wed', google: 2000, meta: 9800, yandex: 2290, tiktok: 1900 },
    { date: 'Thu', google: 2780, meta: 3908, yandex: 2000, tiktok: 1800 },
    { date: 'Fri', google: 1890, meta: 4800, yandex: 2181, tiktok: 2400 },
    { date: 'Sat', google: 2390, meta: 3800, yandex: 2500, tiktok: 3200 },
    { date: 'Sun', google: 3490, meta: 4300, yandex: 2100, tiktok: 2900 },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileAttached(e.target.files[0]);
    }
  };

  const runAiAnalysis = async () => {
    if (!fileAttached) return;
    setIsAnalyzing(true);
    
    try {
      const text = await fileAttached.text();
      const res = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: fileAttached.name, content: text, prompt: 'Проведи умный анализ отчета и обнови показатели, перераспределив бюджет.' })
      });
      
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      setAiReport(data.report || 'Не удалось сгенерировать отчет.');
    } catch (err: any) {
      console.error(err);
      setAiReport('Ошибка во время AI-анализа отчета: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 font-sans animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200">
            Smart Analytics OS
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Универсальный центр данных: Google, Yandex, Meta и TikTok + AI Аналитика
          </p>
        </div>

        {/* Date Picker (Custom beautiful UI) */}
        <div className="flex bg-zinc-900 border border-white/10 rounded-2xl p-1 shadow-lg">
          {['Today', 'Last 7 Days', 'This Month', 'Custom Range'].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                dateRange === range 
                  ? 'bg-amber-500 text-black shadow-md' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {range}
            </button>
          ))}
          <div className="px-3 border-l border-white/10 flex items-center ml-1 text-zinc-400 hover:text-amber-400 cursor-pointer transition-colors">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">10.20 - 10.26</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-6 border-b border-white/10 mb-8">
        {[
          { id: 'dashboard', label: 'Overview', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
          { id: 'reports', label: 'AI Smart Reports', icon: <Brain className="w-4 h-4 mr-2" /> },
          { id: 'integrations', label: 'Connect Integrations', icon: <Settings className="w-4 h-4 mr-2" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 flex items-center text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id 
                ? 'border-amber-400 text-amber-400' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard platform="Google Ecosystem" value="48,202" change="+12.5%" connected />
            <StatCard platform="Meta (FB & IG)" value="24,105" change="+5.2%" connected />
            <StatCard platform="Yandex Matrix" value="18,940" change="-1.2%" connected={false} />
            <StatCard platform="TikTok Ads" value="84,103" change="+22.4%" connected={false} />
          </div>

          <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl h-[400px]">
            <h3 className="text-zinc-100 font-semibold mb-6 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-amber-500" /> Omni-Channel Traffic
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4285F4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0668E1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0668E1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="google" stroke="#4285F4" fillOpacity={1} fill="url(#colorGoogle)" strokeWidth={2} />
                <Area type="monotone" dataKey="meta" stroke="#0668E1" fillOpacity={1} fill="url(#colorMeta)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab Content: Reports */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
              <Upload className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Report Engine</h3>
            <p className="text-zinc-400 max-w-sm mb-8 text-sm leading-relaxed">
              Пришлите отчет в формате CSV/Excel, и ИИ просмотрит данные, извлечет требуемые даты, сверит их и обновит нужные цифры в базе перед отправкой обратно.
            </p>
            
            <input 
              type="file" 
              id="report-upload" 
              className="hidden" 
              accept=".csv,.xlsx,.xls,.pdf"
              onChange={handleFileUpload}
            />
            <label 
              htmlFor="report-upload" 
              className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 cursor-pointer transition-colors"
            >
              Выбрать файл отчета
            </label>

            {fileAttached && (
              <div className="mt-6 p-4 bg-zinc-800 rounded-xl w-full text-left flex items-center justify-between border border-white/10">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-indigo-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium">{fileAttached.name}</p>
                    <p className="text-xs text-zinc-500">{(fileAttached.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button 
                  onClick={runAiAnalysis}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-lg hover:bg-amber-400 disabled:opacity-50 transition-colors flex items-center"
                >
                  {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin mr-1" /> : <Brain className="w-4 h-4 mr-1" />}
                  {isAnalyzing ? 'Аналитика...' : 'Анализировать AI'}
                </button>
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-30 opacity-5 pointer-events-none">
              <Brain className="w-64 h-64" />
            </div>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <MessageSquare className="w-5 h-5 mr-3 text-amber-500" />
              Результат обработки
            </h3>
            
            {aiReport ? (
              <div className="relative z-10 prose prose-invert prose-amber max-w-none">
                <div className="whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed bg-zinc-950 p-6 rounded-2xl border border-white/5 shadow-inner">
                  {aiReport}
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors border border-white/10">
                    <Download className="w-4 h-4 mr-2" /> Скачать обновленный отчет
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-zinc-500">
                <Brain className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Загрузите отчет для AI обработки</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Integrations */}
      {activeTab === 'integrations' && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-start">
            <CheckCircle2 className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
            <div className="text-sm leading-relaxed">
              Для получения **реальных данных (live data)**, введите ключи API. Мы предоставляем безопасное хранение.
            </div>
          </div>

          <IntegrationCard 
            title="Google Ecosystem" 
            desc="(Analytics 4, Ads, YouTube, Business)" 
            status="connected"
            requirements="Client ID, Client Secret"
          />
          <IntegrationCard 
            title="Yandex Network" 
            desc="(Метрика, Карты, Яндекс.Бизнес)" 
            status="needed"
            requirements="OAuth Client ID, Token"
          />
          <IntegrationCard 
            title="Meta Developers" 
            desc="(Facebook, Instagram - Multi-Account)" 
            status="needed"
            requirements="App ID, App Secret"
            isMultiAccount
          />
          <IntegrationCard 
            title="TikTok For Business" 
            desc="(Ads & Analytics API)" 
            status="needed"
            requirements="TikTok App ID, Secret"
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ platform, value, change, connected }: { platform: string, value: string, change: string, connected: boolean }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-zinc-900 border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <span className="text-zinc-400 text-sm font-medium">{platform}</span>
        {connected ? (
          <span className="flex items-center text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse" /> Live
          </span>
        ) : (
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-full">Not Connected</span>
        )}
      </div>
      <h3 className="text-3xl font-bold text-white mb-2">{connected ? value : '---'}</h3>
      <p className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {connected ? `${change} vs last period` : 'No data'}
      </p>
    </div>
  );
}

function IntegrationCard({ title, desc, status, requirements, isMultiAccount }: any) {
  return (
    <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h4 className="text-lg font-bold text-zinc-100 flex items-center">
          {title} 
          {status === 'connected' && <CheckCircle2 className="w-4 h-4 ml-2 text-emerald-400" />}
        </h4>
        <p className="text-zinc-500 text-sm mt-1">{desc}</p>
        <p className="text-xs text-zinc-600 mt-2 font-mono">Требуется: {requirements}</p>
        
        {isMultiAccount && (
          <div className="mt-3 flex items-center space-x-2">
            <span className="px-2 py-1 bg-zinc-800 text-xs rounded-lg text-zinc-400 border border-white/5">Meta Account 1 (Active)</span>
            <span className="px-2 py-1 bg-zinc-800/50 text-xs rounded-lg text-zinc-600 border border-white/5 border-dashed cursor-pointer hover:text-zinc-300 transition-colors">
              + Switch Account
            </span>
          </div>
        )}
      </div>
      
      <div>
        {status === 'connected' ? (
          <button className="px-4 py-2 border border-white/10 text-zinc-300 text-sm font-semibold rounded-xl hover:bg-white/5 transition-colors">
            Configure
          </button>
        ) : (
          <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-200 transition-colors">
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
