import { Routes, Route } from 'react-router-dom';
import UsersView from './UsersView';
import UserForm from './UserForm';
import { RequireRole } from '../../utils/RequireRole';


export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <RequireRole roles={['admin', 'moderador']}>
          <UsersView />
        </RequireRole>
      } 
        />
      <Route path="/crear" element={
        <RequireRole roles={['admin']}>
          <UserForm />
        </RequireRole>
        } />
      <Route path="/editar/:id" element={<UserForm />} />
    </Routes>
  );
}
