import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useEffect } from 'react';

// Layout
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Children from './pages/Children';
import Growth from './pages/Growth';
import Vaccine from './pages/Vaccine';
import Food from './pages/Food';
import FoodRecommend from './pages/FoodRecommend';
import Books from './pages/Books';
import UserManage from './pages/UserManage';

// Protected Route Component
function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// Admin Route Component
function AdminRoute() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

// Auth Guard for Login Page
function AuthGuard() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Login />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthGuard />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'children',
            element: <Children />,
          },
          {
            path: 'growth',
            element: <Growth />,
          },
          {
            path: 'vaccine',
            element: <Vaccine />,
          },
          {
            path: 'food',
            element: <Food />,
          },
          {
            path: 'food-recommend',
            element: <FoodRecommend />,
          },
          {
            path: 'books',
            element: <Books />,
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        path: '/admin/',
        element: <Layout />,
        children: [
          {
            path: 'users',
            element: <UserManage />,
          },
        ],
      },
    ],
  },
]);
