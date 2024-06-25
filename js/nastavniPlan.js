(async () => {
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
                if (arr[i].kolegij.substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                    b = document.createElement("DIV");
                    b.innerHTML =
                        `<strong>${arr[i].kolegij.substr(0, val.length)}</strong>${arr[i].kolegij.substr(val.length)}<input type='hidden'value='${arr[i].kolegij}'>`;

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
                    }
                }
                findKolegij();
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
            const autocompleteItems = document.getElementsByClassName("autocomplete-items");
            for (let i = 0; i < autocompleteItems.length; i++) {
            if (elmnt !== autocompleteItems[i] && elmnt !== inp) {
                autocompleteItems[i].parentNode.removeChild(autocompleteItems[i]);
            }
            }
        }

        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    const getEveryKolegij = () => {
        return $.ajax({
            url: "https://www.fulek.com/data/api/supit/curriculum-list/hr",
            method: "GET",
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            statusCode: {
                401: () => {
                    location.replace("../index.html");
                }
            }
        }).then(result => {
            return result.data;
        });
    };

    const getKolegijById = (id) => {
        return $.ajax({
            url: `https://www.fulek.com/data/api/supit/get-curriculum/${id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            statusCode: {
                401: function () {
                    location.replace("../index.html");
                }
            }
        }).then(result => {
            return result.data;
        });
    };

        const deleteKolegij = (e) => {
            e.currentTarget.parentElement.parentElement.remove();
            calculateTotal();
            const tooltip = document.getElementById('tooltip');
            tooltip.style.display = 'none';
        };


    const calculateTotal = () => {
        const vrijednosti = document.getElementById("content").children;

        let totalEcts = 0;
        let totalSati = 0;
        let totalPredavanja = 0;
        let totalVjezbe = 0;

        for (let i = 0; i < vrijednosti.length; i++) {
            totalEcts += Number(vrijednosti[i].children[1].innerText);
            totalSati += Number(vrijednosti[i].children[2].innerText);
            totalPredavanja += Number(vrijednosti[i].children[3].innerText);
            totalVjezbe += Number(vrijednosti[i].children[4].innerText);
        }

        const footer = document.getElementById("footer");
        footer.innerHTML = `
        <td>Ukupno</td>
        <td>${totalEcts}</td>
        <td>${totalSati}</td>
        <td>${totalPredavanja}</td>
        <td>${totalVjezbe}</td>
        <td></td>
        <td></td>`;
    };

    function storeKolegijToSessionStorage(kolegij) {
        const kolegijJson = JSON.stringify(kolegij);
        sessionStorage.setItem(`kolegij-${kolegij.id}`, kolegijJson);
    }

    function getKolegijFromSessionStorage(id) {
        const kolegijJson = sessionStorage.getItem(`kolegij-${id}`);
        if (kolegijJson) {
            return JSON.parse(kolegijJson);
        }
        return undefined;
    }

    async function showKolegijDetails() {
        const kolegijId = this.id;
        let kolegij = getKolegijFromSessionStorage(kolegijId);
        if (!kolegij) {
            kolegij = await getKolegijById(kolegijId).then(kolegij => {
                return kolegij;
            });
            storeKolegijToSessionStorage(kolegij);
        }
        const tooltip = document.getElementById('tooltip');
        tooltip.innerHTML = `Kolegij: ${kolegij.kolegij}<br>ECTS: ${kolegij.ects}<br>Sati:
        ${kolegij.sati}<br>Predavanja: ${kolegij.predavanja}<br>Vježbe: ${kolegij.vjezbe}`;
    }


    function hideKolegijDetails() {
        const tooltip = document.getElementById('tooltip');
        tooltip.innerHTML = '';
    }

    const getKolegijElement = (kolegij) => {
        const tableRow = document.createElement("tr");
        tableRow.id = kolegij.id;
        tableRow.innerHTML = `
        <td>${kolegij.kolegij}</td>
        <td>${kolegij.ects}</td>
        <td>${kolegij.sati}</td>
        <td>${kolegij.predavanja}</td>
        <td>${kolegij.vjezbe}</td>
        <td>${kolegij.tip}</td>
        <td>
            <button class="btn bg-danger">
            Obriši
            </button>
        </td>`;
        tableRow.querySelector('button').addEventListener('click', deleteKolegij);
        $(tableRow).hover(showKolegijDetails, hideKolegijDetails);

         tableRow.addEventListener('mouseenter', async function(event) {
            await showKolegijDetails.call(this);
             document.getElementById('tooltip').style.display = 'block';
             document.getElementById('tooltip').style.left = `${event.pageX}px`;
             document.getElementById('tooltip').style.top = `${event.pageY}px`;
         });
         tableRow.addEventListener('mouseleave', function() {
             document.getElementById('tooltip').style.display = 'none';
         });

        return tableRow;
    };


    autocomplete(document.getElementById("floatingInput"), await getEveryKolegij());

    async function findKolegij  () {
        const kolegijName = document.getElementById("floatingInput").value;
        const list = await getEveryKolegij();
        const kolegij = list.find(k => k.kolegij.toLowerCase() === kolegijName.toLowerCase());
        if (!kolegij) {
            alert(`Ne možemo pronaci kolegij ${kolegijName}`);
            return;
        }

        try {
            addKolegij(kolegij);
        } catch (e) {
            alert(e.message)
        } finally {
            document.getElementById("floatingInput").value = "";
            calculateTotal();
        }
    }

    const addKolegij = (kolegij) => {
        const listaElemenata = document.getElementById("content");
        const listaKolegija = [...listaElemenata.children];
        if (listaKolegija.some(k => k.id === kolegij.id.toString())) {
            throw new Error("Kolegij već postoji");
        } else {
            listaElemenata.append(getKolegijElement(kolegij));
        }
    };

    document.querySelector("#DodajButton")
        .addEventListener("click", findKolegij);

})();
