import { TestProvider } from "./context/TestContext";
import TestHome from "./pages/test-home";

function App() {
  return (
    <TestProvider>
      <TestHome />
    </TestProvider>
  );
}

export default App;
