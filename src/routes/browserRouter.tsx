import { createBrowserRouter } from "react-router";
import { webRoutes } from "./webRoutes";
import ChikhisPage from "../pages/ChikhisPage";
import App from "../App";
import SubjectPage from "../pages/SubjectPage";
import VideoPage from "../pages/VideoPage";

 
export const browserRouter = createBrowserRouter([
    {
        path : webRoutes.home ,
        element : <App/>,
          
    },
    
    {
        path : webRoutes.Chikhs ,
        element : <ChikhisPage/>
    },
    {
        path : webRoutes.Subjects ,
        element : <SubjectPage/>
    },
    {
        path : webRoutes.Videos ,
        element : <VideoPage/>
    },
  
]);

 