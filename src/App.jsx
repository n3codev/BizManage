import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import GlobalStyles from "./styles/GlobalStyles";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Customers from "./pages/Customers/Customers";
import Invoices from "./pages/Invoices/Invoices";
import Sellers from "./pages/Sellers/Sellers";
import AppLayout from "./ui/AppLayout/AppLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home/Home";

const queryClient = new QueryClient({
  defaultOptions: {
    querys: {
      staleTime: 5 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="home" element={<Home />} />
            <Route index element={<Navigate replace to="home" />} />
            <Route path="customers" element={<Customers />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="sellers" element={<Sellers />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-center"
        quarter={22}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 2000,
          },
          error: {
            duration: 4000,
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "red",
              color: "black",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
