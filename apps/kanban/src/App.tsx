import Kanban from "@pages/Kanban/Kanban.page";
import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./app/pages/Home/Home.page";
import useRouteHooks from "./app/shared-hooks/useRouteHooks";

const App: React.FC<{
  routePrefix: string;
  useRemoteStore?: any;
}> = ({ routePrefix, useRemoteStore }) => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  useEffect(() => {
    const el = document.querySelector(".overlay");
    // @ts-ignore
    el.style.display = "none";
  }, []);

  useRouteHooks(useRemoteStore);

  return (
    <React.Suspense fallback={<h1>Loading...</h1>}>
      <Routes location={state?.backgroundLocation || location}>
        <Route path={`${routePrefix}/kanban`} element={<Home />} />

        <Route path={`${routePrefix}/kanban/:boardId`} element={<Kanban />} />
        <Route
          path="/"
          element={<Navigate replace to={`${routePrefix}/kanban/`} />}
        />
      </Routes>
      {/* {state?.backgroundLocation && (
        <Routes>
          <Route
            path={`${routePrefix}/kanban/board`}
            element={<Kanban isOpen={!!state?.backgroundLocation} />}
          />
        </Routes>
      )} */}
    </React.Suspense>
  );
};

export default App;
