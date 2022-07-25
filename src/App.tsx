import { Outlet, Route, Routes } from 'react-router-dom';
import Masuk from '@/pages/auth/Masuk';
import LupaPassword from '@/pages/auth/LupaPassword';
import NotFound from '@/pages/404';

import { BrowserRouter } from 'react-router-dom';
import RouteGuestComponent from './components/RouteGuestComponent';
import RouteProtectedComponent from './components/RouteProtectedComponent';
import WrapperComponent from './components/WrapperComponent';
import HalamanDaftarProduk from './pages/produk/DaftarProduk';
import HalamanDetailProduk from './pages/produk/DetailProduk';
import HalamanDashboard from './pages/Dashboard';
import HalamanDaftarKonsumen from './pages/konsumen/DaftarKonsumen';
import HalamanDetailKonsumen from './pages/konsumen/DetailKonsumen';
import HalamanDetailProfile from './pages/profile';
import HalamanUpdatePassword from './pages/profile/UpdatePassword';
import HalamanUpdateProfile from './pages/profile/UpdateProfile';
import HalamanDaftarPesanan from './pages/pesanan/DaftarPesanan';
import HalamanDetailPesanan from './pages/pesanan/DetailPesanan';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RouteProtectedComponent>
              <WrapperComponent>
                <Outlet />
              </WrapperComponent>
            </RouteProtectedComponent>
          }
        >
          <Route index element={<HalamanDashboard />} />
          <Route path="/produk" element={<Outlet />}>
            <Route index element={<HalamanDaftarProduk />} />
            <Route path=":id" element={<HalamanDetailProduk />} />
          </Route>
          <Route path="/pesanan" element={<Outlet />}>
            <Route index element={<HalamanDaftarPesanan />} />
            <Route path=":id" element={<HalamanDetailPesanan />} />
          </Route>
          <Route path="/konsumen" element={<Outlet />}>
            <Route index element={<HalamanDaftarKonsumen />} />
            <Route path=":id" element={<HalamanDetailKonsumen />} />
          </Route>
          <Route path="/profile" element={<Outlet />}>
            <Route index element={<HalamanDetailProfile />} />
            <Route path="password" element={<HalamanUpdatePassword />} />
            <Route path="perbaharui" element={<HalamanUpdateProfile />} />
          </Route>
        </Route>
        <Route path="/auth">
          <Route
            path="masuk"
            element={
              <RouteGuestComponent>
                <Masuk />
              </RouteGuestComponent>
            }
          />
          <Route
            path="lupa-password"
            element={
              <RouteGuestComponent>
                <LupaPassword />
              </RouteGuestComponent>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
