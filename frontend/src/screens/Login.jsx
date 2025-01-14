import React, { useState ,useContext} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import axios from '../config/axios';
import { UserContext } from '../context/user.context';
const Login = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

const [email, setEmail] = useState(''); 
const [password, setPassword] = useState('');
const { setUser } = useContext(UserContext);

const navigate = useNavigate();
function submitHandler(e) {
    e.preventDefault();
    axios.post('/users/login', { email, password })
        .then((res) => {
        console.log('Login successful');
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        // res.status(200)
        navigate('/');
        })
        .catch((err) => {
        console.log(err);
        });
}


  return (
    <div className={darkMode ? 'bg-gray-900 text-black' : 'bg-white text-black'}>
      <div className="flex justify-end p-4">
        <button onClick={toggleTheme} className="px-4 py-2 bg-blue-500 text-white rounded">
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form className="space-y-4" onSubmit={submitHandler}>
            <div>
              <label className="block mb-1">Email</label>
              <input type="email" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <input type="password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-md">Log in</button>
          </form>
          <div className="text-center">
            <p>Don't have an account? <Link to="/register" className="text-blue-500">Create one</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
