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
                if (arr[i].kolegij.substr(0, val.length).toUpperCase() === val.toUpperCase()) {
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
        tooltip.innerHTML = `Kolegij: ${kolegij.kolegij}<br>ECTS: ${kolegij.ects}<br>Sati:   ${kolegij.sati}<br>Predavanja: ${kolegij.predavanja}<br>Vježbe: ${kolegij.vjezbe}`;
    }


    function hideKolegijDetails() {
        const tooltip = document.getElementById('tooltip');
        tooltip.innerHTML = '';
    }

    const getKolegijElement = (kolegij) => {
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
            Obriši
            </button>
        </td>`;
        item.querySelector('button').addEventListener('click', deleteKolegij);
        $(item).hover(showKolegijDetails, hideKolegijDetails);

        item.addEventListener('mouseenter', async function(event) {
            await showKolegijDetails.call(this); // Use call to set 'this' correctly
            document.getElementById('tooltip').style.display = 'block';
            document.getElementById('tooltip').style.left = `${event.pageX}px`;
            document.getElementById('tooltip').style.top = `${event.pageY}px`;
        });
        item.addEventListener('mouseleave', function() {
            document.getElementById('tooltip').style.display = 'none';
        });

        return item;
    };

    const sviKolegiji = await getEveryKolegij();

    autocomplete(document.getElementById("floatingInput"), sviKolegiji);

    const findKolegij = () => {
        const kolegiName = document.getElementById("floatingInput").value;
        const kolegij = sviKolegiji.find(k => k.kolegij.toLowerCase() === kolegiName.toLowerCase());
        if (!kolegij) {
            alert(`Ne možemo pronaci kolegij ${kolegiName}`);
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
