
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Landing } from './pages/Landing';
import { DocsLayout } from './layouts/DocsLayout';

// Getting Started
import Introduction from './pages/getting-started/Introduction';
import Installation from './pages/getting-started/Installation';
import QuickStart from './pages/getting-started/QuickStart';

// Core Concepts
import Architecture from './pages/concepts/Architecture';
import CliCommands from './pages/concepts/CliCommands';
import Configuration from './pages/concepts/Configuration';

// Features
import Presets from './pages/features/Presets';
import CiTemplates from './pages/features/CiTemplates';
import QualityScore from './pages/features/QualityScore';
import BundleGuardian from './pages/features/BundleGuardian';
import Publishing from './pages/features/Publishing';
import ComponentGenerator from './pages/features/ComponentGenerator';
import MigrationAssistant from './pages/features/MigrationAssistant';
import DocsGenerator from './pages/features/DocsGenerator';
import Features from './pages/Features';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-100 selection:text-brand-900">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/docs/features" element={<Features />} />
          <Route path="/docs" element={<DocsLayout />}>
            <Route index element={<Introduction />} />

            {/* Getting Started */}
            <Route path="introduction" element={<Introduction />} />
            <Route path="installation" element={<Installation />} />
            <Route path="quick-start" element={<QuickStart />} />

            {/* Core Concepts */}
            <Route path="architecture" element={<Architecture />} />
            <Route path="cli-commands" element={<CliCommands />} />
            <Route path="configuration" element={<Configuration />} />

            {/* Features */}
            <Route path="presets" element={<Presets />} />
            <Route path="ci-templates" element={<CiTemplates />} />
            <Route path="quality-score" element={<QualityScore />} />
            <Route path="bundle-guardian" element={<BundleGuardian />} />
            <Route path="publishing" element={<Publishing />} />
            <Route path="component-generator" element={<ComponentGenerator />} />
            <Route path="migration" element={<MigrationAssistant />} />
            <Route path="docs-generator" element={<DocsGenerator />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
