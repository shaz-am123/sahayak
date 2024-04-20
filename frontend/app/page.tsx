"use client"
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { handleLogin } from './api/auth/AuthService';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  return (
    <div>
      <h2>Login</h2>
      <div className="p-field">
        <label htmlFor="username">Username</label>
        <InputText id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="p-field">
        <label htmlFor="password">Password</label>
        <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button label="Login" onClick={()=>handleLogin(username, password, router)} />
    </div>
  );
};

export default LoginPage;
