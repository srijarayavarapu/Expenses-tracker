import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ExpenseTracker from './components/ExpenseTracker';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get('http://localhost:5000/users')
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!username || !password || !balance) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    const newUser = { username, password, balance, expenses: [] };
    axios
      .post('http://localhost:5000/users', newUser)
      .then((response) => {
        setUsers([...users, response.data]);
        alert('User created successfully');
        setErrorMessage('');
      })
      .catch((error) => console.error('Error signing up:', error));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage('Please enter username and password');
      return;
    }
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      setLoggedInUser(user);
      setBalance(user.balance);
      alert('Logged in successfully');
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUsername('');
    setPassword('');
    setBalance(0);
    setErrorMessage('');
  };

  return (
    <div className="app-container">
      <Navbar
        loggedInUser={loggedInUser}
        handleLogout={handleLogout}
        setIsSignUp={setIsSignUp}
      />
      <div className="content">
        {!loggedInUser ? (
          isSignUp ? (
            <SignUp
              handleSignUp={handleSignUp}
              setUsername={setUsername}
              setPassword={setPassword}
              setBalance={setBalance}
              errorMessage={errorMessage}
              toggleLogin={() => setIsSignUp(false)}
            />
          ) : (
            <Login
              handleLogin={handleLogin}
              setUsername={setUsername}
              setPassword={setPassword}
              errorMessage={errorMessage}
              toggleSignUp={() => setIsSignUp(true)}
            />
          )
        ) : (
          <ExpenseTracker
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser}
            balance={balance}
            setBalance={setBalance}
          />
        )}
      </div>
    </div>
  );
}
export default App;