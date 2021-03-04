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
  console.log("LIKED");
  //   axios
  //     .get(`/product/${element.getAttribute("data-productid")}/like`)
  //     .then((response) => {
  //       // Change icon to liked/disliked
  //       // Change like number
  //       element.classList.toggle("unliked");
  //       const likeNumber = element.querySelector("span");
  //       likeNumber.innerText = Number(likeNumber.innerText) + response.data.add;
  //     })
  //     .catch((e) => console.error("Error liking product", e));
};
