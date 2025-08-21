# 🇮🇩 IndonesianScript

<div align="center">

[![Version](https://img.shields.io/badge/version-0.1.0--beta-blue.svg)](https://github.com/Elang-elang/indonesianscript)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Language](https://img.shields.io/badge/language-Indonesian-red.svg)](README.md)
[![Node.js](https://img.shields.io/badge/node.js-18%2B-brightgreen.svg)](https://nodejs.org)

*Bahasa pemrograman berbahasa Indonesia yang mudah dipelajari*

[Instalasi](#instalasi) • [Panduan Cepat](#panduan-cepat) • [Dokumentasi](#dokumentasi) • [Contoh](#contoh) • [Kontribusi](#kontribusi)

</div>

---

## 📖 Deskripsi

**IndonesianScript** adalah bahasa pemrograman inovatif berbahasa Indonesia yang dikembangkan oleh **Elang Muhammad** dalam waktu hanya 7 hari. Bahasa ini memungkinkan programmer Indonesia untuk menulis kode dengan sintaks bahasa Indonesia yang familiar, kemudian diterjemahkan ke TypeScript dan JavaScript untuk eksekusi.

### ✨ Fitur Utama

- 🔤 **Sintaks Bahasa Indonesia** - Tulis kode dengan kata-kata Indonesia
- ⚡ **Transpilasi Otomatis** - Otomatis mengkonversi ke TypeScript/JavaScript
- 🏃 **Eksekusi Langsung** - Jalankan file `.is` secara langsung
- 👀 **Watch Mode** - Pantau perubahan file secara real-time
- 🛠️ **CLI Tool** - Interface command line yang mudah digunakan
- 📱 **Cross-platform** - Berjalan di Windows, Mac, dan Linux

## 🚀 Instalasi

### Prasyarat
- Node.js 18 atau lebih baru
- npm atau yarn

### Instalasi Package
```bash
npm install indonesianscript
# atau
yarn add indonesianscript
```

### Instalasi Global (Opsional)
```bash
npm install -g indonesianscript
```

## 🎯 Panduan Cepat

### 1. Membuat File IndonesianScript

Buat file dengan ekstensi `.is`:

```indonesian
// hello.is
menampilkan("Halo Dunia!");

buatkan nama: teks = "Budi";
buatkan umur: angka = 25;

menampilkan(k"Nama saya {nama} dan umur saya {umur} tahun");
```

### 2. Menjalankan File

```bash
# Jalankan langsung
node running.js --run hello.is

# Atau dengan watch mode
node running.js --run hello.is --watch

# Transpile ke JavaScript
node running.js --transpile hello.is --output hello.js
```

## 📚 Dokumentasi Sintaks

### Variabel dan Tipe Data

| IndonesianScript | TypeScript/JavaScript | Deskripsi |
|------------------|----------------------|-----------|
| `buatkan` | `let` | Variabel yang bisa diubah |
| `tetapkan` | `const` | Konstanta |
| `variabel` | `var` | Variabel dengan scope function |

#### Tipe Data

| IndonesianScript | JavaScript | Contoh |
|------------------|------------|---------|
| `teks` | `string` | `buatkan nama: teks = "Budi"` |
| `angka` | `number` | `buatkan umur: angka = 25` |
| `boolean` | `boolean` | `buatkan aktif: boolean = Benar` |
| `pecahan` | `float` | `buatkan nilai: pecahan = 3.14` |
| `apapun` | `any` | `buatkan data: apapun = {}` |

### Fungsi Bawaan

| IndonesianScript | JavaScript | Deskripsi |
|------------------|------------|-----------|
| `menampilkan()` | `console.log()` | Menampilkan output ke konsol |
| `menanyakan()` | `rl.prompt()` | Meminta input dari user |
| `bertanya()` | `rl.question()` | Bertanya kepada user |
| `waktu()` | `Date()` | Objek waktu |
| `tunggu()` | `setTimeout()` | Menunda eksekusi |

### Struktur Kontrol

#### Kondisi (If-Else)
```indonesian
jika (umur >= 17) {
    menampilkan("Sudah dewasa");
} selain jika (umur >= 13) {
    menampilkan("Remaja");
} selain {
    menampilkan("Anak-anak");
}
```

#### Perulangan
```indonesian
// For loop
untuk (buatkan i: angka = 0; i < 5; i++) {
    menampilkan(i);
}

// While loop
selama (kondisi) {
    // kode
}

// For-in loop
untuk (buatkan item dalam array) {
    menampilkan(item);
}
```

#### Switch Case
```indonesian
mengalihkan (nilai) {
    kasus 1:
        menampilkan("Satu");
        keluar;
    kasus 2:
        menampilkan("Dua");
        keluar;
    bawaan:
        menampilkan("Lainnya");
}
```

### Template String
```indonesian
buatkan nama: teks = "Budi";
buatkan pesan: teks = k"Halo {nama}!";
menampilkan(pesan); // Output: Halo Budi!
```

### Fungsi
```indonesian
fungsi sapa(nama: teks): teks {
    kembali k"Halo {nama}!";
}

// Arrow function
buatkan tambah = (a: angka, b: angka): angka => {
    kembali a + b;
};
```

### Async/Await
```indonesian
sinkron fungsi ambilData(): apapun {
    buatkan data = menunggu fetch("https://api.example.com");
    kembali data;
}
```

### Import/Export
```indonesian
// Import
dari './modul.js' impor fungsiUtama;
dari './utils.js' impor {helper, validator};
dari './library.js' impor * sebagai lib;

// Export
ekspor fungsi utilitas() {
    // kode
}

ekspor bawaan kelas MyClass {
    // kode
}
```

### Operator

| IndonesianScript | JavaScript | Deskripsi |
|------------------|------------|-----------|
| `setaraDengan` | `===` | Perbandingan ketat |
| `samaDengan` | `==` | Perbandingan biasa |
| `tidakSamaDengan` | `!==` | Tidak sama (ketat) |
| `dan` | `&&` | Operator AND |
| `atau` | `\|\|` | Operator OR |
| `bukan` | `!` | Operator NOT |
| `lebihDari` | `>` | Lebih besar |
| `kurangDari` | `<` | Lebih kecil |

### Exception Handling
```indonesian
coba {
    // kode yang mungkin error
} tangkap (error) {
    menampilkan("Terjadi kesalahan:", error);
} akhirnya {
    menampilkan("Selesai");
}
```

## 💡 Contoh Program

### Program Sederhana
```indonesian
// program.is
buatkan nama: teks = "IndonesianScript";
buatkan versi: teks = "0.1.0-beta";

menampilkan(k"Selamat datang di {nama} versi {versi}!");

fungsi hitungLuas(panjang: angka, lebar: angka): angka {
    kembali panjang * lebar;
}

buatkan luas = hitungLuas(10, 5);
menampilkan(k"Luas persegi panjang: {luas}");
```

### Program dengan Input
```indonesian
// kalkulator.is
menampilkan("=== Kalkulator Sederhana ===");

buatkan angka1: angka = 10;
buatkan angka2: angka = 5;

buatkan hasil = angka1 + angka2;
menampilkan(k"Hasil: {angka1} + {angka2} = {hasil}");
```

## 🔧 CLI Commands

### Menjalankan File
```bash
# Jalankan file .is
node running.js --run file.is

# Dengan verbose output
node running.js --run file.is --verbose

# Dengan watch mode
node running.js --run file.is --watch
```

### Transpilasi
```bash
# Transpile ke JavaScript
node running.js --transpile file.is

# Dengan output khusus
node running.js --transpile file.is --output result.js

# Dengan verbose
node running.js --transpile file.is --verbose
```

### Options
- `--run, -r` : Menjalankan file .is
- `--transpile, -t` : Transpile ke JavaScript
- `--output, -o` : Menentukan file output
- `--watch, -w` : Watch mode untuk development
- `--verbose, -v` : Output detail
- `--help, -h` : Menampilkan bantuan

## 🗂️ Struktur Project

```
Indonesian_Script/
├── translite.js         # Core transliterator
├── running.js          # CLI runner
├── package.json        # Package configuration
├── README.md          # Documentation
└── examples/          # Contoh program
    ├── hello.is
    ├── calculator.is
    └── advanced.is
```

## 🧪 Testing

```bash
# Test basic functionality
echo 'menampilkan("Halo Dunia!");' > test.is
node running.js --run test.is
```

## 🤝 Kontribusi

Kami sangat menghargai kontribusi dari komunitas! Berikut cara berkontribusi:

1. **Fork** repository ini
2. **Clone** fork Anda
3. Buat **branch** baru untuk fitur/perbaikan
4. **Commit** perubahan Anda
5. **Push** ke branch
6. Buat **Pull Request**

### Pedoman Kontribusi
- Gunakan conventional commits
- Tambahkan test untuk fitur baru
- Update dokumentasi jika diperlukan
- Pastikan semua test pass

## 🐛 Melaporkan Bug

Jika Anda menemukan bug, silakan buat issue dengan informasi:
- Versi IndonesianScript
- Sistem operasi
- Kode yang menyebabkan bug
- Error message
- Langkah untuk reproduksi

## 📋 Roadmap

- [x] ✅ Core transpiler
- [x] ✅ CLI tool
- [x] ✅ Basic syntax support
- [ ] 🔄 Web playground
- [ ] 🔄 VS Code extension
- [ ] 🔄 Package manager integration
- [ ] 🔄 Standard library expansion
- [ ] 🔄 Performance optimization

## 📄 Lisensi

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 👨‍💻 Author

**Elang Muhammad**
- Email: [elangmuhammad888@gmail.com](mailtoelangmuhammad888@gmail.com)
- GitHub: [@Elang-elang](https://github.com/Elang-elang)

## 🙏 Acknowledgments

- Komunitas JavaScript Indonesia
- TypeScript team untuk inspiration
- Semua kontributor yang telah membantu

---

<div align="center">

**Dibuat dengan ❤️ untuk komunitas developer Indonesia**

[⭐ Star](https://github.com/Elang-elang/indonesianscript) jika project ini membantu Anda!

</div>