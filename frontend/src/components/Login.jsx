import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { data: response } = await axios.post('/api/auth/login', data, { withCredentials: true });
      if (response.success) {
        login(response.user);
        toast.success('Welcome back');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-400">Sign in to continue your conversations.</p>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input className="input input-bordered w-full bg-slate-950" placeholder="Email" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-sm text-rose-400">{errors.email.message}</p>}

          <input type="password" className="input input-bordered w-full bg-slate-950" placeholder="Password" {...register('password', { required: 'Password is required' })} />
          {errors.password && <p className="text-sm text-rose-400">{errors.password.message}</p>}

          <button className="btn btn-primary w-full">Log in</button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          New here? <Link to="/signup" className="text-sky-400">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
