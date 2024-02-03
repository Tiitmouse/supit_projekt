(async () => {
//TODO napraviti request za jedan kolegij
    function autocomplete(inp, arr) {
        let currentFocus;
        inp.addEventListener("input", function (e) {
            let a,
                b,
                i,
                val = this.value;
            closeAllLists();
            if (!val) {
                return false;
            }
            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);
            for (i = 0; i < arr.length; i++) {
                if (arr[i].kolegij.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    b = document.createElement("DIV");
                    b.innerHTML =
                        "<strong>" + arr[i].kolegij.substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].kolegij.substr(val.length);
                    b.innerHTML += "<input type='hidden' value='" + arr[i].kolegij + "'>";
                    b.addEventListener("click", function (e) {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });
        inp.addEventListener("keydown", function (e) {
            let x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) {
                        x[currentFocus].click();
                        addKolegij();
                    }
                }
            }
        });

        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = x.length - 1;
            x[currentFocus].classList.add("autocomplete-active");
        }

        function removeActive(x) {
            for (let i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }

        function closeAllLists(elmnt) {
            let x = document.getElementsByClassName("autocomplete-items");
            for (let i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }

        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    const getEveryKolegij = async () => {
        const response = fetch(
            "https://www.fulek.com/data/api/supit/curriculum-list/hr",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const result = await response;
        if (result.status === 401) location.replace("../index.html");
        const dataJson = await result.json();
        return dataJson.data;
    };

    const deleteKolegij = (event) => {
        event.currentTarget.parentElement.parentElement.remove();
        calculateTotal();
    };

    const calculateTotal = () => {
        const vrijednosti = document.getElementById("content").children;

        const footerValues = {
            ects: 0,
            sati: 0,
            predavanja: 0,
            vjezbe: 0,
        }
        for (let i = 0; i < vrijednosti.length; i++) {

            footerValues.ects += Number(vrijednosti[i].children[1].innerText);
            footerValues.sati += Number(vrijednosti[i].children[2].innerText);
            footerValues.predavanja += Number(vrijednosti[i].children[3].innerText);
            footerValues.vjezbe += Number(vrijednosti[i].children[4].innerText);

        }

        const footer = document.getElementById("footer")
        footer.innerHTML = `
        <td>Ukupno</td>
        <td>${footerValues.ects}</td>
        <td>${footerValues.sati}</td>
        <td>${footerValues.predavanja}</td>
        <td>${footerValues.vjezbe}</td>
        <td></td>
        <td></td>`;
    };

    const createKolegijItem = (kolegij) => {
        const item = document.createElement("tr");
        item.id = kolegij.id;
        item.innerHTML = `
        <td>${kolegij.kolegij}</td>
        <td>${kolegij.ects}</td>
        <td>${kolegij.sati}</td>
        <td>${kolegij.predavanja}</td>
        <td>${kolegij.vjezbe}</td>
        <td>${kolegij.tip}</td>
        <td>
            <button class="btn bg-danger">
            delete
            </button>
        </td>`;
        item.children[6].children[0].addEventListener("click", deleteKolegij);
        return item;
    };

    const kolegiji = await getEveryKolegij();

    autocomplete(document.getElementById("floatingInput"), kolegiji);

    const addKolegij = () => {
        const value = document.getElementById("floatingInput").value;
        if (!value) {
            alert("Error");
            return;
        }
        const lista = document.querySelector("#content");
        if (kolegiji.length === 0) return;
        const kolegij = kolegiji.find((kolegij) => kolegij.kolegij === value);
        if (!kolegij) alert(`Kolegij ${value} ne postoji`);
        for (let i = 0; i < lista.children.length; i++) {
            if (lista.children[i].id == kolegij.id) {
                alert("Kolegij je već dodan");
                return;
            }
        }
        lista.append(createKolegijItem(kolegij));
        document.getElementById("floatingInput").value = "";
        calculateTotal();
    };

    document.querySelector("#DodajButton")
        .addEventListener("click", addKolegij);

})();
