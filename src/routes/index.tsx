import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import { useAppSelector } from "@/store/hooks";
import { Spin } from "antd";
import { FC } from "react";

interface RenderRoutesI {
  routes: any;
}
const RenderRoutes: FC<RenderRoutesI> = (props) => {
  const { routes } = props;
  const { pathname } = useLocation();
  const { token } = useAppSelector((state) => state.user);
  const { show, title } = useAppSelector((state) => state.utils.globalLoading);
  return (
    <Spin spinning={show} tip={title} wrapperClassName="spaceu-global_loading">
      {pathname.indexOf("login") === -1 && <Header />}
      <Routes>
        {routes.map((v: any) => {
          return (
            <Route
              path={v.path}
              element={
                v.path === pathname && v.auth && !token ? (
                  <Navigate to={"/login"} replace={true} />
                ) : (
                  v.component
                )
              }
              key={v.path}
            >
              {v.children && RenderRoutes(v.children)}
            </Route>
          );
        })}
      </Routes>
      {pathname.indexOf("login") === -1 && <Footer />}
    </Spin>
  );
};
export default RenderRoutes;
