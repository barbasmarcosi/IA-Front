import { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/Login/Login";
import PrincipalLayout from "./components/PrincipalLayout/PrincipalLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./containers/MainPage";
import ImageAnalisis from "./containers/ImageAnalisis";
import DbAnalisis from "./containers/DbAnalisis";

function App() {
  const [user, setUser] = useState();
  // document.cookie
  //   .split("; ")
  //   .find((row) => row.startsWith("user="))
  //   ?.split("=")[1]
  //   ? JSON.parse(
  //       document.cookie
  //         .split("; ")
  //         .find((row) => row.startsWith("user="))
  //         ?.split("=")[1]
  //     )
  //   : ""

  return (
    <div style={{ height: "100%", margin: 0, border: 0, padding: 0 }}>
      <BrowserRouter>
        <PrincipalLayout>
          <Routes>
            {/* <Route path="/*" element={<Login user={user} setUser={setUser} />} /> */}
            {/* {user && user.applications.filter((app) => app.nid == -15).length ? ( */}
            <Route
              path="/*"
              element={<MainPage user={user} setUser={setUser} />}
            />
            <Route
              path="/image_analisis"
              element={<ImageAnalisis user={user} setUser={setUser} />}
            />
            <Route
              path="/db_analisis"
              element={<DbAnalisis user={user} setUser={setUser} />}
            />
          </Routes>
        </PrincipalLayout>
      </BrowserRouter>
    </div>
  );
}

export default App;
