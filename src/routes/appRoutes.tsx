import { createBrowserRouter, RouterProvider } from "react-router";
import { webRoutes } from "./webRoutes";

const router =  createBrowserRouter([
    {
        path : webRoutes.home ,
        element : <div> Home </div>,
          
    }
]);
const AppRouter = () =>  <RouterProvider router={router} />

export default AppRouter;