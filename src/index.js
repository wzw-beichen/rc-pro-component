import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const App = () => {
  return (
    <div className="app_main">
      <h1>Hello!!</h1>
      <h2>Welcome to your First React App..!!!!!!</h2>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
