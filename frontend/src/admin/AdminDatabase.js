import React from 'react';
import { 
  Terminal, 
  Play, 
  AlertTriangle, 
  Database,
  FileJson
} from 'lucide-react';

const AdminDatabase = ({ query, setQuery, onRunQuery, result, tables = [] }) => {
  const isSelect = Array.isArray(result);
  
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
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
SELECT * FROM users LIMIT 10;"
            />
          </div>

          {result && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-white">
                  <FileJson className="w-5 h-5 text-rose-500" />
                  <span className="font-bold">Query Result</span>
                </div>
                {isSelect && <span className="text-xs text-slate-500 font-mono">{result.length} rows returned</span>}
              </div>
              
              <div className="max-h-[500px] overflow-auto custom-scrollbar border border-slate-800 rounded-xl bg-slate-950/50">
                {isSelect ? (
                  result.length > 0 ? (
                    <table className="w-full text-left border-collapse min-w-full">
                      <thead className="sticky top-0 bg-slate-900 z-10">
                        <tr>
                          {Object.keys(result[0]).map(key => (
                            <th key={key} className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {result.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-900/50 transition-colors">
                            {Object.values(row).map((val, j) => (
                              <td key={j} className="px-4 py-3 text-xs text-slate-300 whitespace-nowrap font-mono">
                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-12 text-center text-slate-500 italic">No results found</div>
                  )
                ) : (
                  <pre className="text-xs text-blue-300 font-mono leading-relaxed p-6">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem]">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-rose-500" />
              Tables
            </h3>
            <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {tables.map((table) => (
                <button 
                  key={table}
                  onClick={() => setQuery(`SELECT * FROM ${table} LIMIT 10;`)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-between group"
                >
                  <span className="truncate">{table}</span>
                  <Play className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
              {tables.length === 0 && <p className="text-xs text-slate-600 italic px-3">No tables found</p>}
            </div>
          </div>

          <div className="p-6 bg-slate-900/50 border border-slate-800 border-dashed rounded-[2rem]">
            <h3 className="text-white font-bold mb-4 text-sm">Quick Queries</h3>
            <div className="space-y-2">
              {[
                { label: 'Active Subscriptions', sql: "SELECT * FROM users WHERE subscription_status = 'active';" },
                { label: 'Pending Verification', sql: "SELECT * FROM manual_payments WHERE status = 'pending';" },
                { label: 'System Usage', sql: "SELECT name, status FROM digital_twins;" }
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => setQuery(action.sql)}
                  className="w-full text-left px-4 py-2.5 bg-slate-800/30 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-slate-700/30 transition-all"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-[2rem]">
            <h3 className="text-rose-400 font-bold mb-2 flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Caution
            </h3>
            <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter font-bold">
              Direct Production Access. Updates are immediate and permanent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDatabase;
