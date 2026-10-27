/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store';

// Captura o id de indicação (?am_id=<jornada_id> de quem indicou) e persiste até o cadastro
const refId = new URLSearchParams(window.location.search).get('am_id');
if (refId) {
  localStorage.setItem('ikigai_ref', refId);
}
import Home from './pages/Home';
import Layout from './components/Layout';
import GuideSelection from './pages/GuideSelection';
import Mission1 from './pages/Mission1';
import Mission2 from './pages/Mission2';
import Mission3 from './pages/Mission3';
import Mission4 from './pages/Mission4';
import Mission5 from './pages/Mission5';
import Mission6 from './pages/Mission6';
import Mission7 from './pages/Mission7';
import SaveResult from './pages/SaveResult';
import ResultDashboard from './pages/ResultDashboard';
import DeepReport from './pages/DeepReport';
import AdminSettings from './pages/AdminSettings';
import SatisfactionSurvey from './pages/SatisfactionSurvey';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminSettings />} />
          <Route path="/comecar" element={<Layout />}>
            <Route path="guia" element={<GuideSelection />} />
            <Route path="fase/1" element={<Mission1 />} />
            <Route path="fase/2" element={<Mission2 />} />
            <Route path="fase/3" element={<Mission3 />} />
            <Route path="fase/4" element={<Mission4 />} />
            <Route path="fase/5" element={<Mission5 />} />
            <Route path="fase/6" element={<Mission6 />} />
            <Route path="fase/7" element={<Mission7 />} />
            <Route path="salvar" element={<SaveResult />} />
            <Route path="pesquisa" element={<SatisfactionSurvey />} />
          </Route>
          <Route path="/resultado/:id" element={<ResultDashboard />} />
          <Route path="/relatorio/:id" element={<DeepReport />} />
          <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
          <Route path="/termos-de-uso" element={<TermsOfUse />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
