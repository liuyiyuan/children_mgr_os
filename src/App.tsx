import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/index';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManage from './pages/UserManage';
import ChildrenManage from './pages/ChildrenManage';
import GrowthRecord from './pages/GrowthRecord';
import VaccineRecord from './pages/VaccineRecord';
import FoodSystem from './pages/FoodSystem';
import Books from './pages/Books';
import { useAuthStore } from './stores/authStore';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManage />} />
            <Route path="children" element={<ChildrenManage />} />
            <Route path="growth" element={<GrowthRecord />} />
            <Route path="vaccine" element={<VaccineRecord />} />
            <Route path="food" element={<FoodSystem />} />
            <Route path="books" element={<Books />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default App;
