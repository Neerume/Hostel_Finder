import { useState } from 'react';
import '../CSS/Login.css';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // simple validation: ensure it's numeric and at least 10 digits
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      alert('Please enter a valid phone number (min 10 digits)');
      return;
    }
    // In a real app you would send the number to the server here
    console.log('Phone number submitted:', digits);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="login-container">
        <h2>Thanks!</h2>
        <p>We received your phone number ({phone}).</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2>Sign in with your phone</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phone">Phone number</label>
        <input
          id="phone"
          type="tel"
          placeholder="e.g. +1234567890"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
