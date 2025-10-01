import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import "./App.css";

import { routes } from "routes";
import { Toaster } from "react-hot-toast";
import AppLayout from "layouts/App/index.layout";
import { FallBackLoader } from "components";

function RouteLayout({ path }) {
  const element = useRoutes(path);
  return element;
}

function App() {
  return (
    <>
      <Suspense fallback={<FallBackLoader />}>
        <AppLayout>
           <RouteLayout path={routes()} />
        </AppLayout>
       
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
