import Index from "../pages/index";
import Login from "../pages/login/login";
import Detail from "@/pages/detail/detail";
import UserCenter from "@/pages/userCenter/userCenter";
import UserSettings from "@/pages/userSettings/userSettings";
export const routes = [
  {
    path: "/",
    auth: false,
    component: <Index />,
  },
  {
    path: "/login",
    auth: false,
    component: <Login />,
  },
  {
    path: "/detail/:type/:id",
    auth: false,
    component: <Detail />,
  },
  {
    path: "/userCenter",
    auth: true,
    component: <UserCenter />,
  },
  {
    path: "/user/:id",
    auth: false,
    component: <UserCenter />,
  },
  {
    path: "/userSettings",
    auth: true,
    component: <UserSettings />,
  },
];
