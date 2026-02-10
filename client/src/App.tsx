import StudentDashboard from "./components/StudentDashboard"
import { useState } from "react"

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <StudentDashboard />
      <button onClick={() => setCount(count + 1)} >{count}</button>
    </>
  )
}

export default App
