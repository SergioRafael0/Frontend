import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import MainLayout from './components/layouts/MainLayout';
import Login from './pages/login/Login';
import Dashboard from './pages/admin/Dashboard';
import GestionUsuarios from './pages/admin/GestionUsuarios';
import GestionCursos from './pages/admin/GestionCursos';
import GestionAsignaturas from './pages/admin/GestionAsignaturas';
import GestionMatriculas from './pages/admin/GestionMatriculas';
import GestionAsistencias from './pages/admin/GestionAsistencias';
import GestionAnotaciones from './pages/admin/GestionAnotaciones';
import GestionCalificaciones from './pages/admin/GestionCalificaciones';
import MisAsignaturas from './pages/docente/MisAsignaturas';
import RegistroAsistencia from './pages/docente/RegistroAsistencia';
import RegistroAnotaciones from './pages/docente/RegistroAnotaciones';
import RegistroNotas from './pages/docente/RegistroNotas';
import MisCursos from './pages/estudiante/MisCursos';
import MiAsistencia from './pages/estudiante/MiAsistencia';
import MisNotas from './pages/estudiante/MisNotas';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            
            {/* Admin routes */}
            <Route
              path="/usuarios"
              element={<PrivateRoute roles={['ADMIN']}><GestionUsuarios /></PrivateRoute>}
            />
            <Route
              path="/cursos"
              element={<PrivateRoute roles={['ADMIN']}><GestionCursos /></PrivateRoute>}
            />
            <Route
              path="/asignaturas"
              element={<PrivateRoute roles={['ADMIN']}><GestionAsignaturas /></PrivateRoute>}
            />
            <Route
              path="/matriculas"
              element={<PrivateRoute roles={['ADMIN']}><GestionMatriculas /></PrivateRoute>}
            />
            <Route
              path="/asistencias"
              element={<PrivateRoute roles={['ADMIN']}><GestionAsistencias /></PrivateRoute>}
            />
            <Route
              path="/anotaciones"
              element={<PrivateRoute roles={['ADMIN']}><GestionAnotaciones /></PrivateRoute>}
            />
            <Route
              path="/calificaciones"
              element={<PrivateRoute roles={['ADMIN']}><GestionCalificaciones /></PrivateRoute>}
            />

            {/* Docente routes */}
            <Route
              path="/docente/asignaturas"
              element={<PrivateRoute roles={['DOCENTE']}><MisAsignaturas /></PrivateRoute>}
            />
            <Route
              path="/docente/asistencia"
              element={<PrivateRoute roles={['DOCENTE']}><RegistroAsistencia /></PrivateRoute>}
            />
            <Route
              path="/docente/anotaciones"
              element={<PrivateRoute roles={['DOCENTE']}><RegistroAnotaciones /></PrivateRoute>}
            />
            <Route
              path="/docente/notas"
              element={<PrivateRoute roles={['DOCENTE']}><RegistroNotas /></PrivateRoute>}
            />

            {/* Estudiante routes */}
            <Route
              path="/estudiante/cursos"
              element={<PrivateRoute roles={['ESTUDIANTE']}><MisCursos /></PrivateRoute>}
            />
            <Route
              path="/estudiante/asistencia"
              element={<PrivateRoute roles={['ESTUDIANTE']}><MiAsistencia /></PrivateRoute>}
            />
            <Route
              path="/estudiante/notas"
              element={<PrivateRoute roles={['ESTUDIANTE']}><MisNotas /></PrivateRoute>}
            />

            {/* Rol-based redirect */}
            <Route path="/" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
