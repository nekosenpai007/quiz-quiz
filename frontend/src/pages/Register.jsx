import React, {useState} from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [role,setRole] = useState('student');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const data = await api('/auth/register', { method:'POST', body: JSON.stringify({name,email,password,role}) });
      localStorage.setItem('token', data.token);
      nav(role === 'host' ? '/host' : '/join');
    }catch(err){ alert(err.error || 'register failed'); }
  }

  return (
    <div className="login-container">
      <h1>SIGN UP</h1>
      
      <form onSubmit={submit}>
        <div className="input-group">
          <label htmlFor="name">NAME</label>
          <input
            type='text'
            id='name' 
            placeholder="Your Name"
            value={name}
            onChange={e=>setName(e.target.value)}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="email">EMAIL</label>
          <input
            type="email"
            id='email' 
            placeholder="your@email.com"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">PASSWORD</label>
          <input 
            type="password" 
            id='password'
            placeholder="••••••••"
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />
        </div>
        
        <div className="input-group">
          <label>ROLE</label>
          <div className="role-selection">
            <label className="role-option">
              <input 
                type="radio" 
                checked={role==='student'} 
                onChange={()=>setRole('student')} 
              />
              <span>Student</span>
            </label>
            <label className="role-option">
              <input 
                type="radio" 
                checked={role==='host'} 
                onChange={()=>setRole('host')} 
              />
              <span>Host</span>
            </label>
          </div>
        </div>
        
        <button type="submit">SIGN UP</button>
      </form>
    </div>
  );
}