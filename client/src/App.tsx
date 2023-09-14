import "./stylesheets/index.css";
import Index from "./components/Index";
import Messages from "./components/Messages";
import SpecificConversation from "./components/Conversations.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/Signup.tsx";
import SignIn from "./components/Signin.tsx";
import Account from "./components/Account.tsx";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/account/" element={<Account />} />
          <Route path="/create-account/" element={<SignUp />} />
          <Route path="/sign-in/" element={<SignIn />} />
          <Route path="/messages/" element={<Messages />} />
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
