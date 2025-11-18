import React, {useEffect, useState} from 'react';
import { api } from '../lib/api';

export default function HostDashboard(){
  const [questions, setQuestions] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(()=>{ api('/questions').then(setQuestions).catch(console.error); },[]);

  async function create(){
    const qids = questions.slice(0,5).map(q=>q._id);
    const s = await api('/sessions/create', { method:'POST', body: JSON.stringify({ questionIds: qids }) });
    setSession(s);
  }

  async function getRank(){
    const r = await api(`/sessions/${session._id}/rank`);
    alert(JSON.stringify(r, null, 2));
  }

  return (
    <div style={{padding:20}}>
      <h2>Host Dashboard</h2>
      <button onClick={create}>Start 20-min Session (use first 5 questions)</button>
      {session && (
        <div style={{marginTop:10}}>
          <p>Code: <b>{session.code}</b></p>
          <p>Session ID: {session._id}</p>
          <button onClick={getRank}>Show ranking (alert)</button>
        </div>
      )}
      <h3 style={{marginTop:20}}>Available questions</h3>
      <ul>
        {questions.map(q=> <li key={q._id}>{q.text}</li>)}
      </ul>
    </div>
  );
}
