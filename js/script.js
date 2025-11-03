// Fungsi untuk cek autentikasi
function checkAuth() {
    const currentUser = sessionStorage.getItem('currentUser');
    const currentPage = window.location.pathname;
    
    if (!currentUser && !currentPage.includes('index.html') && currentPage !== '/') {
        window.location.href = 'index.html';
        return null;
    }
    
    if (currentUser) {
        return JSON.parse(currentUser);
    }
    
    return null;
}

// Fungsi logout
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Set greeting berdasarkan waktu
function setGreeting() {
    const hour = new Date().getHours();
    const greetingText = document.getElementById('greetingText');
    const greetingSubtext = document.getElementById('greetingSubtext');
    const user = checkAuth();
    
    if (greetingText && user) {
        let greeting = '';
        let subtext = '';
        
        if (hour >= 5 && hour < 11) {
            greeting = `Selamat Pagi, ${user.nama.split(' ')[0]}! ☀️`;
            subtext = 'Semangat memulai hari dengan produktif!';
        } else if (hour >= 11 && hour < 15) {
            greeting = `Selamat Siang, ${user.nama.split(' ')[0]}! 🌤️`;
            subtext = 'Tetap semangat di tengah hari yang sibuk!';
        } else if (hour >= 15 && hour < 18) {
            greeting = `Selamat Sore, ${user.nama.split(' ')[0]}! 🌅`;
            subtext = 'Ayo selesaikan tugas hari ini dengan baik!';
        } else {
            greeting = `Selamat Malam, ${user.nama.split(' ')[0]}! 🌙`;
            subtext = 'Waktu yang tepat untuk review dan evaluasi!';
        }
        
        greetingText.textContent = greeting;
        greetingSubtext.textContent = subtext;
    }
}

function toggleSubmenu(event) {
    event.preventDefault();
    const submenu = document.getElementById('laporanSubmenu');
    const menuLink = event.currentTarget;
    
    if (submenu) {
        submenu.classList.toggle('show');
        menuLink.classList.toggle('submenu-open');
    }
}

// Login form handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('errorMessage');
        
        const user = dataPengguna.find(u => u.email === email && u.password === password);
        
        if (user) {
            const safeUserData = {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role,
                lokasi: user.lokasi
            };
            sessionStorage.setItem('currentUser', JSON.stringify(safeUserData));
            window.location.href = 'dashboard.html';
        } else {
            errorDiv.innerHTML = '<div class="alert alert-danger">Email atau password salah!</div>';
            setTimeout(() => {
                errorDiv.innerHTML = '';
            }, 3000);
        }
    });
}

// Modal Functions - Cek dulu apakah element ada
if (document.getElementById("forgotPasswordModal")) {
    const forgotPasswordModal = document.getElementById("forgotPasswordModal");
    const registerModal = document.getElementById("registerModal");
    const openForgotPassword = document.getElementById("openForgotPassword");
    const openRegister = document.getElementById("openRegister");
    const closeForgotPassword = document.getElementById("closeForgotPassword");
    const closeRegister = document.getElementById("closeRegister");

    // Open Modals
    openForgotPassword.addEventListener("click", () => {
      forgotPasswordModal.classList.add("active");
    });

    openRegister.addEventListener("click", () => {
      registerModal.classList.add("active");
    });

    // Close Modals
    closeForgotPassword.addEventListener("click", () => {
      forgotPasswordModal.classList.remove("active");
    });

    closeRegister.addEventListener("click", () => {
      registerModal.classList.remove("active");
    });

    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target === forgotPasswordModal) {
        forgotPasswordModal.classList.remove("active");
      }
      if (e.target === registerModal) {
        registerModal.classList.remove("active");
      }
    });

    // Forgot Password Form
    document.getElementById("forgotPasswordForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("forgotEmail").value;
      document.getElementById("forgotSuccessMessage").classList.add("active");
      setTimeout(() => {
        forgotPasswordModal.classList.remove("active");
        document.getElementById("forgotPasswordForm").reset();
        document.getElementById("forgotSuccessMessage").classList.remove("active");
      }, 2000);
    });

    // Register Form
    document.getElementById("registerForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const password = document.getElementById("regPassword").value;
      const confirmPassword = document.getElementById("regConfirmPassword").value;

      if (password !== confirmPassword) {
        alert("Password tidak cocok!");
        return;
      }

      document.getElementById("registerSuccessMessage").classList.add("active");
      setTimeout(() => {
        registerModal.classList.remove("active");
        document.getElementById("registerForm").reset();
        document.getElementById("registerSuccessMessage").classList.remove("active");
      }, 2000);
    });
}

// Set user info di semua halaman
if (window.location.pathname.includes('dashboard.html') || 
    window.location.pathname.includes('tracking.html') || 
    window.location.pathname.includes('stok.html')) {
    
    const user = checkAuth();
    
    if (user) {
        const userNameElements = document.querySelectorAll('#userName');
        const userRoleElements = document.querySelectorAll('#userRole');
        const userLocationElements = document.querySelectorAll('#userLocation');
        const userAvatarElements = document.querySelectorAll('#userAvatar');
        
        userNameElements.forEach(el => el.textContent = user.nama);
        userRoleElements.forEach(el => el.textContent = user.role);
        userLocationElements.forEach(el => el.textContent = user.lokasi);
        
        const initials = user.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        userAvatarElements.forEach(el => el.textContent = initials);
    }
}

// Theme toggle
if (document.getElementById('themeToggle')) {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
      body.classList.add('dark-mode');
    }
}

// Animate Progress Bars
function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progress-fill');
  
  progressBars.forEach((bar, index) => {
    const progress = bar.getAttribute('data-progress');
    setTimeout(() => {
      bar.style.width = progress + '%';
    }, index * 150);
  });
}

// Counter Animation for Metric Values
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    if (element.textContent.includes('$')) {
      element.textContent = '$' + Math.floor(current).toLocaleString();
    } else if (element.textContent.includes('%')) {
      element.textContent = current.toFixed(2) + '%';
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}


document.addEventListener('DOMContentLoaded', function() {
    
    // Cek apakah di halaman dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        
        // Set greeting
        setGreeting();
        
        // Animate metric values setelah page load
        setTimeout(() => {
            const metricValues = document.querySelectorAll('.metric-value');
            
            metricValues.forEach((metric, index) => {
                const text = metric.textContent;
                let targetValue;
                
                if (text.includes('$')) {
                    targetValue = parseFloat(text.replace(/[$,]/g, ''));
                } else if (text.includes('%')) {
                    targetValue = parseFloat(text.replace('%', ''));
                } else {
                    targetValue = parseFloat(text.replace(/,/g, ''));
                }
                
                metric.textContent = text.includes('$') ? '$0' : (text.includes('%') ? '0%' : '0');
                
                setTimeout(() => {
                    animateCounter(metric, targetValue);
                }, 300 + (index * 150));
            });
        }, 100);
        
        // Animate progress bars
        setTimeout(() => {
            animateProgressBars();
        }, 500);
        
        // Hover effect for metric cards
        document.querySelectorAll('.metric-card').forEach(card => {
          card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.metric-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
          });
          
          card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.metric-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
          });
        });
        
        // Add pulse animation to trend badges
        document.querySelectorAll('.trend-badge').forEach(badge => {
          setInterval(() => {
            badge.style.transform = 'scale(1.05)';
            setTimeout(() => {
              badge.style.transform = 'scale(1)';
            }, 150);
          }, 3000);
        });
    }
});

// Fungsi untuk search delivery order
function searchDeliveryOrder() {
    const searchValue = document.getElementById('searchDO').value.trim();
    const trackingResult = document.getElementById('trackingResult');
    const notFound = document.getElementById('notFound');
    
    if (!searchValue) {
        alert('Silakan masukkan nomor delivery order');
        return;
    }
    
    const tracking = dataTracking[searchValue];
    
    if (tracking) {
        notFound.style.display = 'none';
        trackingResult.classList.add('show');
        
        document.getElementById('resultNomorDO').textContent = tracking.nomorDO;
        document.getElementById('resultNama').textContent = tracking.nama;
        document.getElementById('resultEkspedisi').textContent = tracking.ekspedisi;
        document.getElementById('resultTanggal').textContent = formatDate(tracking.tanggalKirim);
        document.getElementById('resultPaket').textContent = tracking.paket;
        document.getElementById('resultTotal').textContent = tracking.total;
        
        updateProgressBar(tracking.status, 'progress');
        
        const timeline = document.getElementById('timeline');
        timeline.innerHTML = '';
        
        tracking.perjalanan.forEach(item => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="timeline-time">${item.waktu}</div>
                <div class="timeline-content">${item.keterangan}</div>
            `;
            timeline.appendChild(timelineItem);
        });
    } else {
        trackingResult.classList.remove('show');
        notFound.style.display = 'block';
    }
}

// Fungsi untuk update progress bar
function updateProgressBar(status, prefix) {
    const statusLower = status.toLowerCase();
    let progress = 0;
    
    // Reset semua step
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(prefix + 'Step' + i);
        if (step) {
            step.classList.remove('completed', 'active');
        }
    }
    
    // Set progress berdasarkan status
    if (statusLower.includes('terkirim') || statusLower.includes('selesai')) {
        progress = 100;
        for (let i = 1; i <= 4; i++) {
            const step = document.getElementById(prefix + 'Step' + i);
            if (step) step.classList.add('completed');
        }
    } else if (statusLower.includes('dalam perjalanan')) {
        progress = 66;
        for (let i = 1; i <= 3; i++) {
            const step = document.getElementById(prefix + 'Step' + i);
            if (step) {
                if (i === 3) {
                    step.classList.add('active');
                } else {
                    step.classList.add('completed');
                }
            }
        }
    } else if (statusLower.includes('diproses')) {
        progress = 33;
        const step1 = document.getElementById(prefix + 'Step1');
        const step2 = document.getElementById(prefix + 'Step2');
        if (step1) step1.classList.add('completed');
        if (step2) step2.classList.add('active');
    } else {
        progress = 0;
        const step1 = document.getElementById(prefix + 'Step1');
        if (step1) step1.classList.add('active');
    }
    
    // Update progress line
    const progressLine = document.getElementById(prefix + 'Line');
    if (progressLine) {
        progressLine.style.width = progress + '%';
    }
}

// Fungsi untuk format tanggal
function formatDate(dateString) {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const date = new Date(dateString);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Load tabel tracking di halaman tracking.html
if (document.getElementById('trackingTableBody')) {
    const tableBody = document.getElementById('trackingTableBody');
    
    Object.keys(dataTracking).forEach(key => {
        const tracking = dataTracking[key];
        const row = document.createElement('tr');
        
        let badgeClass = 'badge-info';
        if (tracking.status.toLowerCase().includes('terkirim')) {
            badgeClass = 'badge-success';
        } else if (tracking.status.toLowerCase().includes('dalam perjalanan')) {
            badgeClass = 'badge-warning';
        }
        
        row.innerHTML = `
            <td>${tracking.nomorDO}</td>
            <td>${tracking.nama}</td>
            <td>${tracking.ekspedisi}</td>
            <td>${formatDate(tracking.tanggalKirim)}</td>
            <td><span class="badge ${badgeClass}">${tracking.status}</span></td>
            <td>${tracking.total}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="showDetail('${key}')">Lihat Detail</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Fungsi untuk show detail tracking
function showDetail(nomorDO) {
    const tracking = dataTracking[nomorDO];
    
    if (tracking) {
        document.getElementById('detailNomorDO').textContent = tracking.nomorDO;
        document.getElementById('detailNama').textContent = tracking.nama;
        document.getElementById('detailEkspedisi').textContent = tracking.ekspedisi;
        document.getElementById('detailTanggal').textContent = formatDate(tracking.tanggalKirim);
        document.getElementById('detailPaket').textContent = tracking.paket;
        document.getElementById('detailTotal').textContent = tracking.total;
        
        updateProgressBar(tracking.status, 'detailProgress');
        
        const timeline = document.getElementById('detailTimeline');
        timeline.innerHTML = '';
        
        tracking.perjalanan.forEach(item => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="timeline-time">${item.waktu}</div>
                <div class="timeline-content">${item.keterangan}</div>
            `;
            timeline.appendChild(timelineItem);
        });
        
        document.getElementById('detailModal').classList.add('show');
        window.scrollTo({ top: document.getElementById('detailModal').offsetTop - 20, behavior: 'smooth' });
    }
}

// Fungsi untuk close detail modal
function closeDetail() {
    document.getElementById('detailModal').classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Load tabel stok di halaman stok.html
if (document.getElementById('stokTableBody')) {
    loadStokTable();
}

// Fungsi untuk load tabel stok
function loadStokTable() {
    const tableBody = document.getElementById('stokTableBody');
    tableBody.innerHTML = '';
    
    dataBahanAjar.forEach(item => {
        const row = document.createElement('tr');
        
        let badgeClass = 'badge-success';
        let statusText = 'Tersedia';
        
        if (item.stok < 100) {
            badgeClass = 'badge-warning';
            statusText = 'Stok Menipis';
        }
        if (item.stok < 50) {
            badgeClass = 'badge-danger';
            statusText = 'Stok Kritis';
        }
        
        row.innerHTML = `
            <td>${item.kodeLokasi}</td>
            <td>${item.kodeBarang}</td>
            <td>${item.namaBarang}</td>
            <td>${item.jenisBarang}</td>
            <td>${item.edisi}</td>
            <td>${item.stok.toLocaleString('id-ID')}</td>
            <td><span class="badge ${badgeClass}">${statusText}</span></td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Fungsi untuk tambah bahan ajar
function tambahBahanAjar(event) {
    event.preventDefault();
    
    const newItem = {
        kodeLokasi: document.getElementById('kodeLokasi').value,
        kodeBarang: document.getElementById('kodeBarang').value,
        namaBarang: document.getElementById('namaBarang').value,
        jenisBarang: document.getElementById('jenisBarang').value,
        edisi: document.getElementById('edisi').value,
        stok: parseInt(document.getElementById('stok').value),
    };
    
    dataBahanAjar.push(newItem);
    
    loadStokTable();
    
    document.getElementById('addStokForm').reset();
    
    alert('Bahan ajar berhasil ditambahkan!');
}