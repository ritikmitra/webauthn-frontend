import { useState } from 'react';
import { useNavigate } from 'react-router';
import { generateRegisterUser, verifyRegistrationUser, registerUser } from '../api/authApi';
import { startRegistration } from '@simplewebauthn/browser';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNormalRegister = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password);
      navigate('/login');
    } catch (error) {
      console.error('Normal registration failed:', error);
      toast.error('Registration failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyRegister = async () => {

    let options
    if (!email) {
      toast.error('Please enter your email to use Passkey registration.');
      return;
    }

    setLoading(true);
    try {
      const response = await generateRegisterUser(email);

      options  = response.data.options;

      if (response.status === 400){
        console.error('Passkey registration failed:', response.data.message);
        toast.error(response.data.message);
        return;
      }
      if (response.status === 409){
        console.error('Passkey registration failed:', response.data.message);
        console.log(response);
        toast.error(response.data.message);
        options = response.data.data;
      }


      const attestationResponse = await startRegistration({optionsJSON: options});

      if (!attestationResponse) {
        console.error('User canceled the WebAuthn registration');
        return;
      }

      await verifyRegistrationUser(email, attestationResponse);
      navigate('/login');
    } catch (error) {
      console.error('Passkey registration failed:', error);
     
      toast.error(`Passkey login failed ${JSON.stringify(error)}`); 

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

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
            autoComplete='current-password webauthn'
          />
        </div>

        <button
          onClick={handleNormalRegister}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 mb-4"
        >
          {loading ? 'Registering...' : 'Sign Up'}
        </button>

        <button
          onClick={handlePasskeyRegister}
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Registering...' : 'Sign Up Using Passkey'}
        </button>

        <div className="mt-4 text-center">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-blue-600">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
