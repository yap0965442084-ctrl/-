
import React, { useState } from 'react';
import { Users, LayoutGrid, Shuffle, Download, Printer, Info, FileSpreadsheet } from 'lucide-react';
import { Participant, Group } from '../types';

interface GroupGeneratorProps {
  participants: Participant[];
}

export const GroupGenerator: React.FC<GroupGeneratorProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const totalMembers = participants.length;

  const generateGroups = () => {
    if (totalMembers < 2) return;
    setIsGenerating(true);
    
    // Artificial delay for "calculating" feel
    setTimeout(() => {
      const shuffled = [...participants].sort(() => Math.random() - 0.5);
      const newGroups: Group[] = [];
      
      for (let i = 0; i < shuffled.length; i += groupSize) {
        newGroups.push({
          id: Math.floor(i / groupSize) + 1,
          name: `第 ${Math.floor(i / groupSize) + 1} 組`,
          members: shuffled.slice(i, i + groupSize)
        });
      }
      
      setGroups(newGroups);
      setIsGenerating(false);
    }, 800);
  };

  const exportToCSV = () => {
    if (groups.length === 0) return;
    
    let csvContent = "組別,姓名\n";
    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `${group.name},${member.name}\n`;
      });
    });

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `分組結果_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const colors = [
    'border-indigo-500 bg-indigo-50 text-indigo-700',
    'border-emerald-500 bg-emerald-50 text-emerald-700',
    'border-amber-500 bg-amber-50 text-amber-700',
    'border-rose-500 bg-rose-50 text-rose-700',
    'border-cyan-500 bg-cyan-50 text-cyan-700',
    'border-purple-500 bg-purple-50 text-purple-700',
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Users className="text-indigo-600" />
              自動分組系統
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              共有 <span className="text-indigo-600 font-bold">{totalMembers}</span> 位參與者
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
              <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">每組人數:</label>
              <input
                type="number"
                min="2"
                max={totalMembers}
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                className="w-16 p-1 bg-white border border-slate-200 rounded text-center font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <button
              onClick={generateGroups}
              disabled={isGenerating || totalMembers < 2}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 ${
                isGenerating ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isGenerating ? <div className="w-5 h-5 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div> : <Shuffle className="w-5 h-5" />}
              {groups.length > 0 ? '重新分組' : '開始分組'}
            </button>
          </div>
        </div>

        {totalMembers < 2 && (
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3 text-amber-800">
            <Info className="w-5 h-5 mt-0.5" />
            <p className="text-sm font-medium">人數不足，至少需要 2 位參與者才能開始分組。</p>
          </div>
        )}

        {groups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groups.map((group, idx) => (
              <div 
                key={group.id} 
                className={`flex flex-col border-l-4 rounded-xl shadow-sm transition-all hover:shadow-md ${colors[idx % colors.length]}`}
              >
                <div className="p-4 border-b border-white/50 flex justify-between items-center">
                  <h4 className="font-bold text-lg">{group.name}</h4>
                  <span className="text-xs font-bold opacity-60">{group.members.length} 人</span>
                </div>
                <div className="p-4 space-y-2">
                  {group.members.map((member, mIdx) => (
                    <div key={member.id} className="flex items-center gap-2 text-sm bg-white/40 p-2 rounded-lg">
                      <span className="w-5 h-5 flex items-center justify-center bg-white/60 rounded-full text-[10px] font-bold">
                        {mIdx + 1}
                      </span>
                      <span className="font-medium text-slate-800">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
            <LayoutGrid className="w-16 h-16 mb-4 opacity-10" />
            <p>設定每組人數後，點擊「開始分組」查看結果</p>
          </div>
        )}
      </div>

      {groups.length > 0 && (
        <div className="flex justify-end gap-3 no-print">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-lg font-medium"
          >
            <FileSpreadsheet className="w-4 h-4" />
            下載 CSV 紀錄
          </button>
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition shadow-lg font-medium"
          >
            <Printer className="w-4 h-4" />
            列印結果
          </button>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
};
