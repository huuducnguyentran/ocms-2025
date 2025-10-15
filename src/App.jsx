import { Routes, Route } from "react-router";


import Layout from "./components/Layout";
import HomePage from "./page/HomePage";
import ImportTraineePage from "./page/Trainee/ImportTraineePage";
import VerifyCertificatePage from "./page/Certificate/PublicCertificatePage";

function App() {
  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="trainees-import" element={<ImportTraineePage />}/>
        </Route>
        <Route path="verify" element={<VerifyCertificatePage />} />
      </Routes>
    </div>
  );
}

export default App;

