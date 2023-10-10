import React from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import EditUserPage from './pages/EditUserPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ResetRequestPage from './pages/ResetRequestPage';
import ResetPage from './pages/ResetPage';
import FlashProvider from './contexts/FlashProvider';
import APIProvider from './contexts/APIProvider';
import UserProvider from './contexts/UserProvider';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';



export default function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <FlashProvider>
          <APIProvider>
            <UserProvider>
              <Header />
              <Routes>
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><RegistrationPage /></PublicRoute>} />
                <Route path="/reset-request" element={<PublicRoute><ResetRequestPage /></PublicRoute>} />
                <Route path="/reset" element={<PublicRoute><ResetPage /></PublicRoute>} />
                <Route path="*" element={
                  <PrivateRoute>
                    <Routes>
                      <Route path="/" element={<FeedPage />} />
                      <Route path="/explore" element={<ExplorePage />} />
                      <Route path="/user/:username" element={<UserPage />} />
                      <Route path="/edit" element={<EditUserPage />} />
                      <Route path="/password" element={<ChangePasswordPage />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </PrivateRoute>
                }/>
              </Routes>
            </UserProvider>
          </APIProvider>
        </FlashProvider>
      </BrowserRouter>
    </Container>
  );
}