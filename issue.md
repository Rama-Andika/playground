# Refactoring & Cleanup Lanjutan Module Invoices

## 📌 Latar Belakang
Modul `invoices` (`src/routes/_auth/invoices`) telah melalui tahapan refactoring untuk sentralisasi state dan logic melalui Context dan Custom Hooks. Namun, pada level komponen UI (terutama _Views_ dan pembungkus Responsive), masih terdapat banyak kode duplikat (boilerplate). Issue ini bertujuan untuk melakukan **DRY (Don't Repeat Yourself)** pada struktur UI untuk memastikan kode lebih skalabel, *maintainable*, dan sesuai standar praktik terbaik (Best Practices), **tanpa sedikitpun mengubah flow bisnis sistem saat ini**.

## 🎯 Objektif
1. Mengurangi duplikasi kode untuk kerangka layout UI dasar (Desktop & Mobile).
2. Menghapus prop-drilling yang tersisa dengan re-integrasi *Context*.
3. Menghapus *dead code* atau file-file *legacy* yang sudah tidak dipakai.
4. Membuat kode menjadi lebih *self-explanatory* dan modular agar programmer junior atau AI dapat dengan mudah memodifikasinya di masa depan.

---

## 🛠️ Tahapan Implementasi (Action Plan)

Instruksi di bawah ini dibuat berurutan agar developer dapat mengimplementasikannya secara bertahap tanpa takut merusak sistem.

### Tahap 1: Ekstraksi `ResponsiveInvoiceWrapper`
Saat ini di setiap rute utama (`new.tsx`, `$id/index.tsx`, `return/$id.tsx`, `return/new/$id.tsx`) terdapat kode duplikat untuk menyembunyikan view berdasarkan ukuran layar:
```tsx
<div className="hidden lg:block h-full"> ...DesktopView... </div>
<div className="lg:hidden h-full"> ...MobileView... </div>
```
**Tugas:**
- Buat komponen baru: `src/routes/_auth/invoices/--components/shared/ResponsiveInvoiceWrapper.tsx`.
- Komponen harus menerima props `desktopView: ReactNode` dan `mobileView: ReactNode`.
- Gantikan blok deklarasi `hidden lg:block` di ke-4 file route utama tersebut menggunakan komponen wrapper ini.

### Tahap 2: Standarisasi Base Layout (`DesktopLayout` & `MobileLayout`)
Buka file `EditInvoiceDesktopView.tsx`, `NewInvoiceDesktopView.tsx`, dan varian *Return*-nya. Semua komponen tersebut memiliki struktur flex kerangka yang 100% sama (contoh class: `flex flex-col gap-6 p-4 sm:p-8 lg:p-10 max-w-[1536px] mx-auto...`).

**Tugas:**
- Buat komponen `InvoiceDesktopLayout.tsx` di folder `shared/`.
- Komponen menerima props: `header`, `content` (misal: untuk Table Item), dan `sidebar` (misal: untuk Customer & Summary).
- Implementasikan base class Tailwind tersebut di dalam `InvoiceDesktopLayout.tsx`.
- Lakukan pola yang serupa: buat `InvoiceMobileLayout.tsx` untuk menstandarisasi komponen pembungkus file Mobile View.
- Panggil base komponen ini di dalam semua file Views (`EditInvoiceDesktopView`, `NewInvoiceDesktopView`, dan versi mobile/return-nya) dengan melempar blok komponennya sebagai children/props. Ini akan memangkas puluhan baris class HTML yang berulang.

### Tahap 3: Eliminasi Prop-Drilling melalui `useInvoiceContext`
Meski context telah diimplementasikan sebelumnya, komponen seperti `DesktopInvoiceItemTable.tsx`, `CustomerSidebarCard.tsx`, dan `PricingSummaryCard.tsx` saat ini masih menerima beberapa parameter sebagai **props** dari komponen atasnya.

**Tugas:**
- Audit komponen-komponen yang berada di bawah folder `--components/shared/`.
- Gantikan passing props seperti `isDraft={docStatus === DOCUMENT_STATUS.DRAFT}`, `mode`, atau handler functions (`onEditClick`) dengan cara membaca langsung dari `useInvoiceContext()` di dalam komponen bersangkutan.
  - *Contoh:* Pada `PricingSummaryCard.tsx`, hapus prop `isDraft` dan gunakan deklarasi `const { docStatus } = useInvoiceContext(); const isDraft = docStatus === DOCUMENT_STATUS.DRAFT;` di dalamnya.
- Pastikan kode induk (`EditInvoice...` / `NewInvoice...`) menjadi sangat bersih dan bebas props berlebihan saat memanggil child component.

### Tahap 4: Dead Code Elimination (Pembersihan File)
Pada proses refactoring sebelumnya, kita membuat versi per-usecase (seperti *Edit* vs *New*). Ini mungkin meninggalkan file asli yang tidak diperlukan.

**Tugas:**
- Lacak apakah file seperti `InvoiceDesktopView.tsx` dan `InvoiceMobileView.tsx` di dalam folder `--components` masih di-_import_ dan dipakai di aplikasi.
- Jika terbukti bahwa `EditInvoice...` dan `NewInvoice...` sepenuhnya telah mengambil alih tugasnya, maka **Hapus (Delete)** file sisa tesebut agar folder tidak redundan.

### Tahap 5: Testing & Verifikasi Akhir
Setelah semua tahap di atas direalisasikan:
1. Jalankan `npm run build` dan pastikan **TIDAK ADA** satupun *TypeScript Error*.
2. Buka modul *Invoices* secara mandiri dan pastikan flow Buat, Edit, Return, dan Cetak (Print) berjalan normal, serta responsivitasnya antara desktop dan HP masih terjaga.

---

> **Catatan Untuk Implementator:**
> Fokus dari issue ini bukan penambahan fitur. Apabila Anda menemukan state internal atau data bisnis *(business logic context)* yang tidak tertangani atau membutuhkan penyesuaian untuk props yang Anda hapus, lakukan modifikasi tersebut dengan sangat hati-hati agar tidak mengganggu operasional sistem yang sudah berjalan (Regression).
