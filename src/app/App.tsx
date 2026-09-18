import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./layout";
import { defaultModulePath } from "@/config/modules";
import { MembersModule } from "@/modules/members/members-module";
import { ProtectedRoute } from "@/modules/auth/components/ProtectedRoute";
import { AuthProvider } from "@/modules/auth/context/AuthContext";
import { LoginPage } from "@/modules/auth/pages/LoginPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import FamiliesModule from "@/modules/families/families-module";
import DiezmosModule from "@/modules/diezmos/diezmos-module";
import ConfigurationModule from "@/modules/configuration/configuration-module";
import DiezmosReportModule from "@/modules/diezmos-report/diezmos-report-module";
import BautizosModule from "@/modules/bautizos/bautizos-module";
import BirthdaysModule from "@/modules/birthdays/birthdays-module";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route
                        path="/"
                        element={<Navigate to={defaultModulePath} replace />}
                      />
                      <Route path="/members" element={<MembersModule />} />
                      <Route path="/birthdays" element={<BirthdaysModule />} />
                      <Route path="/families" element={<FamiliesModule />} />
                      <Route path="/diezmos" element={<DiezmosModule />} />
                      <Route
                        path="/diezmos-report"
                        element={<DiezmosReportModule />}
                      />
                      <Route path="/bautizos" element={<BautizosModule />} />
                      <Route
                        path="/configuration"
                        element={<ConfigurationModule />}
                      />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
