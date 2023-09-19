import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./stylesheets/index.css";
// @ts-ignore
import { indexBackground } from "./assets.js";

document.documentElement.style.setProperty(
  "--global-background-image",
  `url(${indexBackground})`
);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
