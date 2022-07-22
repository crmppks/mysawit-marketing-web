import { Outlet, Route, Routes } from 'react-router-dom';
import Masuk from '@/pages/auth/Masuk';
import LupaPassword from '@/pages/auth/LupaPassword';
import NotFound from '@/pages/404';

import { BrowserRouter } from 'react-router-dom';
import RouteGuestComponent from './components/RouteGuestComponent';
import RouteProtectedComponent from './components/RouteProtectedComponent';
import WrapperComponent from './components/WrapperComponent';
import HalamanDaftarProduk from './pages/produk/DaftarProduk';
import HalamanTambahProduk from './pages/produk/TambahProduk';
import HalamanDetailProduk from './pages/produk/DetailProduk';
import HalamanDashboard from './pages/Dashboard';
import HalamanEditProduk from './pages/produk/EditProduk';
import HalamanDaftarMarketing from './pages/marketing/DaftarMarketing';
import HalamanTambahMarketing from './pages/marketing/TambahMarketing';
import HalamanDetailMarketing from './pages/marketing/DetailMarketing';
import HalamanStrukturMarketing from './pages/marketing/StrukturMarketing';
import HalamanDaftarKonsumen from './pages/konsumen/DaftarKonsumen';
import HalamanTambahKonsumen from './pages/konsumen/TambahKonsumen';
import HalamanDetailKonsumen from './pages/konsumen/DetailKonsumen';
import HalamanEditMarketing from './pages/marketing/EditMarketing';
import HalamanFAQ from './pages/FAQ';
import HalamanStrukturKonsumen from './pages/konsumen/StrukturKonsumen';
import HalamanInfoKarousel from './pages/aksesoris/InfoKarousel';
import HalamanInfoPopup from './pages/aksesoris/InfoPopup';
import HalamanTulisArtikel from './pages/blog/TulisArtikel';
import HalamanDaftarArtikel from './pages/blog/DaftarArtikel';
import HalamanEditArtikel from './pages/blog/EditArtikel';
import HalamanDetailArtikel from './pages/blog/DetailArtikel';
import HalamanSuratPernyataan from './pages/aksesoris/SuratPernyataan';
import HalamanDetailKategoriProduk from './pages/kategori/produk/DetailKategoriProduk';
import HalamanDetailKategoriKonsumen from './pages/kategori/konsumen/DetailKategoriKonsumen';
import HalamanStokProduk from './pages/produk/StokProduk';
import HalamanDetailProfile from './pages/profile';
import HalamanUpdatePassword from './pages/profile/UpdatePassword';
import HalamanUpdateProfile from './pages/profile/UpdateProfile';

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
          <Route path="/faq" element={<HalamanFAQ />} />
          <Route path="/blog" element={<Outlet />}>
            <Route index element={<HalamanDaftarArtikel />} />
            <Route path="tulis" element={<HalamanTulisArtikel />} />
            <Route path=":id" element={<HalamanDetailArtikel />} />
            <Route path=":id/edit" element={<HalamanEditArtikel />} />
          </Route>
          <Route path="/kategori" element={<Outlet />}>
            <Route path="produk" element={<Outlet />}>
              <Route path=":id" element={<HalamanDetailKategoriProduk />} />
            </Route>
            <Route path="konsumen" element={<Outlet />}>
              <Route path=":id" element={<HalamanDetailKategoriKonsumen />} />
            </Route>
          </Route>
          <Route path="/produk" element={<Outlet />}>
            <Route index element={<HalamanDaftarProduk />} />
            <Route path=":id" element={<HalamanDetailProduk />} />
            <Route path=":id/edit" element={<HalamanEditProduk />} />
            <Route path=":id/stok" element={<HalamanStokProduk />} />
            <Route path="tambah" element={<HalamanTambahProduk />} />
          </Route>
          <Route path="/marketing" element={<Outlet />}>
            <Route index element={<HalamanDaftarMarketing />} />
            <Route path=":id" element={<HalamanDetailMarketing />} />
            <Route path=":id/edit" element={<HalamanEditMarketing />} />
            <Route path="tambah" element={<HalamanTambahMarketing />} />
            <Route path="struktur" element={<HalamanStrukturMarketing />} />
            <Route path="laporan" element={<HalamanStrukturMarketing />} />
          </Route>
          <Route path="/konsumen" element={<Outlet />}>
            <Route index element={<HalamanDaftarKonsumen />} />
            <Route path=":id" element={<HalamanDetailKonsumen />} />
            <Route path="tambah" element={<HalamanTambahKonsumen />} />
            <Route path="struktur" element={<HalamanStrukturKonsumen />} />
          </Route>
          <Route path="/aksesoris" element={<Outlet />}>
            <Route path="karousel" element={<HalamanInfoKarousel />} />
            <Route path="popup" element={<HalamanInfoPopup />} />
            <Route path="surat-pernyataan" element={<HalamanSuratPernyataan />} />
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
