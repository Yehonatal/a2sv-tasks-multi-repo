import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OpportunitiesDashboard from "./components/pages/OpportunitiesDashboard";
import JobPage from "./components/pages/JobPage";

function App() {
    return (
        <div className="max-w-screen-xl mx-auto lg:p-8">
            <Router>
                <Routes>
                    <Route path="/" element={<OpportunitiesDashboard />} />
                    <Route path="/job/:jobId" element={<JobPage />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
