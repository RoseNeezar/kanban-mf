import { useState, useLayoutEffect, FC } from "react";
import { Router } from "react-router-dom";
import { History } from "history";

const CustomRouter: FC<{ history: History }> = ({ history, ...props }) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};

export default CustomRouter;
