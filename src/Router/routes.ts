import CreatePoll from "../Pages/CreatePoll";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import NotFound from "../Pages/NotFound";
import Register from "../Pages/Register";
import ReplyPoll from "../Pages/ReplyPoll";
import Results from "../Pages/Results";
import User from "../Pages/User";
import { Route } from "../types";

const routes: Route[] = [
    {
        path: "/",
        component: Login,
        routeType: "GUEST"
    },
    {
        path: "/register",
        component: Register,
        routeType: "GUEST"
    },
    {
        path: "/user",
        component: User,
        routeType: "PRIVATE"
    },
    {
        path: "/createpoll",
        component: CreatePoll,
        routeType: "PRIVATE"
    },
    {
        path: "/replypoll/:id",
        component: ReplyPoll,
        routeType: "PUBLIC"
    },
    {
        path: "/results/:id",
        component: Results,
        routeType: "PRIVATE"
    },
    {
        path: "*",
        component: NotFound,
        routeType: "PUBLIC"
    }
]

export default routes;