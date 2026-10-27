import { createRoot } from 'react-dom/client';
import { MathCommandWorkspace } from '../client/src/features/math-command/MathCommandWorkspace';
import type { MathCommandRequest } from '../client/src/features/math-command/client';
import '../client/src/styles/global.css';

const request:MathCommandRequest=async<T,>(suffix:string,options:RequestInit={})=>{
  const response=await fetch('/api/math-command'+suffix,{...options,headers:{'Content-Type':'application/json',...options.headers}});
  const value=await response.json();if(!response.ok)throw new Error(value.message||'Could not load Math Command Center.');
  if(['/bulk-apply','/bulk-undo','/preferences','/taxonomy'].includes(suffix))parent.postMessage({type:'studio:math-management-changed'},location.origin);
  return value as T;
};
createRoot(document.getElementById('root')!).render(<MathCommandWorkspace mode="studio" request={request}/>);
