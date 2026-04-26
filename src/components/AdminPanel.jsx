/* ─── Forjit AI · Admin Panel ───────────────────────────────────────────────
 *  Rendered inside a wide <Drawer> — visible only to admin users.
 *  Pure UI — all data + handlers passed as props.
 * ──────────────────────────────────────────────────────────────────────────*/

import React from "react";
import { Download, Star } from "lucide-react";
import { Stat } from "./ui";

export default function AdminPanel({
  users, history, repository,
  errorLog, feedbackList,
  exportErrorLog,
}) {
  return (
    <div className="space-y-5">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Stat label="Users"       value={users.length}                    color="amber"   />
        <Stat label="Generations" value={history.length + repository.length} color="emerald" />
        <Stat label="Errors"      value={errorLog.length}                 color="rose"    />
        <Stat label="Feedback"    value={feedbackList.length}             color="sky"     />
      </div>

      {/* Users */}
      <div>
        <h3 className="font-display text-base font-semibold mb-2">All Users ({users.length})</h3>
        {users.length === 0 ? (
          <p className="text-xs text-stone-500">No users yet.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
            {users.map((u) => (
              <div key={u.id} className="p-2.5 rounded border border-stone-800 bg-stone-950/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-stone-200">
                      {u.name}{" "}
                      {u.isAdmin && (
                        <span className="text-[9px] font-mono px-1 py-0.5 bg-purple-500/20 text-purple-300 rounded ml-1">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-stone-500">{u.email}</div>
                  </div>
                  <div className="text-[10px] font-mono text-stone-600 text-right">
                    <div>joined: {new Date(u.createdAt).toLocaleDateString()}</div>
                    <div>last: {new Date(u.lastLogin).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error log */}
      <div>
        <h3 className="font-display text-base font-semibold mb-2">Recent Errors ({errorLog.length})</h3>
        <button
          onClick={exportErrorLog}
          className="mb-2 w-full px-3 py-2 rounded border border-stone-800 text-xs text-stone-300 hover:border-stone-700 flex items-center justify-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" /> Export as JSON
        </button>
        {errorLog.length === 0 ? (
          <p className="text-xs text-stone-500">Clean slate.</p>
        ) : (
          <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
            {errorLog.slice(0, 10).map((e, i) => (
              <div key={i} className="p-2 rounded border border-rose-500/20 bg-rose-500/5 text-[11px]">
                <div className="flex justify-between text-[10px] font-mono text-stone-500 mb-0.5">
                  <span>{e.context}</span>
                  <span>{new Date(e.ts).toLocaleTimeString()}</span>
                </div>
                <div className="text-stone-300 break-all">{e.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback */}
      <div>
        <h3 className="font-display text-base font-semibold mb-2">Feedback ({feedbackList.length})</h3>
        {feedbackList.length === 0 ? (
          <p className="text-xs text-stone-500">No feedback yet.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
            {feedbackList.map((f, i) => (
              <div key={i} className="p-2.5 rounded border border-stone-800 bg-stone-950/50">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`w-3 h-3 ${n <= f.rating ? "fill-amber-400 text-amber-400" : "text-stone-700"}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-stone-500">
                    {f.userName} · {new Date(f.ts).toLocaleDateString()}
                  </span>
                </div>
                {f.text && <p className="text-xs text-stone-300 mt-1.5">{f.text}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
