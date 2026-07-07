"use client";

import { useSorobanEvents } from "@/hooks/useSorobanEvents";
import { Activity, Radio } from "lucide-react";

export function ActivityFeed() {
  const { data: events, isLoading, isError } = useSorobanEvents();

  return (
    <div className="w-full bg-white rounded-2xl border-2 border-slate-200 shadow-[8px_8px_0px_0px_rgba(226,232,240,1)] overflow-hidden flex flex-col h-[400px]">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Global Events</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600">
            Real-time
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {isLoading && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            <Radio className="w-4 h-4 mr-2 animate-pulse" /> Listening for on-chain events...
          </div>
        )}
        
        {isError && (
          <div className="text-red-500 text-xs text-center">Failed to fetch events from testnet.</div>
        )}

        {events?.length === 0 && !isLoading && (
          <div className="text-gray-500 text-xs text-center my-auto">
            No recent on-chain activity found.
          </div>
        )}

        {events?.map((evt) => {
          let eventTitle = evt.topic.join(" • ");
          let eventDesc = JSON.stringify(evt.data, (key, value) => typeof value === 'bigint' ? value.toString() : value);
          let isCourse = evt.topic[0] === "COURSE";
          
          if (evt.topic[0] === "COURSE" && evt.topic[1] === "CREATED") {
             eventTitle = "New Course Created!";
             try {
               const dataArr = evt.data as any[];
               if (Array.isArray(dataArr) && dataArr.length >= 2) {
                 eventDesc = `Course ID #${dataArr[0]} was published with a ${dataArr[1]} XLM reward pool.`;
               }
             } catch(e) {}
          } else if (evt.topic[0] === "REWARD" && evt.topic[1] === "CLAIMED") {
             eventTitle = "Reward Claimed 🏆";
             try {
               const dataArr = evt.data as any[];
               if (Array.isArray(dataArr)) {
                 eventDesc = `A learner just claimed their LRN reward!`;
               }
             } catch(e) {}
          }

          return (
            <div key={evt.id} className="group flex gap-4 text-sm p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-default">
              <div className="flex-shrink-0 mt-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-transform group-hover:scale-110 ${isCourse ? 'bg-indigo-50 border-indigo-100 text-indigo-500' : 'bg-emerald-50 border-emerald-100 text-emerald-500'}`}>
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full min-w-0 justify-center">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <span className="font-extrabold text-slate-800 truncate min-w-0 flex-1 group-hover:text-blue-700 transition-colors">
                    {eventTitle}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 text-slate-500 shrink-0 rounded-md whitespace-nowrap border border-slate-200">
                    Ledger {evt.ledger}
                  </span>
                </div>
                <div className="text-sm text-slate-500 font-medium truncate min-w-0">
                  {eventDesc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
