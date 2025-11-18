import React, {useState} from 'react';
import { api } from '../lib/api';
import QuizView from './QuizView';

export default function ParticipantJoin(){
  const [code,setCode] = useState('');
  const [sessionData, setSessionData] = useState(null);

  async function join(){
    try{
      const res = await api('/sessions/join', { method:'POST', body: JSON.stringify({ code }) });
      setSessionData(res);
    }catch(err){ alert(err.error || 'join failed'); }
  }
  return (
    <div style={{padding:20}}>
      <h2>Join Session</h2>
      <input 
      type='text'
      id='sessionCode'
      placeholder='Enter Session Code' value={code} onChange={e=>setCode(e.target.value)} />
      <button onClick={join}>Join</button>
      {sessionData && <QuizView sessionData={sessionData} />}
    </div>
  );
}
