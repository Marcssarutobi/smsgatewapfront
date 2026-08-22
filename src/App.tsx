import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { DocsPage } from './pages/DocsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TwoFactorPage } from './pages/TwoFactorPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { EmailVerifiedPage } from './pages/EmailVerifiedPage';
import { GoogleCallbackPage } from './pages/GoogleCallbackPage';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminDevicesPage } from './pages/admin/AdminDevicesPage';
import { AdminSmsLogsPage } from './pages/admin/AdminSmsLogsPage';
import { AdminApiKeysPage } from './pages/admin/AdminApiKeysPage';
import { AdminWebhooksPage } from './pages/admin/AdminWebhooksPage';
import { AdminOrganisationPage } from './pages/admin/AdminOrganisationPage';
import { AdminSubscriptionPage } from './pages/admin/AdminSubscriptionPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { SubscriptionCallbackPage } from './pages/admin/SubscriptionCallbackPage';
import ProtectedRoute from './router/ProtectedRoute';
import AdminOnlyRoute from './router/AdminOnlyRoute';
import { AdminSendTestSmsPage } from './pages/admin/AdminSendTestSmsPage';
import { PlatformAdminPage } from './pages/admin/PlatformAdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with Main Header/Footer */}
        <Route
          path="/"
          element={
            <MainLayout>
              <LandingPage />
            </MainLayout>
          }
        />
        <Route
          path="/docs"
          element={
            <MainLayout>
              <DocsPage />
            </MainLayout>
          }
        />
        <Route
          path="/privacy"
          element={
            <MainLayout>
              <PrivacyPage />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <ContactPage />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <MainLayout>
              <LoginPage />
            </MainLayout>
          }
        />
        <Route
          path="/register"
          element={
            <MainLayout>
              <RegisterPage />
            </MainLayout>
          }
        />
        <Route
          path="/2fa"
          element={
            <MainLayout>
              <TwoFactorPage />
            </MainLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <MainLayout>
              <ForgotPasswordPage />
            </MainLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <MainLayout>
              <ResetPasswordPage />
            </MainLayout>
          }
        />
        <Route
          path="/email-verified"
          element={
            <MainLayout>
              <EmailVerifiedPage />
            </MainLayout>
          }
        />
        <Route
          path="/auth/google/callback"
          element={
            <MainLayout>
              <GoogleCallbackPage />
            </MainLayout>
          }
        />

        <Route element={<ProtectedRoute />}>
          {/* Admin Routes with Sidebar Layout */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminOverviewPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/devices"
            element={
              <AdminLayout>
                <AdminDevicesPage />
              </AdminLayout>
            }
          />
          <Route 
            path="/admin/send-test" 
            element={
              <AdminLayout>
                <AdminSendTestSmsPage />
              </AdminLayout>
            } 
          />
          <Route
            path="/admin/sms-logs"
            element={
              <AdminLayout>
                <AdminSmsLogsPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/api-keys"
            element={
              <AdminLayout>
                <AdminApiKeysPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/webhooks"
            element={
              <AdminLayout>
                <AdminWebhooksPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/organisation"
            element={
              <AdminLayout>
                <AdminOrganisationPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/abonnement"
            element={
              <AdminLayout>
                <AdminSubscriptionPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminLayout>
                <AdminSettingsPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/subscription/callback"
            element={
              <AdminLayout>
                <SubscriptionCallbackPage />
              </AdminLayout>
            }
          />
        </Route>

        {/* Panneau super-admin : réservé au staff plateforme (role 'Admin'),
            route distincte de /admin/* qui reste le compte de l'utilisateur */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminOnlyRoute />}>
            <Route
              path="/staff"
              element={
                <AdminLayout>
                  <PlatformAdminPage />
                </AdminLayout>
              }
            />
          </Route>
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
