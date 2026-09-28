/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EduTrackProvider, useEduTrack } from './context/EduTrackContext';
import { Layout } from './components/layout/Layout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Students } from './pages/Students';
import { Teachers } from './pages/Teachers';
import { Classes } from './pages/Classes';
import { Subjects } from './pages/Subjects';
import { Attendance } from './pages/Attendance';
import { Exams } from './pages/Exams';
import { Grades } from './pages/Grades';
import { Fees } from './pages/Fees';
import { Parents } from './pages/Parents';
import { Timetable } from './pages/Timetable';
import { Notices } from './pages/Notices';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useEduTrack();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route Guard (redirect to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useEduTrack();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <EduTrackProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Route */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Authenticated Dashboard & MIS Management Shell */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="classes" element={<Classes />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="exams" element={<Exams />} />
            <Route path="grades" element={<Grades />} />
            <Route path="fees" element={<Fees />} />
            <Route path="parents" element={<Parents />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="notices" element={<Notices />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </EduTrackProvider>
  );
}
