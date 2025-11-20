
// Simple front-end app.js to manage pegawai using localStorage
(function(){
  // init sample data if none
  if(!localStorage.getItem('absensi_pegawai')){
    const sample = [
      {id:1, nama:'Admin', kode:'20231100111', username:'admin', jk:'Laki-laki', shift:'Pagi', verifikasi:true, foto:'../assets/img/user1.svg'},
      {id:2, nama:'Imi', kode:'1212121', username:'imi', jk:'Perempuan', shift:'Siang', verifikasi:false, foto:'../assets/img/user2.svg'}
    ];
    localStorage.setItem('absensi_pegawai', JSON.stringify(sample));
  }

  // helper
  function qs(sel){ return document.querySelector(sel); }
  window.absensi = {
    getPegawai: function(){
      return JSON.parse(localStorage.getItem('absensi_pegawai')||'[]');
    },
    savePegawai: function(arr){
      localStorage.setItem('absensi_pegawai', JSON.stringify(arr));
    },
    addPegawai: function(obj){
      const arr = this.getPegawai();
      obj.id = Date.now();
      arr.push(obj);
      this.savePegawai(arr);
    },
    updatePegawai: function(id, data){
      const arr = this.getPegawai().map(p=> p.id==id ? Object.assign(p,data) : p);
      this.savePegawai(arr);
    },
    deletePegawai: function(id){
      const arr = this.getPegawai().filter(p=> p.id!=id);
      this.savePegawai(arr);
    },
    findById: function(id){
      return this.getPegawai().find(p=> p.id==id);
    }
  };

  // If we're on data-pegawai page, render table and attach events
  if(window.location.pathname.endsWith('/pages/data-pegawai.html')){
    const tbody = qs('#tblPeg tbody');
    function render(){
      tbody.innerHTML = '';
      const data = absensi.getPegawai();
      data.forEach(p=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><img src="${p.foto}" alt=""></td>
          <td>${p.nama}</td>
          <td>${p.kode}</td>
          <td>${p.username}</td>
          <td>${p.jk}</td>
          <td>${p.shift}</td>
          <td>${p.verifikasi ? '<span class="badge bg-success">Terverifikasi</span>' : '<span class="badge bg-secondary">Belum</span>'}</td>
          <td>
            <a class="btn btn-sm btn-info me-1" href="edit-pegawai.html?id=${p.id}">Edit</a>
            <button class="btn btn-sm btn-danger btn-delete" data-id="${p.id}">Hapus</button>
          </td>`;
        tbody.appendChild(tr);
      });
      document.querySelectorAll('.btn-delete').forEach(btn=>{
        btn.addEventListener('click', function(){
          if(confirm('Hapus pegawai ini?')){
            absensi.deletePegawai(this.dataset.id);
            render();
          }
        });
      });
    }
    render();
  }

  // If on add-pegawai page
  if(window.location.pathname.endsWith('/pages/add-pegawai.html')){
    const form = qs('#formAdd');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const fd = new FormData(form);
      const obj = {
        nama: fd.get('nama'),
        kode: fd.get('kode'),
        username: fd.get('username'),
        jk: fd.get('jk'),
        shift: fd.get('shift'),
        verifikasi: fd.get('verifikasi') === 'on',
        foto: '../assets/img/user1.svg'
      };
      absensi.addPegawai(obj);
      alert('Pegawai ditambahkan');
      window.location.href = 'data-pegawai.html';
    });
  }

  // If on edit page
  if(window.location.pathname.endsWith('/pages/edit-pegawai.html')){
    const url = new URL(window.location.href);
    const id = Number(url.searchParams.get('id'));
    const p = absensi.findById(id);
    if(p){
      qs('#nama').value = p.nama;
      qs('#kode').value = p.kode;
      qs('#username').value = p.username;
      qs('#jk').value = p.jk;
      qs('#shift').value = p.shift;
      qs('#verifikasi').checked = p.verifikasi;
    }
    qs('#formEdit').addEventListener('submit', function(e){
      e.preventDefault();
      const fd = new FormData(this);
      absensi.updatePegawai(id, {
        nama: fd.get('nama'),
        kode: fd.get('kode'),
        username: fd.get('username'),
        jk: fd.get('jk'),
        shift: fd.get('shift'),
        verifikasi: fd.get('verifikasi')==='on'
      });
      alert('Data disimpan');
      window.location.href = 'data-pegawai.html';
    });
  }

})();
