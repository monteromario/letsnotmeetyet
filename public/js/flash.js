setTimeout(() => {
  document.querySelectorAll('.toast').forEach(toast => {
    new bootstrap.Toast(toast).hide()
  })  
}, 5000);

let btnClose = document.getElementById('btn-close')

let close = function () {
  document.querySelectorAll('.toast').forEach(toast => {
    toast.setAttribute('hidden', '');
  })
}

if (btnClose) {
  btnClose.onclick = close
}