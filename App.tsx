
import React, { useState, useCallback } from 'react';
import { ParticipantInput } from './components/ParticipantInput';
import { LuckyDraw } from './components/LuckyDraw';
import { GroupGenerator } from './components/GroupGenerator';
import { Participant, ViewType } from './types';
import { Users, Gift, Settings, ClipboardList } from 'lucide-react';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('input');

  const handleUpdateParticipants = (names: string[]) => {
    const newParticipants = names.map((name, index) => ({
      id: `${Date.now()}-${index}`,
      name: name.trim()
    })).filter(p => p.name.length > 0);
    setParticipants(newParticipants);
  };

  const renderContent = () => {
    if (participants.length === 0 && currentView !== 'input') {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <ClipboardList className="w-12 h-12 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">名單為空</h2>
          <p className="text-gray-500 max-w-md mt-2">
            請先在「名單設定」中匯入 CSV 或貼上姓名，才能開始抽籤或分組。
          </p>
          <button 
            onClick={() => setCurrentView('input')}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            前往名單設定
          </button>
        </div>
      );
    }

    switch (currentView) {
      case 'input':
        return <ParticipantInput participants={participants} onUpdate={handleUpdateParticipants} onNext={() => setCurrentView('lucky-draw')} />;
      case 'lucky-draw':
        return <LuckyDraw participants={participants} />;
      case 'grouping':
        return <GroupGenerator participants={participants} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm no-print">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
              HR
            </div>
            <h1 className="text-xl font-bold gradient-text">HR 專業工具箱</h1>
          </div>
          
          <nav className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setCurrentView('input')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'input' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <Settings className="w-4 h-4" />
              名單設定
            </button>
            <button
              onClick={() => setCurrentView('lucky-draw')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'lucky-draw' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <Gift className="w-4 h-4" />
              獎品抽籤
            </button>
            <button
              onClick={() => setCurrentView('grouping')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentView === 'grouping' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <Users className="w-4 h-4" />
              自動分組
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-200 bg-white no-print">
        © 2024 HR Pro Toolbox - 專業人力資源管理輔助工具
      </footer>
    </div>
  );
};

export default App;
