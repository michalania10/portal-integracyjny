// import logo from './logo.svg';
// import './App.css';

import MainScreen from "./components/MainScreen";

function App() {
  const allSources = {
    "korba": { allow: {"orth": true, "base": true }},
    "sXVII": { allow: {"orth": false, "base": true }},
    "cbdu": { allow: {"orth": true, "base": false }},
    "kartoteka": { allow: { "orth": false, "base": true }},
  }
  const allFetchTypes = ["orth", "base"]

  return (
      <MainScreen allSources={allSources} allFetchTypes={allFetchTypes}/>
  );
}

export default App;
