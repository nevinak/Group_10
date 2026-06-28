import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { data: response } = await axios.post('/api/auth/signup', data, { withCredentials: true });
      if (response.success) {
        login(response.user);
        toast.success('Account created');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold">Create your account</h2>
        <p className="mt-2 text-sm text-slate-400">Start chatting in seconds.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input className="input input-bordered w-full bg-slate-950" placeholder="Full name" {...register('fullName', { required: 'Full name is required' })} />
          {errors.fullName && <p className="text-sm text-rose-400">{errors.fullName.message}</p>}

          <input className="input input-bordered w-full bg-slate-950" placeholder="Email" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-sm text-rose-400">{errors.email.message}</p>}

          <input type="password" className="input input-bordered w-full bg-slate-950" placeholder="Password" {...register('password', { required: 'Password is required', minLength: 6 })} />
          {errors.password && <p className="text-sm text-rose-400">{errors.password.message}</p>}

          <input type="password" className="input input-bordered w-full bg-slate-950" placeholder="Confirm password" {...register('confirmPassword', { required: 'Confirm password is required', validate: (value) => value === watch('password') || 'Passwords do not match' })} />
          {errors.confirmPassword && <p className="text-sm text-rose-400">{errors.confirmPassword.message}</p>}

          <button className="btn btn-primary w-full">Sign up</button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-sky-400">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
