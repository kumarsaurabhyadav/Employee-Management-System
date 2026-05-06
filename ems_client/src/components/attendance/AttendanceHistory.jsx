import React from "react";
import { getDayTypeDisplay, getWorkingHoursDisplay } from "../../assets/assets";
import { format } from "date-fns";
import { CalendarX2Icon } from "lucide-react"; 

const AttendanceHistory = ({ history }) => {
  return (
    <div className="card overflow-hidden animate-fade-in shadow-sm border border-zinc-200/80">
      
      {/* Sleek Header */}
      <div className="px-6 py-5 border-b border-zinc-100 bg-white flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-black tracking-tight">Recent Activity</h3>
        
        {/* Record count indicator pill */}
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-50 px-2.5 py-1 rounded-md border border-zinc-200/60 shadow-sm">
          {history.length} Records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          
          {/* Table Head (Uppercase, Tracking wide for Enterprise look) */}
          <thead>
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50/50 border-b border-zinc-100">Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50/50 border-b border-zinc-100">Check In</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50/50 border-b border-zinc-100">Check Out</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50/50 border-b border-zinc-100">Working Hrs</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50/50 border-b border-zinc-100">Day Type</th>
              <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50/50 border-b border-zinc-100 text-right">Status</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-zinc-100 bg-white">
            
            {/* Premium Empty State */}
            {history.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center border border-zinc-100 mb-3 shadow-sm">
                        <CalendarX2Icon className="w-5 h-5 text-zinc-400" />
                    </div>
                    <p className="text-[14px] font-semibold text-zinc-900 tracking-tight">No records found</p>
                    <p className="text-[12px] font-medium text-zinc-500 mt-0.5">There is no attendance history to display yet.</p>
                  </div>
                </td>
              </tr>
            ) : (
              
              /* Table Rows with soft hover effect */
              history.map((record) => {
                const dayType = getDayTypeDisplay(record);
                
                // Logic Fix: Normalizing status text cases for accurate badge colors
                const isPresent = record.status?.toLowerCase() === "present";
                const isLate = record.status?.toUpperCase() === "LATE";

                return (
                <tr key={record._id || record.id} className="hover:bg-zinc-50/50 transition-colors duration-200 group">
                    
                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-semibold text-zinc-900 tracking-tight">
                            {format(new Date(record.date), "dd MMM, yyyy")}
                        </span>
                    </td>

                    {/* Check In */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-medium text-zinc-600">
                            {record.checkIn ? format(new Date(record.checkIn), "hh:mm a") : "-"}
                        </span>
                    </td>

                    {/* Check Out */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-medium text-zinc-600">
                            {record.checkOut ? format(new Date(record.checkOut), "hh:mm a") : "-"}
                        </span>
                    </td>

                    {/* Working Hours Pill */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[12px] font-bold text-zinc-700 bg-zinc-100/80 px-2 py-1 rounded-md border border-zinc-200/60 shadow-sm">
                            {getWorkingHoursDisplay(record)}
                        </span>
                    </td>

                    {/* Day Type Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        {dayType.label !== "-" ? (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                                // Aapki purani global classes agar hain toh wo yahan reflect hongi, nahi toh maine premium zinc styling di hai
                                dayType.className || "bg-zinc-100 border border-zinc-200 text-zinc-600"
                            }`}>
                                {dayType.label}
                            </span>
                        ) : (
                            <span className="text-zinc-400 font-medium">-</span>
                        )}
                    </td>

                    {/* Dynamic Status Badge (Right Aligned) */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-sm border ${
                            isPresent 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200/60" 
                            : isLate 
                            ? "bg-amber-50 text-amber-600 border-amber-200/60" 
                            : "bg-red-50 text-red-600 border-red-200/60"
                        }`}>
                            {record.status}
                        </span>
                    </td>
                </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceHistory;