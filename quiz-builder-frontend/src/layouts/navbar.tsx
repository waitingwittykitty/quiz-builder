import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/auth-context';
import authService from '../services/auth.service';

function Navbar() {
  const { currentUser, setCurrentUser } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    await authService.signOut();
    setCurrentUser(null);
    navigate('/sign-in');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="brand">
          <Link to="/quizzes" className="navbar-brand">
            Quiz Builder
          </Link>
        </div>

        <ul className="nav-list">
          {currentUser && (
            <li className="nav-item">
              <NavLink to="/quizzes" className="nav-link">
                Quizzes
              </NavLink>
            </li>
          )}

          {currentUser ? (
            <li className="nav-item">
              <Link to="/sign-in" className="nav-link" onClick={handleSignOut}>
                Sign Out
              </Link>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <NavLink to="/sign-in" className="nav-link">
                  Sign In
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/sign-up" className="nav-link">
                  Sign Up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
