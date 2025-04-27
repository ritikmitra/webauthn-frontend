import { useAuth } from '../auth';
import { loginUser, verifyLogin } from '../api/authApi';
import { startAuthentication } from '@simplewebauthn/browser';
import { useNavigate } from 'react-router';
import { useState } from 'react';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleLogin = async () => {
    try {
      const { data: options } = await loginUser(username);
      const assertionResponse = await startAuthentication(options);

      const { data } = await verifyLogin(username, assertionResponse);

      login(data.accessToken); // save JWT
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div>
      <h2>Login with Passkey</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
