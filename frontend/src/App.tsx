import { Route, Switch } from "react-router-dom";
import "./App.css";
import Chat from "./components/Chat/Chat";
import Home from "./components/Home/Home";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={Home} exact/>
        <Route path="/chats" component={Chat} />
      </Switch>
    </div>
  );
}

export default App;
