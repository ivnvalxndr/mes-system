import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layout
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';

// Pages
import DashboardPage from './pages/DashboardPage';
import MaterialsPage from './pages/MaterialsPage';
import ProductionPage from './pages/ProductionPage';
import WarehousesPage from './pages/WarehousesPage';
import SidebarEnhanced from './components/Layout/SidebarEnhanced';
import SidebarWithDropdown from './components/Layout/SidebarWithDropdown';

// Создаем тему
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flexGrow: 1 }}>
              <Topbar />
              <main style={{ padding: '24px' }}>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/materials" element={<MaterialsPage />} />
                  <Route path="/production/*" element={<ProductionPage />} />
                  <Route path="/warehouses" element={<WarehousesPage />} />
				  <Route path="/test-sidebar" element={
  <div style={{ display: 'flex' }}>
    <SidebarWithDropdown />
    <div style={{ flexGrow: 1, padding: '20px' }}>
      <h1>Тест SidebarWithDropdown</h1>
      <p>Если видите сайдбар слева - он работает!</p>
    </div>
  </div>
} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;