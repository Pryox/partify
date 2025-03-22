import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Errors } from './pages/Errors';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/errors" element={<Errors />} />
        <Route index element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
