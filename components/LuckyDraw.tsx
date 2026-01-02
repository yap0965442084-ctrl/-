
import React, { useState, useEffect, useRef } from 'react';
import { Gift, RotateCcw, UserCheck, Play, History, Trophy } from 'lucide-react';
import { Participant } from '../types';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

interface LuckyDrawProps {
  participants: Participant[];
}

export const LuckyDraw: React.FC<LuckyDrawProps> = ({ participants }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [displayNames, setDisplayNames] = useState<string[]>([]);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [history, setHistory] = useState<Participant[]>([]);
  const [availableList, setAvailableList] = useState<Participant[]>(participants);

  useEffect(() => {
    setAvailableList(participants);
    setHistory([]);
    setWinner(null);
  }, [participants]);

  const startDraw = () => {
    if (isDrawing) return;
    
    let pool = allowRepeat ? participants : availableList;
    
    if (pool.length === 0) {
      alert('所有參與者都已經抽過了！請重置或更改設定。');
      return;
    }

    setIsDrawing(true);
    setWinner(null);

    const animationNames = Array.from({ length: 40 }, () => {
      return pool[Math.floor(Math.random() * pool.length)].name;
    });
    
    const finalWinner = pool[Math.floor(Math.random() * pool.length)];
    animationNames.push(finalWinner.name);
    setDisplayNames(animationNames);

    setTimeout(() => {
      setIsDrawing(false);
      setWinner(finalWinner);
      setHistory(prev => [finalWinner, ...prev]);
      
      if (!allowRepeat) {
        setAvailableList(prev => prev.filter(p => p.id !== finalWinner.id));
      }

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b']
      });
    }, 2000);
  };

  const resetDraw = () => {
    setAvailableList(participants);
    setHistory([]);
    setWinner(null);
    setDisplayNames([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-50 rounded-full opacity-50 pointer-events-none"></div>
            
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 relative">
              <Gift className="text-indigo-600 w-8 h-8" />
              驚喜大抽籤
            </h2>

            <div className="relative h-40 bg-slate-900 rounded-2xl flex flex-col items-center justify-center overflow-hidden border-4 border-slate-800 shadow-inner mb-8">
              {isDrawing ? (
                <div className="w-full text-center space-y-2 slot-animation">
                  {displayNames.map((name, i) => (
                    <div key={i} className="text-3xl font-bold text-white py-2 opacity-80">{name}</div>
                  ))}
                </div>
              ) : winner ? (
                <div className="flex flex-col items-center animate-bounce">
                  <Trophy className="text-yellow-400 w-12 h-12 mb-2" />
                  <span className="text-4xl font-black text-white tracking-wider">{winner.name}</span>
                </div>
              ) : (
                <div className="text-slate-500 text-xl font-medium">點擊按鈕開始</div>
              )}
              <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-slate-900 to-transparent pointer-events-none z-10"></div>
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none z-10"></div>
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-16 border-y-2 border-indigo-500/30 pointer-events-none"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={allowRepeat}
                      onChange={(e) => setAllowRepeat(e.target.checked)}
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${allowRepeat ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${allowRepeat ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-700 select-none">允許重複中獎</span>
                </label>
                <p className="text-xs text-slate-400">目前剩餘：{availableList.length} 位可抽</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={startDraw}
                  disabled={isDrawing || (availableList.length === 0 && !allowRepeat)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95 ${
                    isDrawing ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                  }`}
                >
                  {isDrawing ? <div className="w-6 h-6 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div> : <Play className="w-6 h-6" />}
                  {isDrawing ? '正在抽取...' : '啟動抽籤'}
                </button>
                
                <button
                  onClick={resetDraw}
                  className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"
                  title="重置"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full max-h-[500px]">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <History className="text-indigo-600" />
              中獎歷史
            </h3>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
              {history.length > 0 ? (
                history.map((h, i) => (
                  <div key={`${h.id}-${i}`} className="bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-100 animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {history.length - i}
                      </div>
                      <span className="font-semibold text-slate-700">{h.name}</span>
                    </div>
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                    <Gift className="opacity-20" />
                  </div>
                  <p className="text-sm">尚無紀錄</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
