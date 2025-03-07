import { Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./components/Homepage";
import Chatpage from "./components/Chatpage";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chats" element={<Chatpage />} />
        {/* <Route path = "/" element = {}/>
      <Route path = "/" element = {}/> */}
      </Routes>
    </div>
  );
}

export default App;
