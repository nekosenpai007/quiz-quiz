import React, {useState} from 'react';
import { api } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const data = await api('/auth/login', { method:'POST', body: JSON.stringify({email,password}) });
      localStorage.setItem('token', data.token);
      nav(data.user.role === 'host' ? '/host' : '/join');
    }catch(err){ alert(err.error || 'login failed'); }
  }

  return (
    <div className="login-container">
      <h1>LOGIN</h1>
      
      <form onSubmit={submit}>
        <div className="input-group">
          <label htmlFor="email">EMAIL</label>
          <input 
            type="email" 
            id="email" 
            placeholder="your@email.com"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">PASSWORD</label>
          <input 
            type="password" 
            id="password" 
            placeholder="••••••••"
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />
        </div>
        
        <button type="submit">SIGN IN</button>
      </form>
      
      <div className="divider">OR</div>
      
      {/* <div className="social-login">
        <div className="social-btn">G</div>
        <div className="social-btn">F</div>
        <div className="social-btn">X</div>
      </div> */}
      
      <div className="footer">
        Don't have an account? <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
}