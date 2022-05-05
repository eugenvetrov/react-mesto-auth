import React from "react";
import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ component: Component, ...props }) => {
//   return (
//     <Route
//       render={() =>
//         props.loggedIn ? (
//           <Component {...props} />
//         ) : (
//           <Navigate replace to="./sign-in" />
//         )
//       }
//     />
//   );
// };

const ProtectedRoute = ({ children, loggedIn, redirectTo }) => {
  return loggedIn ? children : <Navigate replace to={redirectTo} />;
};

export default ProtectedRoute;
