import "./stylesheets/index.css";
import Index from "./components/Index";
import Messages from "./components/Messages";
import SpecificConversation from "./components/Conversations.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/messages" element={<Messages />} />
          <Route
            path="/messages/:conversationId"
            element={<SpecificConversation />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
