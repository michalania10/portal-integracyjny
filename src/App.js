// import logo from './logo.svg';
// import './App.css';
import Korba from './components/Korba';
import TranslationPl from './TranslationPl';

function App() {
  return (
      <Korba translation={TranslationPl}
             fetchType="orth"
             value="biskupa" />
  );
}

export default App;
