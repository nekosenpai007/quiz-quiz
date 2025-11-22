const API_BASE = import.meta.env.VITE_API_BASE || 'http://10.26.80.231:4000/api';

export async function api(path, opts = {}){
  const token = localStorage.getItem('token');
  opts.headers = opts.headers || {};
  opts.headers['Content-Type'] = 'application/json';
  if(token) opts.headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API_BASE + path, opts);
  if(!res.ok) {
    const err = await res.json().catch(()=>({error:'network'}));
    throw err;
  }
  return res.json();
}
