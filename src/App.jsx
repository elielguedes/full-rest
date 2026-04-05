import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/loguin';
import Register from './pages/register';
import PrivateRoute from './routes/PrivateRoute';
import Cnes from './pages/cnes';
import UpdateCnes from './pages/cnes/UpdateCnes';
import Dashboard from './pages/daskbord';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/cnes"
          element={
            <PrivateRoute>
              <Cnes />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-cnes"
          element={
            <PrivateRoute>
              <UpdateCnes />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App