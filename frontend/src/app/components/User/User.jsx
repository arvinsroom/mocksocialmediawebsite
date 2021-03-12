const User = () => {

  // fetch the flow here
  // depending on what needs to be rendered here
  // go to that component
  // maybe pass the props with additional rendering data
  return (
    <div className="App">
      {data.content.body.map((block) => Components(block))}
    </div>
  );
}

export default User;

import React from "react";
import ReactDOM from "react-dom";
import Components from "./components.js";

import "./styles.css";

const data = {
  content: {
    body: [
      {
        _uid: "BUY6Drn9e1",
        component: "foo",
        headline: "Foo"
      },
      {
        _uid: "gJZoSLkfZV",
        component: "bar",
        title: "Bar"
      },
      {
        _uid: "X1JAfdsZxy",
        component: "foo",
        headline: "Another headline"
      }
    ]
  }
};

function App() {
  return (
    <div className="App">
      <h1>Hello React</h1>
      {data.content.body.map((block) => Components(block))}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
