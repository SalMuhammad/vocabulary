
const words = JSON.parse(localStorage.getItem('words'))|| []
// console.table(words);

// Memuat data kata saat halaman dimuat
loadWords(filterByTime(words,0,0,0))
// Pilihan untuk menampilkan
$('#ygDitampilkan').addEventListener('change', () => {
  $('#table-body').innerHTML = '';
  const pilihan = $('#ygDitampilkan').value;

  switch (pilihan) {
    case 'sekarang':
      loadWords(filterByTime(words, 0, 0, 0));
      break;
    case 'kemarin':
      loadWords(filterByTime(words, 0, 0, -1));
      break;
    case 'lusa':
      loadWords(filterByTime(words, 0, 0, -2));
      break;
    case '2minggu-lalu':
      loadWords(filterByTime(words, 0, 0, -14));
      break;
    case '18hari-lalu':
      loadWords(filterByTime(words, 0, 0, -18));
      break;
    case 'bulan-kemarin':
      loadWords(filterByTime(words, 0, -1, 0));
      break;
    case '2bulan-lalu':
      loadWords(filterByTime(words, 0, -2, 0));
      break; 
    case '5bulan-lalu':
      loadWords(filterByTime(words, 0, -5, 0));
      break;
    default:
      loadWords(words);
      break;
  }
});

// Menambahkan event listener untuk form saat di-submit
$('#add-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const english = $('#english').value.trim();
  const indonesian = $('#indonesian').value.trim ();
  
  if (english !== '' && indonesian !== '' && $('#date').value !== '') {
    const word = {
      english: english,
      indonesian: indonesian,
      date: $('#date').value
    };
    addWord(word);
    $('#add-form').reset();
    hilangkanForm()
  }
});

// Menambahkan event listener untuk tombol hapus
$('#table-body').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    const row = e.target.parentElement.parentElement;    
    const index = row.dataset.index;
    if(confirm('apakah yakin?')){
      deleteWord(index);
    }
  }
});

// Menambahkan event listener untuk tombol edit
$('#table-body').addEventListener('click', (e) => {
  if (e.target.classList.contains('edit')) {
    const row = e.target.parentElement.parentElement;
    const index = row.dataset.index;
    const word = getWord(index);
    editWord(index, word);
  }
})


function munculkanForm(){
  $('.overlay').classList.remove('hidden')
  tampilkanwaktuSekarang();
}
function hilangkanForm(elele){
  $('.overlay').classList.add('hidden')
}

function filterByTime(obj,tahun,bulan,tanggal) {
  // const sekarang = tambahkanNol(new Date()).toLocaleString();
  const tgl = tambahTanggal(new Date(), tanggal)
  const bln = tambahBulan(new Date(), bulan)
  const thn = tambahTahun(new Date(), tahun)
  const hari = `${thn}-${bln}-${tgl}`;
  return obj.filter(w =>  w.date === tambahkanNol(hari))
}

function tambahkanNol(dateString) {
  let dateObj = new Date(dateString);
  let month = dateObj.getMonth() + 1;
  let date = dateObj.getDate();
  return dateObj.getFullYear() + "-" + (month < 10 ? "0" + month : month) + "-" + (date < 10 ? "0" + date : date);
}


function $(ell){
  return document.querySelector(ell)
}

// Fungsi untuk memuat data kata dari localStorage ke tabel
function loadWords(words) {
  words.forEach((word, index) => {
      const row = document.createElement('tr');
      row.dataset.index = index;
      row.innerHTML = `
          <td class="text-right">${index + 1}</td>
          <td class="pl-2 relative">${word.english} <i class="bi bi-volume-up absolute right-0 pr-4"></i></td>
          <td>${word.indonesian}</td>
          <td class="w-10">
              <button onclick="editWord(${index}, ${word})" class="edit"><i class="bi bi-pen-fill text-green-600"></i></button>
              <button onclick="deleteWord(${index})" class="delete"><i class="bi bi-trash text-red-600"></i></button>
          </td>
      `;
      document.getElementById('table-body').appendChild(row);
  });
}

// // Fungsi untuk memuat data kata dari localStorage ke tabel
// function loadWords(words) {
//   words.forEach((word, index) => {
//     const row = document.createElement('tr')
//     row.dataset.index = index;
//     row.innerHTML = `
//       <td class="text-right">${index + 1}</td>
//       <td class="pl-2 relative">${word.english} <i class="bi bi-volume-up absolute right-0 pr-4"></i></td>
//       <td>${word.indonesian}</td>
      
//       <td class="w-10">
//       <button onclick="editWord(${index}, ${word})" class="edit"><i class="bi bi-pen-fill text-green-600"></i></button>
//       <button onclick="deleteWord(${index})" class="delete"><i class="bi bi-trash text-red-600"></i></button>
//       </td>
//     `
//     $('#table-body').appendChild(row);
    
//   })
// }

// Fungsi untuk menambahkan kata baru ke localStorage dan tabel
function addWord(word) {
  words.push(word);
  localStorage.setItem('words', JSON.stringify(words));
  
  
  const row = document.createElement('tr');
  row.dataset.index = words.length - 1;
  row.innerHTML = `
    <td class="text-right">${words.length}</td>
    <td class="pl-2">${word.english}</td>
    <td>${word.indonesian}</td>
   
    <td class="w-10">
      <button onclick="editWord(${index}, ${word})" class="edit"><i class="bi bi-pen-fill text-green-600"></i></button>
      <button onclick="deleteWord(${index})" class="delete"><i class="bi bi-trash text-red-600"></i></button>
      </td>
  `;
  $('#table-body').appendChild(row); 
}



// Fungsi untuk menghapus kata dari localStorage dan tabel
function deleteWord(index) {
//  const words = JSON.parse(localStorage.getItem('words')) || [];
  if(confirm('apakah benar ingin menghapus?')){
    words.splice(index, 1);
    localStorage.setItem('words', JSON.stringify(words));
    const rows = $('#table-body').querySelectorAll('tr');
    rows[index].remove();
    updateTableIndexes();
  }
}

// Fungsi untuk memperbarui nomor indeks pada tabel setelah dihapus
function updateTableIndexes() {
  const rows = $('#table-body').querySelectorAll('tr');
  rows.forEach((row, index) => {
    row.dataset.index = index;
    row.firstElementChild.textContent = index + 1;
  });
}

// Fungsi untuk mengambil kata dari localStorage berdasarkan index
function getWord(index) {
  return words[index];
}

// Fungsi untuk mengedit kata dalam localStorage dan tabel
function editWord(index, word) {
  const english = prompt('Bahasa Inggris:', word.english);
  const indonesian = prompt('Bahasa Indonesia:', word.indonesian);
  if (english !== null && indonesian !== null && english !== '' && indonesian !== '') {
    const newWord = {
      english: english,
      indonesian: indonesian,
      date: words[index].date
    };
  //  const words = JSON.parse(localStorage.getItem('words')) || [];
    words.splice(index, 1, newWord);
    localStorage.setItem('words', JSON.stringify(words));
    const row = $('#table-body').querySelector(`tr[data-index="${index}"]`);
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${newWord.english}</td>
      <td>${newWord.indonesian}</td>

      <td>
      <button class="edit"><i class="bi bi-pen text-green-600"></i></button>
      <button class="delete"><i class="bi bi-trash text-red-600"></i></button>
      </td>
    `;
    updateTableIndexes(); // tambahkan ini untuk memperbarui nomor indeks pada tabel
  }
}


// membunyikan bahasa ingris
document.getElementById('table-body').addEventListener('click', e => {
  if (e.target.classList.contains('bi-volume-up')) {
      const text = e.target.parentElement.textContent.trim();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // Menentukan bahasa (Inggris - US)

      // Membacakan teks menggunakan SpeechSynthesis API
      speechSynthesis.speak(utterance);
  }
});










// Fungsi untuk menambahkan atau mengurangi tanggal
function tambahTanggal(tanggal, jumlahHari) {
  var date = new Date(tanggal);
  date.setDate(date.getDate() + jumlahHari);
  return date.getDate();
}

// Fungsi untuk menambahkan atau mengurangi bulan
function tambahBulan(tanggal, jumlahBulan) {
  var date = new Date(tanggal);
  date.setMonth(date.getMonth() + jumlahBulan);
  return date.getMonth() +1;
}

// Fungsi untuk menambahkan atau mengurangi tahun
function tambahTahun(tanggal, jumlahTahun) {
  var date = new Date(tanggal);
  date.setFullYear(date.getFullYear() + jumlahTahun);
  return date.getFullYear();
}


// Contoh penggunaan fungsi untuk menambahkan atau mengurangi tanggal, bulan, dan tahun
var tanggalSekarang = new Date();
//console.log("Tanggal Sekarang:", tanggalSekarang);

var tgl = tambahTanggal(tanggalSekarang, -27);
//console.log("Tanggal setelah ditambah 7 hari:", tgl);
/*

//var bln = tambahBulan(tanggalSekarang, 2);
//console.log("Tanggal setelah ditambah 2 bulan:", bln);

//var thn = tambahTahun(tanggalSekarang, 5);
//console.log("Tanggal setelah ditambah 5 tahun:", thn);

*/


// funggsi menampilkan waktu sekarang
function tampilkanwaktuSekarang() {
  const dt = new Date();
  //const timeZoneOffset = + 420; // 7 jam = 7 x 60 menit = -420 menit
  // const localDate = new Date(dt.getTime()) //+ timeZoneOffset * 60 * 1000);
 // const currentDate = localDate.toISOString().slice(0, 16);
 const date= new Date().getDate()
 const month= new Date().getMonth() + 1
 const year= new Date().getFullYear()
 const currentDate = `0${date}/${month}/${year}`
  //console.log(currentDate)
 $('#date').value = currentDate
}









// Ambil elemen saklar dark mode
const toggleSwitch = document.getElementById('dark-mode-toggle');
const htmlElement = document.documentElement;

// Fungsi untuk mengaktifkan mode gelap
function enableDarkMode() {
  htmlElement.classList.add('dark'); // Tambahkan kelas 'dark'
  localStorage.setItem('theme', 'dark'); // Simpan preferensi ke localStorage
}

// Fungsi untuk menonaktifkan mode gelap
function disableDarkMode() {
  htmlElement.classList.remove('dark'); // Hapus kelas 'dark'
  localStorage.setItem('theme', 'light'); // Simpan preferensi ke localStorage
}

// Event listener untuk saklar
toggleSwitch.addEventListener('change', () => {
  if (toggleSwitch.checked) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});

// Periksa preferensi tema saat halaman dimuat
function initializeTheme() {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    enableDarkMode();
    toggleSwitch.checked = true; // Setel saklar ke posisi aktif
  } else {
    disableDarkMode();
    toggleSwitch.checked = false; // Setel saklar ke posisi nonaktif
  }
}

// Panggil fungsi inisialisasi saat halaman dimuat
initializeTheme();








const customMenu = document.getElementById('customMenu');

// Deteksi perubahan seleksi
document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
        // Mendapatkan posisi seleksi
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Tampilkan menu di posisi seleksi
        customMenu.style.top = `${window.scrollY + rect.bottom}px`;
        customMenu.style.left = `${rect.left}px`;
        customMenu.style.display = 'block';
    } else {
        customMenu.style.display = 'none';
    }
});

// Nonaktifkan menu konteks bawaan
document.addEventListener('contextmenu', (event) => {
    event.preventDefault(); // Mencegah menu bawaan browser
});

// Tambahkan aksi kustom saat menu diklik
customMenu.addEventListener('click', () => {
    alert('Menu khusus diklik!');
});




















































// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Text-to-Speech Demo</title>
//     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
//     <script src="js/responsivevoice.js"></script>
// </head>
// <body>
//     <table class="my-3 w-full">
//         <thead>
//             <tr class="bg-green-600 text-white dark:bg-green-800 dark:text-gray-200">
//                 <th>#</th>
//                 <th>Inggris</th>
//                 <th>Indonesia</th>
//                 <th></th>
//             </tr>
//         </thead>
//         <tbody id="table-body"></tbody>
//     </table>

//     <script>
//         // Fungsi untuk memuat data kata dari localStorage ke tabel
//         function loadWords(words) {
//             words.forEach((word, index) => {
//                 const row = document.createElement('tr');
//                 row.dataset.index = index;
//                 row.innerHTML = `
//                     <td class="text-right">${index + 1}</td>
//                     <td class="pl-2 relative">${word.english} <i class="bi bi-volume-up absolute right-0 pr-4"></i></td>
//                     <td>${word.indonesian}</td>
//                     <td class="w-10">
//                         <button onclick="editWord(${index}, ${word})" class="edit"><i class="bi bi-pen-fill text-green-600"></i></button>
//                         <button onclick="deleteWord(${index})" class="delete"><i class="bi bi-trash text-red-600"></i></button>
//                     </td>
//                 `;
//                 document.getElementById('table-body').appendChild(row);
//             });
//         }

//         document.getElementById('table-body').addEventListener('click', e => {
//             if (e.target.classList.contains('bi-volume-up')) {
//                 const text = e.target.parentElement.textContent.trim();
//                 const utterance = new SpeechSynthesisUtterance(text);
//                 utterance.lang = 'en-US'; // Menentukan bahasa (Inggris - US)

//                 // Membacakan teks menggunakan SpeechSynthesis API
//                 speechSynthesis.speak(utterance);
//             }
//         });

//         // Contoh data kata
//         const words = [
//             { english: 'dream', indonesian: 'mimpi' },
//             { english: 'one', indonesian: 'satu' },
//             { english: 'noticed', indonesian: 'terlihat' }
//         ];

//         // Memuat data kata ke tabel
//         loadWords(words);
//     </script>
// </body>
// </html>
