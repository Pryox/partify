import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Notifications } from '@mantine/notifications';

function App() {
  const REFRESH_INTERVAL = 1500;

  return (
    <div className="h-screen w-full">
      <MantineProvider>
        <Notifications />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route index element={<Home refreshInterval={REFRESH_INTERVAL} />} />
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </div>
  );
}

export default App;
