document.getElementById('lnkPictures').onclick = function(){
    document.getElementById('divAbout').setAttribute('hidden', '');
    document.getElementById('divPictures').removeAttribute('hidden');
    document.getElementById('lnkPictures').classList.toggle('active');
    document.getElementById('lnkAbout').classList.toggle('active');
}

document.getElementById('lnkAbout').onclick = function(){
    document.getElementById('divPictures').setAttribute('hidden', '');
    document.getElementById('divAbout').removeAttribute('hidden');
    document.getElementById('lnkPictures').classList.toggle('active');
    document.getElementById('lnkAbout').classList.toggle('active');
}