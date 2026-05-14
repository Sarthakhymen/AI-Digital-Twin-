import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  IndianRupee,
  MessageSquare
} from 'lucide-react';

const AdminPayments = ({ payments, onVerify }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Manual Payment Requests</h2>
        <p className="text-slate-400 text-sm">Verify UPI transactions and activate premium accounts</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {payments.length === 0 ? (
          <div className="p-12 bg-slate-900 border border-slate-800 rounded-[2rem] text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">All caught up!</h3>
            <p className="text-slate-500">No pending payment requests to verify.</p>
          </div>
        ) : (
          payments.map((p) => (
            <div 
              key={p.id} 
              className={`p-6 bg-slate-900 border rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${
                p.status === 'pending' ? 'border-amber-500/30' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                  p.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}>
                  <IndianRupee className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-black text-white">₹2,499</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      p.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-slate-300">{p.email}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <code className="bg-slate-800 px-1.5 py-0.5 rounded text-rose-300">{p.transaction_id}</code>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(p.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition-all">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>
                {p.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => onVerify(p.transaction_id, 'reject')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl text-sm font-semibold transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                    <button 
                      onClick={() => onVerify(p.transaction_id, 'verify')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Verify & Activate
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
