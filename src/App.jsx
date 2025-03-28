// Other resources
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Css
import "./App.css";

// JSX Components
import Home from "./Pages/Layout/Home";

function App() {
  return (
    <>
      {/* <GoogleOAuthProvider clientId=""> */}
      {/* <Toast> */}
        {/* <ThemeProvider> */}
          <BrowserRouter>
            <Routes>
              <Route path="/*" element={<Home />} />
            </Routes>
          </BrowserRouter>
        {/* </ThemeProvider> */}
      {/* </Toast> */}
      {/* </GoogleOAuthProvider> */}
    </>
  );
}

export default App;
