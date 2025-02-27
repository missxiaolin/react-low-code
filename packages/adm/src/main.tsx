import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@ant-design/v5-patch-for-react-19"; // fix for react 19

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
