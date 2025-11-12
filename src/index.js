import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App"
import reportWebVitals from "./reportWebVitals";
import StarRating from "./starrating";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <StarRating maxRatingNum={10}></StarRating> */}
    <App />
  </React.StrictMode>
);
