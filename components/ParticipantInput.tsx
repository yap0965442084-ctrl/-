
import React, { useState, useRef, useMemo } from 'react';
import { Upload, FileText, UserPlus, Trash2, CheckCircle2, ClipboardList, AlertCircle, Wand2 } from 'lucide-react';
import { Participant } from '../types';

interface ParticipantInputProps {
  participants: Participant[];
  onUpdate: (names: string[]) => void;
  onNext: () => void;
}

const MOCK_NAMES = [
  "王小明", "李美華", "陳大同", "張志豪", "林淑芬", "劉傑西", "黃靜宜", "周傑倫",
  "吳佩琪", "徐大為", "蔡依林", "許嘉宏", "何秀蘭", "鄭凱文", "蘇慧倫", "謝孟勳",
  "郭台銘", "曾國城", "彭于晏", "詹子賢"
];

export const ParticipantInput: React.FC<ParticipantInputProps> = ({ participants, onUpdate, onNext }) => {
  const [inputText, setInputText] = useState(participants.map(p => p.name).join('\n'));
  const [isCsvDragging, setIsCsvDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Identify duplicates
  const duplicates = useMemo(() => {
    const counts = new Map<string, number>();
    participants.forEach(p => {
      counts.set(p.name, (counts.get(p.name) || 0) + 1);
    });
    return counts;
  }, [participants]);

  const hasDuplicates = useMemo(() => {
    // Fixed: Explicitly typed 'count' as number to resolve "Operator '>' cannot be applied to types 'unknown' and 'number'"
    return Array.from(duplicates.values()).some((count: number) => count > 1);
  }, [duplicates]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleApply = () => {
    const names = inputText.split(/[\n,]+/).map(n => n.trim()).filter(n => n !== '');
    onUpdate(names);
  };

  const handleRemoveDuplicates = () => {
    const uniqueNames = Array.from(new Set(participants.map(p => p.name)));
    setInputText(uniqueNames.join('\n'));
    onUpdate(uniqueNames);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const names = content.split(/[\n,]+/).map(n => n.trim()).filter(n => n !== '');
      setInputText(prev => (prev ? prev + '\n' : '') + names.join('\n'));
    };
    reader.readAsText(file);
  };

  const generateMockData = () => {
    setInputText(MOCK_NAMES.join('\n'));
    onUpdate(MOCK_NAMES);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Input Methods */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserPlus className="text-indigo-600" />
                匯入名單
              </h3>
              <button 
                onClick={generateMockData}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md transition-colors"
              >
                <Wand2 className="w-3 h-3" />
                產生模擬名單
              </button>
            </div>
            
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer mb-6 ${
                isCsvDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsCsvDragging(true); }}
              onDragLeave={() => setIsCsvDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsCsvDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) processFile(file);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" className="hidden" ref={fileInputRef} accept=".csv,.txt" onChange={handleFileUpload} />
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-indigo-600" />
              </div>
              <p className="text-sm font-medium text-slate-700">點擊或拖曳 CSV 檔案</p>
              <p className="text-xs text-slate-400 mt-1">支援 .csv, .txt (姓名以換行或逗號分隔)</p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">或直接貼上姓名</span>
              </div>
            </div>

            <div className="mt-6">
              <textarea
                value={inputText}
                onChange={handleTextChange}
                placeholder="王小明&#10;李大華&#10;陳國雄..."
                className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all custom-scrollbar resize-none text-slate-700"
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleApply}
                className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95"
              >
                套用名單
              </button>
              <button
                onClick={() => { setInputText(''); onUpdate([]); }}
                className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                title="清除所有內容"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Preview & Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-full">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="text-indigo-600" />
                名單預覽
              </span>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                共 {participants.length} 位
              </span>
            </h3>

            {hasDuplicates && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-red-700 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  發現重複姓名！
                </div>
                <button 
                  onClick={handleRemoveDuplicates}
                  className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition shadow-sm"
                >
                  一鍵移除重複
                </button>
              </div>
            )}

            {participants.length > 0 ? (
              <div className="max-h-[500px] overflow-y-auto custom-scrollbar border border-slate-100 rounded-xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase sticky top-0">
                    <tr>
                      <th className="px-4 py-3 font-semibold">序號</th>
                      <th className="px-4 py-3 font-semibold">姓名</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {participants.map((p, idx) => {
                      const isDuplicate = (duplicates.get(p.name) || 0) > 1;
                      return (
                        <tr key={p.id} className={`transition-colors ${isDuplicate ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-indigo-50'}`}>
                          <td className="px-4 py-3 text-slate-400 text-sm">{idx + 1}</td>
                          <td className="px-4 py-3 flex items-center gap-2">
                            <span className={`font-medium ${isDuplicate ? 'text-red-700' : 'text-slate-700'}`}>{p.name}</span>
                            {isDuplicate && <span className="text-[10px] bg-red-200 text-red-800 px-1.5 py-0.5 rounded font-bold">重複</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <ClipboardList className="w-12 h-12 mb-4 opacity-20" />
                <p>尚未匯入任何姓名</p>
              </div>
            )}

            {participants.length > 0 && (
              <div className="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="text-emerald-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-emerald-800 font-semibold text-sm">名單準備就緒！</p>
                  <p className="text-emerald-600 text-xs">現在您可以點擊上方導航欄，開始抽籤或自動分組。</p>
                </div>
                <button
                  onClick={onNext}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-600 transition"
                >
                  開始使用
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
