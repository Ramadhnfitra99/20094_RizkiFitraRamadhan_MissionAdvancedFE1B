# CHILL — Mission Advanced Front End 1B

Aplikasi katalog film responsif berbasis React dan Next.js. Mission ini melanjutkan CRUD array pada mission sebelumnya menjadi CRUD dinamis melalui REST API.

## Fitur utama

- `GET` koleksi film dari REST API.
- `POST` film baru beserta poster, genre, rating, dan tahun.
- `PUT` pembaruan seluruh data film.
- `DELETE` film dengan konfirmasi.
- Custom hook `useMoviesApi` untuk memisahkan state dan seluruh logika asynchronous.
- Context API melalui `MoviesProvider` untuk state management.
- Service API terpisah pada `app/services/api/movieApi.ts`.
- Base URL API disimpan pada environment variable.
- Loading state, error state, tombol sinkronisasi, dan indikator status API.
- Validasi form, pencarian, filter genre, rata-rata rating, serta poster picker.
- Halaman login, register, home, series, Daftar Saya, profil, langganan, dan pembayaran.
- Responsive untuk desktop, tablet, dan mobile.
- Font Lato dan aset lokal agar tampilan konsisten.

## REST API

Project menggunakan [RESTful API](https://restful-api.dev/) sebagai fake API publik untuk pembelajaran. Service tersebut mendukung CORS serta operasi `GET`, `POST`, `PUT`, dan `DELETE` yang benar-benar dikirim melalui HTTP.

ID object yang dibuat untuk satu browser disimpan di `localStorage`. Data filmnya tetap dibaca dan dimutasi melalui REST API; `localStorage` hanya menyimpan daftar ID agar browser yang sama dapat mengambil koleksinya kembali.

> API ini merupakan sandbox publik. Jangan mengirim data pribadi atau rahasia.

## Struktur penting

```text
app/
├── components/
│   ├── CustomMoviesCrud.tsx
│   └── HomePage.tsx
├── context/
│   └── MoviesContext.tsx
├── data/
│   └── managedMovies.ts
├── hooks/
│   └── useMoviesApi.ts
└── services/
    └── api/
        └── movieApi.ts
```

Alur datanya:

```text
CustomMoviesCrud
       ↓ aksi pengguna
MoviesContext / useMoviesApi
       ↓
movieApi service
       ↓ HTTP GET, POST, PUT, DELETE
RESTful API
```

## Menjalankan project

Gunakan Node.js 22 atau yang lebih baru.

1. Pasang dependency:

   ```bash
   npm install
   ```

2. Salin environment example:

   PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

3. Jalankan development server:

   ```bash
   npm run dev
   ```

4. Buka `http://localhost:3000/home`.

## Pemeriksaan kualitas

```bash
npm run lint
npm test
npm run build
```

## Environment variable

```env
NEXT_PUBLIC_MOVIE_API_URL=https://api.restful-api.dev/objects
```

File `.env.local` tidak masuk Git. File `.env.example` disertakan agar project mudah dipasang ulang.

## Deploy ke Vercel

1. Import repository ke Vercel.
2. Framework preset: **Next.js**.
3. Tambahkan environment variable:
   - Name: `NEXT_PUBLIC_MOVIE_API_URL`
   - Value: `https://api.restful-api.dev/objects`
4. Deploy.

Tidak diperlukan build command khusus; Vercel akan menjalankan `next build` secara otomatis.

## Referensi desain

- [Figma Chill 1.0](https://www.figma.com/design/G9OCq6LLzIyRD8v8swHXSb/Chill-1.0--Copy-?node-id=3-7&p=f&t=vA4uKEw57Zd7UHro-0)

## Catatan pengumpulan

- Kumpulkan link repository GitHub.
- Sertakan link deployment Vercel agar aplikasi mudah diperiksa.
- Isi formulir pengumpulan di Google Classroom.
- Simpan screenshot formulir sebagai bukti pengumpulan.
