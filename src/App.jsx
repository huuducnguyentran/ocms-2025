import { Routes, Route } from "react-router";


import Layout from "./components/Layout";
import HomePage from "./page/HomePage";
import ImportTraineePage from "./page/Trainee/ImportTraineePage";

function App() {
  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="trainees-import" element={<ImportTraineePage />}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;

