import { registerUser, verifyRegistration } from '../api/authApi';
import { startRegistration } from '@simplewebauthn/browser';
import { useNavigate } from 'react-router';
import { useState } from 'react';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleRegister = async () => {
    try {
      const { data: options } = await registerUser(username);
      const attestationResponse = await startRegistration(options);

      await verifyRegistration(username, attestationResponse);

      navigate('/login');
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  return (
    <div>
      <h2>Register with Passkey</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose username" />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default RegisterPage;
