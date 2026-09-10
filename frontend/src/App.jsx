import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewDecision from "./pages/NewDecision";
import DecisionRoom from "./pages/DecisionRoom";
import Decisions from "./pages/Decisions";
import Agents from "./pages/Agents";
import Reports from "./pages/Reports";
import DecisionComparison from "./pages/DecisionComparison";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/new-decision"
            element={<NewDecision />}
          />

          <Route
            path="/decisions"
            element={<Decisions />}
          />

          <Route
            path="/decisions/compare"
            element={<DecisionComparison />}
          />

          <Route
            path="/decisions/:id"
            element={<DecisionRoom />}
          />

          <Route
            path="/agents"
            element={<Agents />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;