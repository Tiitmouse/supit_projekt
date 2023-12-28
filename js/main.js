const logout = () => {
  if (sessionStorage.getItem("token")) {
    sessionStorage.removeItem("token");
    location.reload();
  } else {
    alert("How the duck even?");
  }
};

(() => {
  if (sessionStorage.getItem("token")) {
    const prijavaElement = document.querySelector("#prijavaStatus");
    prijavaElement.innerHTML = `
        <p> ${sessionStorage.getItem("username")}</p>
        <a class="nav-link" href="#" onclick="logout()">Odjava</a>`;
  }
  else {
    const nastavniPlanElement = document.getElementById("nastavniPlanLink");
    nastavniPlanElement.style.display = "none";
  }
})();
