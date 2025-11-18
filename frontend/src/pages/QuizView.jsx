import React, {useState} from 'react';
import { api } from '../lib/api';

export default function QuizView({ sessionData }){
  const [index, setIndex] = useState(0);
  const q = sessionData.questions[index];

  async function choose(i){
    try{
      await api(`/sessions/${sessionData.sessionId}/answer`, { method:'POST', body: JSON.stringify({ questionId: q.id, choiceIndex: i }) });
      setIndex(idx => Math.min(sessionData.questions.length-1, idx+1));
    }catch(err){ alert(err.error || 'error'); }
  }

  if(!q) return <div>Done. Thanks!</div>;
  return (
    <div style={{marginTop:20}}>
      <h3>{q.text}</h3>
      <ul>
        {q.options.map((opt,oi)=> (
          <li key={oi} style={{marginTop:8}}>
            <button onClick={()=>choose(oi)}>{opt}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
