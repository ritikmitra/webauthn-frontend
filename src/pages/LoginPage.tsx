import { useState } from 'react';
import { useNavigate } from 'react-router';
import { generateAuthenticationLoginUser, verifyLoginUser, loginUser } from '../api/authApi';
import { startAuthentication } from '@simplewebauthn/browser';
import { useAuth } from '../auth';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleNormalLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(email, password); // Assuming your API expects both
      login(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Normal login failed:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    if (!email) {
      toast.error('Please enter your email to use Passkey login.');
      return;
    }

    setLoading(true);
    try {
      const response = await generateAuthenticationLoginUser(email);
      const { options } = response.data;

      const assertionResponse = await startAuthentication({optionsJSON: options});

      if (!assertionResponse) {
        toast.error('User canceled the WebAuthn prompt');
        return;
      }

      await verifyLoginUser(email, assertionResponse);
      toast.success('Login successful!');
      login(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      toast.error(`Passkey login failed ${error}`); 
      console.error('Passkey login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-2 p-2 w-full border border-gray-300 rounded-md text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete='email webauthn'
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="mt-2 p-2 w-full border border-gray-300 rounded-md text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          onClick={handleNormalLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 mb-4"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <button
          onClick={handlePasskeyLogin}
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Authenticating...' : 'Sign In Using Passkey'}
        </button>

        <div className="mt-4 text-center">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
