import { Routes, Route } from "react-router";


import Layout from "./components/Layout";
import HomePage from "./page/HomePage";
import ImportTraineePage from "./page/Trainee/ImportTraineePage";
import VerifyCertificatePage from "./page/Certificate/PublicCertificatePage";
import ViewTraineePage from "./page/Trainee/ViewTraineePage";

function App() {
  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="trainees-import" element={<ImportTraineePage />} />
          <Route path="trainees-view" element={<ViewTraineePage />}/>
        </Route>
        <Route path="verify" element={<VerifyCertificatePage />} />
      </Routes>
    </div>
  );
}

export default App;

