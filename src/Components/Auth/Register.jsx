import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/register', data);
      alert("Registration successful!");
      console.log(response.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-sky-200'>
      <form onSubmit={handleSubmit(onSubmit)} className='bg-white p-8 rounded-lg shadow-md w-100'>

        <h2 className='text-2xl font-bold text-center mb-6'>Create an account</h2>
        <div className='flex flex-col gap-2 justify-center'>

          {/* Full Name */}
          <div className='flex flex-row gap-4'>
            <label className='font-medium mt-2 w-32'>Full Name</label>
            <input {...register("fullName", { required: "Full Name is required" })} type="text" placeholder='eg. Neera Khatri'
              className='border p-2 rounded-md'/>
          </div>
          {errors.fullName && <span className="text-red-500">{errors.fullName.message}</span>}

          {/* Email */}
          <div className='flex flex-row gap-4'>
            <label className='font-medium mt-2 w-32'>Email</label>
            <input {...register("email", { required: "Email is required" })} type="email" placeholder='eg. neera@gmail.com'
              className='border p-2 rounded-md'/>
          </div>
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}

          {/* Phone Number */}
          <div className='flex flex-row gap-4'>
            <label className='font-medium mt-2 w-32'>Phone Number</label>
            <input
              {...register("phoneNumber", { required: "Phone number is required" })} type="tel" placeholder="eg. 98xxxxxxxx"
              className='border p-2 rounded-md'/>
          </div>
          {errors.phoneNumber && <span className="text-red-500">{errors.phoneNumber.message}</span>}

          {/* Password */}
          <div className='flex flex-row gap-4'>
            <label className='font-medium mt-2 w-32'>Password</label>
            <input
              {...register("password", { required: "Password is required", minLength: {
                  value: 8, message: "Password must be at least 8 characters" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                  message: "Password must have uppercase, lowercase, number, and special character"
                }
              })}type="password" placeholder="eg. Auwe12#" className='border p-2 rounded-md'/>
          </div>
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}

          {/* Confirm Password */}
          <div className='flex flex-row gap-4'>
            <label className='font-medium mt-2 w-32'>Confirm Password</label>
            <input {...register("confirmPassword", { required: "Confirm Password is required",
                validate: value => value === password || "Passwords do not match"
              })}
              type="password" placeholder="eg. Auwe12#" className='border p-2 rounded-md'
            />
          </div>
          {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}

          {/* Submit */}
          <button type="submit" className='mx-auto mt-4 text-center rounded-lg p-2 font-medium bg-green-400 w-30'>
            Register
          </button>

        </div>
      </form>
    </div>
  );
};

export default Register;