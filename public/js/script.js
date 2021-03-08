document.getElementById("lnkAbout").onclick = function () {
  document.getElementById("divAbout").removeAttribute("hidden");
  document.getElementById("divPictures").setAttribute("hidden", "");
  document.getElementById("divLocation").setAttribute("hidden", "");
  document.getElementById("divComments").setAttribute("hidden", "");
  document.getElementById("lnkPictures").classList.remove("active");
  document.getElementById("lnkAbout").classList.add("active");
  document.getElementById("lnkLocation").classList.remove("active");
  document.getElementById("lnkComments").classList.remove("active");
};

document.getElementById("lnkPictures").onclick = function () {
  document.getElementById("divAbout").setAttribute("hidden", "");
  document.getElementById("divPictures").removeAttribute("hidden");
  document.getElementById("divLocation").setAttribute("hidden", "");
  document.getElementById("divComments").setAttribute("hidden", "");
  document.getElementById("lnkAbout").classList.remove("active");
  document.getElementById("lnkPictures").classList.add("active");
  document.getElementById("lnkLocation").classList.remove("active");
  document.getElementById("lnkComments").classList.remove("active");
};

document.getElementById("lnkLocation").onclick = function () {
  document.getElementById("divAbout").setAttribute("hidden", "");
  document.getElementById("divPictures").setAttribute("hidden", "");
  document.getElementById("divLocation").removeAttribute("hidden");
  document.getElementById("divComments").setAttribute("hidden", "");
  document.getElementById("lnkAbout").classList.remove("active");
  document.getElementById("lnkPictures").classList.remove("active");
  document.getElementById("lnkLocation").classList.add("active");
  document.getElementById("lnkComments").classList.remove("active");
};

document.getElementById("lnkComments").onclick = function () {
  document.getElementById("divAbout").setAttribute("hidden", "");
  document.getElementById("divPictures").setAttribute("hidden", "");
  document.getElementById("divLocation").setAttribute("hidden", "");
  document.getElementById("divComments").removeAttribute("hidden");
  document.getElementById("lnkAbout").classList.remove("active");
  document.getElementById("lnkPictures").classList.remove("active");
  document.getElementById("lnkLocation").classList.remove("active");
  document.getElementById("lnkComments").classList.add("active");
};

const like = (element) => {
  axios
    .get(`/user/${element.getAttribute("data-user_id")}/like`)
    .then((response) => {
      if (response.data.match) {
        console.log("ITS A MATCH");
      }
      if (response.data.liked) {
        element.classList.add("btn-outline-danger");
        element.classList.remove("btn-outline-secondary");
      } else if (!response.data.liked) {
        element.classList.remove("btn-outline-danger");
        element.classList.add("btn-outline-secondary");
      }
    })
    .catch((e) => console.error("Error liking product", e));
};
