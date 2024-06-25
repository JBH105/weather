import { Routes, Route, BrowserRouter } from "react-router-dom";
import WeatherApp from "./pages/Weather";
import NotFound from "./pages/404";
import { db } from "./backend/app_backend";
import "./autoload";
import WeatherList from "./components/WeatherList";

function App() {
  let homePageSeen = db.get("HOME_PAGE_SEEN");
  let DEFAULT_ROUTE_PAGE;
    (DEFAULT_ROUTE_PAGE = <WeatherApp />)
    

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={DEFAULT_ROUTE_PAGE} />
        <Route path="weather" element={<WeatherApp />} />
        <Route path="forecast" element={<WeatherList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
