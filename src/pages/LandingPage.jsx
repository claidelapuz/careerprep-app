import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';
import { Menu, X, Eye, EyeOff } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      if (data?.user) {
        setSuccess('Login successful! Welcome back!');
        setFormData({ email: '', password: '', fullName: '', confirmPassword: '' });
        
        setTimeout(() => {
          setShowModal(null);
          setSuccess('');
          navigate('/dashboard');
        }, 1000);
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('Please verify your email address before logging in.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters');
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (signUpError) throw signUpError;

      if (data?.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          setError('This email is already registered. Please login instead.');
        } else {
          // Auto-confirm the user immediately after registration
          await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });
          
          setSuccess('Account created successfully! Redirecting to dashboard...');
          
          setTimeout(() => {
            setShowModal(null);
            setSuccess('');
            navigate('/dashboard');
          }, 1500);
        }
        
        setFormData({ email: '', password: '', fullName: '', confirmPassword: '' });
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.message.includes('already registered')) {
        setError('This email is already registered. Please login instead.');
      } else if (err.message.includes('User already registered')) {
        setError('This email is already registered. Please login instead.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(null);
    setShowPassword(false);
    setError('');
    setSuccess('');
    setFormData({ email: '', password: '', fullName: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-100 to-green-50 flex flex-col">
      <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src="/logo.jpg"
              alt="CareerPrep Logo"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl shadow-lg"
            />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
              CareerPrep
            </span>
          </div>

          <div className="hidden sm:flex space-x-4">
            <button 
              onClick={() => setShowModal('login')}
              className="px-4 sm:px-6 py-2 text-gray-700 font-medium hover:text-green-600 transition"
            >
              Login
            </button>
            <button 
              onClick={() => setShowModal('register')}
              className="px-4 sm:px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition shadow-lg hover:shadow-xl"
            >
              Sign Up
            </button>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 text-gray-700"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 pb-4 space-y-3">
            <button 
              onClick={() => {
                setShowModal('login');
                setMobileMenuOpen(false);
              }}
              className="block w-full px-4 py-3 text-left text-gray-700 font-medium hover:bg-green-50 rounded-lg transition"
            >
              Login
            </button>
            <button 
              onClick={() => {
                setShowModal('register');
                setMobileMenuOpen(false);
              }}
              className="block w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-center rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition shadow-lg"
            >
              Sign Up
            </button>
          </div>
        )}
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-20 flex-grow flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
            Build Your Perfect Resume
            <br />
            <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">Land Your Dream Job</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-10 max-w-2xl mx-auto px-4">
            Create professional, ATS-friendly resumes in minutes. Stand out from the crowd and accelerate your career growth.
          </p>
          <button 
            onClick={() => setShowModal('register')}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-base sm:text-lg rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
          >
            Start Building Free
          </button>
        </div>
      </div>

      <footer className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 border-t border-gray-200 mt-auto">
        <div className="text-center text-gray-600 text-sm sm:text-base">
          <p>&copy; 2025 CareerPrep. Build your future with confidence.</p>
        </div>
      </footer>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 py-8">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          <div className="relative w-full max-w-md">
            <button
              onClick={closeModal}
              disabled={loading}
              className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition disabled:opacity-50"
            >
              <X size={20} />
            </button>

            {showModal === 'login' && (
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-green-100">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 mb-3 sm:mb-4">
                    <img
                      src="/logo.jpg"
                      alt="CareerPrep Logo"
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl shadow-lg"
                    />
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
                      CareerPrep
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Hey,<br />Login Now!
                </h2>
                
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">
                  <button 
                    onClick={() => setShowModal('login')}
                    disabled={loading}
                    className="text-green-600 font-semibold"
                  >
                    I Am A Old User
                  </button>
                  <span>/</span>
                  <button 
                    onClick={() => {
                      setShowModal('register');
                      setError('');
                      setSuccess('');
                    }}
                    disabled={loading}
                    className="text-gray-600 hover:text-green-600 transition disabled:opacity-50"
                  >
                    Create New
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-stone-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition focus:ring-2 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-stone-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition focus:ring-2 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? 'Logging in...' : 'Login Now'}
                  </button>

                  <button
                    onClick={closeModal}
                    disabled={loading}
                    className="w-full py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 font-medium hover:text-green-600 transition disabled:opacity-50"
                  >
                    Skip Now
                  </button>
                </div>
              </div>
            )}

            {showModal === 'register' && (
              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-green-100">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 mb-3 sm:mb-4">
                    <img
                      src="/logo.jpg"
                      alt="CareerPrep Logo"
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl shadow-lg"
                    />
                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-700 bg-clip-text text-transparent">
                      CareerPrep
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Welcome,<br />Create Account!
                </h2>
                
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">
                  <button 
                    onClick={() => {
                      setShowModal('login');
                      setError('');
                      setSuccess('');
                    }}
                    disabled={loading}
                    className="text-gray-600 hover:text-green-600 transition disabled:opacity-50"
                  >
                    I Am A Old User
                  </button>
                  <span>/</span>
                  <button 
                    onClick={() => setShowModal('register')}
                    disabled={loading}
                    className="text-green-600 font-semibold"
                  >
                    Create New
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-stone-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition focus:ring-2 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-stone-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition focus:ring-2 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-stone-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition focus:ring-2 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <div>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={loading}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-stone-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition focus:ring-2 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>

                  <button
                    onClick={closeModal}
                    disabled={loading}
                    className="w-full py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 font-medium hover:text-green-600 transition disabled:opacity-50"
                  >
                    Skip Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}