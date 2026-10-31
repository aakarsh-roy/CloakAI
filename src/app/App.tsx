import React, { useState } from 'react';
import { Navbar, ActiveTab } from '../components/layout/Navbar.tsx';
import { Footer } from '../components/layout/Footer.tsx';
import { WorkspacePage } from '../pages/WorkspacePage.tsx';
import { LandingPage } from '../pages/LandingPage.tsx';
import { SettingsPage } from '../pages/SettingsPage.tsx';
import { PrivacyPage } from '../pages/PrivacyPage.tsx';
import { loadSettings } from '../core/settings.ts';
import { PrivacySettings } from '../core/types.ts';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('workspace');
  const [settings, setSettings] = useState<PrivacySettings>(() => loadSettings());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500/30 selection:text-brand-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        {activeTab === 'workspace' && <WorkspacePage settings={settings} />}
        {activeTab === 'landing' && (
          <LandingPage
            onOpenWorkspace={() => setActiveTab('workspace')}
            onOpenPrivacy={() => setActiveTab('privacy')}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsPage settings={settings} setSettings={setSettings} />
        )}
        {activeTab === 'privacy' && (
          <PrivacyPage onOpenWorkspace={() => setActiveTab('workspace')} />
        )}
      </main>

      <Footer onOpenPrivacy={() => setActiveTab('privacy')} />
    </div>
  );
};

export default App;
