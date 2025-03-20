import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [lmsName, setLmsName] = useState(''); // New state for LMS System Name
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!username || !password || !lmsName) {
      setError('All fields are required');
      return;
    }

    // In a real app, you'd send this data to a backend to create a new user and LMS.
    // For this example, we'll just store it in localStorage. **Not secure for real apps!**
    localStorage.setItem('signupUsername', username);
    localStorage.setItem('signupPassword', password); // **Never do this in production!**
    localStorage.setItem('lmsName', lmsName);

    alert('Sign up successful! (Data stored in localStorage for demo purposes)');
    navigate('/login'); // Redirect to login page after signup
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-semibold">Sign Up for Your LMS</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="lmsName">LMS System Name</Label>
              <Input
                id="lmsName"
                type="text"
                placeholder="Choose a name for your LMS"
                value={lmsName}
                onChange={(e) => setLmsName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" onClick={handleSubmit}>Sign Up</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
