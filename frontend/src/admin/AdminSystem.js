import React from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  ShieldCheck,
  Terminal as TerminalIcon
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const AdminSystem = ({ status }) => {
  // Mock data for trends if not provided
  const resourceData = [
    { name: '10:00', cpu: 25, mem: 45 },
    { name: '10:05', cpu: 30, mem: 48 },
    { name: '10:10', cpu: 45, mem: 52 },
    { name: '10:15', cpu: 35, mem: 50 },
    { name: '10:20', cpu: 55, mem: 58 },
    { name: '10:25', cpu: 40, mem: 55 },
    { name: '10:30', cpu: 38, mem: 54 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">System Health</h2>
          <p className="text-slate-400 text-sm">Real-time server monitoring and resource usage</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
          <Wifi className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest">Server Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CPU Usage */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-200">CPU Load</span>
            </div>
            <span className="text-xl font-black text-white">{status?.system?.cpu_usage || '0%'}</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-1000" 
              style={{ width: status?.system?.cpu_usage || '0%' }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                <HardDrive className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-200">Memory Usage</span>
            </div>
            <span className="text-xl font-black text-white">{status?.system?.memory_usage || '0%'}</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-1000" 
              style={{ width: status?.system?.memory_usage || '0%' }}
            />
          </div>
        </div>

        {/* Database Status */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-200">Database</span>
            </div>
            <span className="text-sm font-bold text-emerald-400">ONLINE</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-bold text-white">{status?.database?.total_users || 0}</span> Users Connected
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem]">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500" />
            Resource Trends
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resourceData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem]">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <TerminalIcon className="w-5 h-5 text-rose-500" />
            System Logs
          </h3>
          <div className="space-y-3 font-mono text-[11px] max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
            {[
              { time: '12:45:01', type: 'INFO', msg: 'Admin dashboard initialized successfully' },
              { time: '12:44:58', type: 'SUCCESS', msg: 'Manual payment verification for user@example.com' },
              { time: '12:40:22', type: 'INFO', msg: 'New trial started for user_992' },
              { time: '12:35:10', type: 'WARN', msg: 'High memory usage detected (58%)' },
              { time: '12:30:05', type: 'INFO', msg: 'Database backup completed' },
              { time: '12:25:00', type: 'INFO', msg: 'WhatsApp bridge heartbeat: OK' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 p-2.5 bg-slate-950/50 rounded-lg border border-slate-800/50 group hover:border-slate-700 transition-colors">
                <span className="text-slate-500">{log.time}</span>
                <span className={
                  log.type === 'SUCCESS' ? 'text-emerald-400' : 
                  log.type === 'WARN' ? 'text-amber-400' : 
                  log.type === 'ERROR' ? 'text-rose-400' : 'text-blue-400'
                }>{log.type}</span>
                <span className="text-slate-300 group-hover:text-white transition-colors">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystem;
