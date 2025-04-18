import { createBrowserRouter } from "react-router-dom";
import { webRoutes } from "./webRoutes";
import ChikhisPage from "../pages/ChikhisPage";
import App from "../App";
import SubjectPage from "../pages/SubjectPage";
import VideoPage from "../pages/VideoPage";
import CalendarPage from "../pages/CalendarPage";
import TagsPage from "../pages/TagsPage";
import SocialAccountsPage from "../pages/SocialAccountsPage";
import ScheduledPostsPage from "../pages/ScheduledPostsPage";

 
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
    {
        path : webRoutes.Calendar,
        element : <CalendarPage/>
    },
    {
        path : webRoutes.Tags,
        element : <TagsPage/>
    },
    {
        path : webRoutes.SocialAccounts,
        element : <SocialAccountsPage/>
    },
    {
        path : webRoutes.ScheduledPosts,
        element : <ScheduledPostsPage/>
    },
]);

