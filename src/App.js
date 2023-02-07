// import logo from './logo.svg';
// import './App.css';
import Table from './Table';
import TranslationPl from './TranslationPl';

function App() {
  return (
    <Table headers={["korba.leftCtx", "korba.result", "korba.rightCtx", "korba.text", "korba.date"]}
           data={[
             {
               key: "someKey",
               "korba.leftCtx": "Dobroć Pana w mnieyszych się ieszcze rzeczach wydaie iawnie;",
               "korba.result": "pies [pies:subst:sg:nom:m]",
               "korba.rightCtx": ", ktory wrot strzeże przez wzgląd bardziey na dawne",
               "korba.text": "Monitor",
               "korba.date": "1772"
             }
           ]}
           translation={TranslationPl}/>
  );
}

export default App;
