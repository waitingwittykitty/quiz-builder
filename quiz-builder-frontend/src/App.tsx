import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/scss/main.scss';

import Navbar from './layouts/navbar';
import SignIn from './pages/sign-in';
import SignUp from './pages/sign-up';
import Quizzes from './pages/quizzes';
import Spinner from './components/spinner/spinner';
import authService from './services/auth.service';
import { useAuthContext } from './context/auth-context';

import './styles/index.scss';

function App() {
  const { currentUser, setCurrentUser } = useAuthContext();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();

        setCurrentUser(user);
        setLoaded(true);
      } catch {
        setCurrentUser(null);
        setLoaded(true);
      }
    };

    getCurrentUser();
  }, [setCurrentUser]);

  return (
    <div className="h-full">
      <Spinner visible={!loaded} />

      {loaded && (
        <>
          <Navbar />

          {currentUser ? (
            <Routes>
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="*" element={<Navigate to="quizzes" />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="sign-in" element={<SignIn />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="*" element={<Navigate to="sign-in" />} />
            </Routes>
          )}
        </>
      )}

      <ToastContainer />
    </div>
  );
}

export default App;
