import React from 'react';
import { 
  Terminal, 
  Play, 
  AlertTriangle, 
  Database,
  Search,
  FileJson
} from 'lucide-react';

const AdminDatabase = ({ query, setQuery, onRunQuery, result }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Database Console</h2>
          <p className="text-slate-400 text-sm">Direct SQL access for maintenance and debugging</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 rounded-full border border-rose-500/20">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Read/Write Access</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-1 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">SQL Editor</span>
              </div>
              <button 
                onClick={onRunQuery}
                className="flex items-center gap-2 px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-all"
              >
                <Play className="w-3 h-3 fill-current" />
                Run Query
              </button>
            </div>
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-48 p-6 bg-slate-950 text-emerald-400 font-mono text-sm focus:outline-none resize-none placeholder:text-slate-700"
              placeholder="-- Write your SQL query here
SELECT * FROM users WHERE subscription_status = 'active' LIMIT 10;"
            />
          </div>

          {result && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
              <div className="flex items-center gap-2 mb-4 text-white">
                <FileJson className="w-5 h-5 text-rose-500" />
                <span className="font-bold">Query Result</span>
              </div>
              <div className="max-h-[400px] overflow-auto custom-scrollbar">
                <pre className="text-xs text-blue-300 font-mono leading-relaxed p-4 bg-slate-950 rounded-xl border border-slate-800/50">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-slate-900/50 border border-slate-800 border-dashed rounded-[2rem]">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-rose-500" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: 'List All Users', sql: 'SELECT * FROM users;' },
                { label: 'Pending Payments', sql: "SELECT * FROM manual_payments WHERE status = 'pending';" },
                { label: 'Check Table Sizes', sql: "SELECT name FROM sqlite_master WHERE type='table';" },
                { label: 'Active Trials', sql: "SELECT email FROM users WHERE subscription_plan = 'trial';" }
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => setQuery(action.sql)}
                  className="w-full text-left px-4 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/50 transition-all"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-[2rem]">
            <h3 className="text-rose-400 font-bold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Safety Warning
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You are connected directly to the production database. 
              <span className="text-rose-300 font-bold"> DELETE </span> 
              and 
              <span className="text-rose-300 font-bold"> DROP </span> 
              commands are permanent. Always verify queries before execution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDatabase;
