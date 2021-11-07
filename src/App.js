import React from "react";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import FindID from "./pages/findID";
import FindPW from "./pages/findPW";
import { Routes, Route } from "react-router";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
    };
  }

  render() {
    //    const { username } = this.state;
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/findID" element={<FindID />} />
        <Route path="/findPW" element={<FindPW />} />
      </Routes>
      // <div className="App">
      //   <header className="App-header">
      //     {username ? `Hello ${username}` : "Hello World"}
      //   </header>
      // </div>
    );
  }
}

export default App;
