import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from "./pages/LoginPage";
import ClientListPage from "./pages/lists/ClientListPage";
import LizingSubjectPage from "./pages/lists/LizingSubjectPage";
import LizingContractPage from "./pages/lists/LizingContractPage";
import ClientFormPage from "./pages/forms/ClientFormPage";
import LizingSubjectFormPage from "./pages/forms/LizingSubjectFormPage";
import LizingContractFormPage from "./pages/forms/LizingContractFormPage";
import CloseFormPage from "./pages/forms/CloseFormPage";


const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("authenticated");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated
      navigate("/");
    }
  }, [isAuthenticated, navigate]);


  return element;
};

function App() {
  
    return (
      <div className="name">
      
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/client-list"
            element={<ProtectedRoute element={<ClientListPage />} />}
          />
          <Route
            path="/leasing-subject-list"
            element={<ProtectedRoute element={<LizingSubjectPage />} />}
          />
          <Route
            path="/leasing-contract-list"
            element={<ProtectedRoute element={<LizingContractPage />} />}
          />
          <Route
            path="/new-leasing-subject"
            element={<ProtectedRoute element={<LizingSubjectFormPage />} />}
          />
          <Route
            path="/new-leasing-contract"
            element={<ProtectedRoute element={<LizingContractFormPage />} />}
          />
          <Route
            path="/new-client"
            element={<ProtectedRoute element={<ClientFormPage />} />}
          />
          <Route path="/new-client/:id" 
          element={<ProtectedRoute element={<ClientFormPage />} />}
          />
         <Route
            path="/new-leasing-subject/:id"
            element={<ProtectedRoute element={<LizingSubjectFormPage />} />}
          />
        
        <Route
            path="/new-leasing-contract/:id"
            element={<ProtectedRoute element={<LizingContractFormPage />} />}
          />


        <Route
            path="/close-form/:id"
            element={<ProtectedRoute element={<CloseFormPage />} />}
          />
       
        </Routes>

        
      </Router>
      </div>
    );
}

export default App;
