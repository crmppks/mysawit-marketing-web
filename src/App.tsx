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
import HalamanAnnualReport from './pages/laporan/AnnualReport';
import HalamanMonthlyReport from './pages/laporan/MonthlyReport';
import HalamanDailyReport from './pages/laporan/DailyReport';
import HalamanTargetMarketing from './pages/kpi/TargetMarketing';
import HalamanDetailKPI from './pages/kpi/DetailKPI';
import HalamanDaftarMarketing from './pages/marketing/DaftarMarketing';
import HalamanDetailMarketing from './pages/marketing/DetailMarketing';
import HalamanDetailKategoriProduk from './pages/kategori/produk/DetailKategoriProduk';
import HalamanDetailKategoriKonsumen from './pages/kategori/konsumen/DetailKategoriKonsumen';
import { useAppSelector } from './hooks/redux_hooks';
import { ID_KATEGORI_PRODUK_KECAMBAH } from './helpers/constants';

export default function App() {
  const user = useAppSelector((state) => state.sesi.user);

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
          {user.kategori_produk_id === ID_KATEGORI_PRODUK_KECAMBAH && (
            <Route path="/konsumen" element={<Outlet />}>
              <Route index element={<HalamanDaftarKonsumen />} />
              <Route path=":id" element={<HalamanDetailKonsumen />} />
            </Route>
          )}
          <Route path="/kategori" element={<Outlet />}>
            <Route path="produk" element={<Outlet />}>
              <Route path=":id" element={<HalamanDetailKategoriProduk />} />
            </Route>
            <Route path="konsumen" element={<Outlet />}>
              <Route path=":id" element={<HalamanDetailKategoriKonsumen />} />
            </Route>
          </Route>
          <Route path="/marketing" element={<Outlet />}>
            <Route index element={<HalamanDaftarMarketing />} />
            <Route path=":id" element={<HalamanDetailMarketing />} />
          </Route>
          <Route path="/profile" element={<Outlet />}>
            <Route index element={<HalamanDetailProfile />} />
            <Route path="password" element={<HalamanUpdatePassword />} />
            <Route path="perbaharui" element={<HalamanUpdateProfile />} />
          </Route>
          <Route path="/laporan" element={<Outlet />}>
            <Route path="annual" element={<HalamanAnnualReport />} />
            <Route path="monthly" element={<HalamanMonthlyReport />} />
            <Route path="daily" element={<HalamanDailyReport />} />
          </Route>
          <Route path="/kpi" element={<Outlet />}>
            <Route path="target" element={<HalamanTargetMarketing />} />
            <Route path="detail" element={<HalamanDetailKPI />} />
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
