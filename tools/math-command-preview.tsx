// Full production workspace and runner with isolated synthetic data.
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { MathCommandWorkspace } from "../client/src/features/math-command/MathCommandWorkspace";
import { MathPracticeWorkspace } from "../client/src/features/math-command/MathPracticePage";
import { mathCommandRequest } from "../client/src/features/math-command/client";
import "../client/src/styles/global.css";

const assignmentId = location.pathname.match(/^\/math-practice\/([^/]+)/)?.[1];
function FixtureLinks(){
  const [tasks,setTasks]=useState<{id:string;title:string}[]>([]);
  const refresh=()=>fetch("/__qa/state").then(response=>response.json()).then(data=>setTasks(data.assignments));
  useEffect(()=>{void refresh();},[]);
  return <span style={{marginLeft:16}}><button onClick={()=>void refresh()}>Refresh assigned student practice</button>{tasks.map(task=><a key={task.id} style={{marginLeft:12}} href={`/math-practice/${task.id}`}>{task.title}</a>)}</span>;
}
createRoot(document.getElementById("root")!).render(<>
  <div style={{padding:"8px 24px",background:"#e8f2ff",color:"#183c64",fontSize:13}}>
    Isolated QA · synthetic students and temporary question content · no production writes
    <FixtureLinks />
  </div>
  {assignmentId
    ? <MathPracticeWorkspace assignmentId={assignmentId} request={mathCommandRequest("student")} />
    : <div style={{maxWidth:1560,margin:"0 auto",padding:24}}><MathCommandWorkspace mode="teacher" accessToken="teacher" /></div>}
</>);
