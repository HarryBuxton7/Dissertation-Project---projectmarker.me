import React, { useContext, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { RegisterPage } from "./pages/RegisterPage";
import { UploadPage } from "./pages/UploadPage";
import { UpdatePaperPage } from "./pages/UpdatePaperPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { Container } from "@mui/material";
import { ProjectInspectionPage } from "./pages/ProjectInspectionPage";
import { ProjectDemonstrationPage } from "./pages/ProjectDemonstrationPage";
import { BlindMarkingPage } from "./pages/BlindMarkingPage";
import { SupervisorFeedbackPage } from "./pages/SupervisorFeedbackPage";
import { FirstResolutionPage } from "./pages/FirstResolutionPage";
import { SecondResolutionPage } from "./pages/SecondResolutionPage";
import { AdminHomePage } from "./pages/AdminHomePage";
import { AdminAddThirdMarkerPage } from "./pages/AdminAddThirdMarkerPage";
import { AdminPaperPage } from "./pages/AdminPaperPage";

export const TokenContext = React.createContext(null);

const ProtectedRoute = ({ element }) => {
  const [token] = useContext(TokenContext);
  return token ? element : <Navigate to="/login" />;
};

const AdminProtectedRoute = ({ element }) => {
  const [token, , , , , , admin] = useContext(TokenContext);
  return token && admin ? element : <Navigate to="/login" />;
};

const queryClient = new QueryClient();

function App() {
  const [token, setToken] = useState(null);
  const [userID, setUserId] = useState(null);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [cohorts, setCohorts] = useState(null);
  const [completed, setCompleted] = useState(false);

  return (
    <div className="App">
      <Container maxWidth="xl">
        <QueryClientProvider client={queryClient}>
        <TokenContext.Provider
            value={[
              token,
              setToken,
              userID,
              setUserId,
              selectedCohort,
              setSelectedCohort,
              admin,
              setAdmin,
              cohorts,
              setCohorts,
              completed,
              setCompleted,
            ]}
          >
            <Routes>
              <Route
                path="/"
                element={<ProtectedRoute element={<HomePage />} />}
              />
              <Route
                path="/upload"
                element={<AdminProtectedRoute element={<UploadPage />} />}
              />
              <Route
                path="/UpdatePaper/:fileID"
                element={<ProtectedRoute element={<UpdatePaperPage />} />}
              />
              <Route
                path="/ProjectInspection/:fileID"
                element={<ProtectedRoute element={<ProjectInspectionPage />} />}
              />
              <Route
                path="/ProjectDemonstration/:fileID"
                element={
                  <ProtectedRoute element={<ProjectDemonstrationPage />} />
                }
              />
              <Route
                path="/BlindMarking/:fileID"
                element={<ProtectedRoute element={<BlindMarkingPage />} />}
              />
              <Route
                path="/SupervisorFeedback/:fileID"
                element={
                  <ProtectedRoute element={<SupervisorFeedbackPage />} />
                }
              />
              <Route
                path="/FirstResolution/:fileID"
                element={<ProtectedRoute element={<FirstResolutionPage />} />}
              />
              <Route
                path="/SecondResolution/:fileID"
                element={<ProtectedRoute element={<SecondResolutionPage />} />}
              />
              <Route
                path="/admin"
                element={<AdminProtectedRoute element={<AdminHomePage />} />}
              />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route
                path="/AddThirdMarker/:fileID"
                element={<AdminProtectedRoute element={<AdminAddThirdMarkerPage />} />}
              />
              <Route
                path="/paper/:fileID"
                element={<AdminProtectedRoute element={<AdminPaperPage />} />}
              />
            </Routes>
          </TokenContext.Provider>
        </QueryClientProvider>
      </Container>
    </div>
  );
}

export default App;
