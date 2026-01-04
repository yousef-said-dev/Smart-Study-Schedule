import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerSchema } from '../utils/validationSchemas';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!auth) {
    return <div className="text-red-400 p-8 glass-card">AuthProvider not found.</div>;
  }

  const { register } = auth;

  const handleSubmit = async (values, { setErrors }) => {
    setIsSubmitting(true);
    try {
      await register(values);
      toast.success('Inauguration complete. Node initialized.');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Initialization failed';
      setErrors({ api: message });
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>

      <div className="glass-card w-full max-w-md p-10 relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto mb-6 transform hover:rotate-12 transition-transform">
            <span className="text-3xl text-white font-bold">✨</span>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 title-gradient uppercase tracking-tight">Create Node</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Initialize your focus flow</p>
        </div>

        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ errors }) => (
            <Form className="space-y-6">
              {errors.api && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase text-center animate-fade-in">
                  ⚠️ {errors.api}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Display Alias</label>
                <Field
                  name="name"
                  type="text"
                  className="glass-input"
                  placeholder="Operative Name"
                  disabled={isSubmitting}
                />
                <ErrorMessage name="name" component="div" className="mt-2 text-[10px] text-red-400 font-bold" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Com-Link Address</label>
                <Field
                  name="email"
                  type="email"
                  className="glass-input"
                  placeholder="name@domain.com"
                  disabled={isSubmitting}
                />
                <ErrorMessage name="email" component="div" className="mt-2 text-[10px] text-red-400 font-bold" />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Security Cipher</label>
                <Field
                  name="password"
                  type="password"
                  className="glass-input"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
                <ErrorMessage name="password" component="div" className="mt-2 text-[10px] text-red-400 font-bold" />
              </div>

              <button
                type="submit"
                className={`w-full glass-btn-primary py-4 text-sm uppercase tracking-widest font-black ${isSubmitting ? 'opacity-50' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Initializing Node...' : 'Register Operative'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-10">
          <p className="text-slate-500 text-xs font-bold uppercase">
            Already active?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-white transition-colors">
              Access Node
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;