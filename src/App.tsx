import Home from "./components/Home";
import Configuration from "./components/Configuration";
import Version from "./components/Version";

const App = () => {
  return (
    <div
      className="min-w-max text-white bg-gray-800"
    >
      <Home />
      <Configuration />
      <Version />
    </div>
  );
}

export default App;
