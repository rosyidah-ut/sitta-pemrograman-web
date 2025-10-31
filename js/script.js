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

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function toggleSubmenu(event) {
    event.preventDefault();
    const submenu = document.getElementById('laporanSubmenu');
    if (submenu) {
        submenu.classList.toggle('show');
    }
}

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

if (document.getElementById('totalBahan')) {
    const totalBahan = dataBahanAjar.length;
    const totalStok = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);
    
    document.getElementById('totalBahan').textContent = totalBahan;
    document.getElementById('totalStok').textContent = totalStok.toLocaleString('id-ID');
    
    const trackingKeys = Object.keys(dataTracking);
    const totalPengiriman = trackingKeys.length;
    const dalamPerjalanan = trackingKeys.filter(key => {
        const status = dataTracking[key].status.toLowerCase();
        return status.includes('dalam perjalanan') || status.includes('dikirim');
    }).length;
    
    document.getElementById('totalPengiriman').textContent = totalPengiriman;
    document.getElementById('dalamPerjalanan').textContent = dalamPerjalanan;
}

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

function updateProgressBar(status, prefix) {
    const statusLower = status.toLowerCase();
    let progress = 0;
    
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(prefix + 'Step' + i);
        if (step) {
            step.classList.remove('completed', 'active');
        }
    }
    
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
    
    const progressLine = document.getElementById(prefix + 'Line');
    if (progressLine) {
        progressLine.style.width = progress + '%';
    }
}

function formatDate(dateString) {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const date = new Date(dateString);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

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

function closeDetail() {
    document.getElementById('detailModal').classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

if (document.getElementById('stokTableBody')) {
    loadStokTable();
}

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

function tambahBahanAjar(event) {
    event.preventDefault();
    
    const newItem = {
        kodeLokasi: document.getElementById('kodeLokasi').value,
        kodeBarang: document.getElementById('kodeBarang').value,
        namaBarang: document.getElementById('namaBarang').value,
        jenisBarang: document.getElementById('jenisBarang').value,
        edisi: document.getElementById('edisi').value,
        stok: parseInt(document.getElementById('stok').value),
        cover: 'img/default.jpg'
    };
    
    dataBahanAjar.push(newItem);
    
    loadStokTable();
    
    document.getElementById('addStokForm').reset();
    
    alert('Bahan ajar berhasil ditambahkan!');
}
