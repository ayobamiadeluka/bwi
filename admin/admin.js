# Admin JavaScript

```javascript
let allWomen = [];

let allExcos = [];


/* =========================
   AUTH CHECK
========================= */

async function checkAuth() {

    const response =
        await fetch("/api/admin/me");


    if (!response.ok) {

        window.location =
            "/admin/login.html";

        return false;

    }

    return true;

}


/* =========================
   PAGE SWITCHING
========================= */

function showPage(page) {

    document
        .querySelectorAll(".page")
        .forEach(section => {

            section.classList.add("hidden");

        });


    document
        .getElementById(
            `${page}Page`
        )
        .classList.remove("hidden");


    if (page === "women") {

        loadWomen();

    }


    if (page === "excos") {

        loadExcos();

    }


    if (page === "wards") {

        loadWards();

    }

}


/* =========================
   STATS
========================= */

async function loadStats() {

    const response =
        await fetch(
            "/api/admin/stats"
        );


    if (!response.ok) return;


    const stats =
        await response.json();


    document.getElementById(
        "statWomen"
    ).textContent =
        stats.women;

}


/* =========================
   WOMEN
========================= */

async function loadWomen() {

    const response =
        await fetch(
            "/api/admin/women"
        );


    allWomen =
        await response.json();


    renderWomen(allWomen);

}


function renderWomen(women) {

    const table =
        document.getElementById(
            "womenTable"
        );


    table.innerHTML = "";


    women.forEach(woman => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(woman.name)}
            </td>

            <td>
                ${escapeHTML(woman.phone)}
            </td>

            <td>
                ${escapeHTML(woman.bank)}
            </td>

            <td>
                ${escapeHTML(woman.account)}
            </td>

            <td>
                ${escapeHTML(woman.ward)}
            </td>

            <td>

                <button
                    class="delete"
                    onclick="deleteWoman(${woman.id})"
                >
                    Delete
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


function filterWomen() {

    const query =
        document
            .getElementById(
                "adminSearch"
            )
            .value
            .toLowerCase();


    const filtered =
        allWomen.filter(woman =>
            woman.name
                .toLowerCase()
                .includes(query) ||

            woman.ward
                .toLowerCase()
                .includes(query)
        );


    renderWomen(filtered);

}


async function deleteWoman(id) {

    if (
        !confirm(
            "Delete this registration?"
        )
    ) return;


    const response =
        await fetch(
            `/api/admin/women/${id}`,
            {
                method: "DELETE"
            }
        );


    if (response.ok) {

        loadWomen();

        loadStats();

    }

}


/* =========================
   EXCOS
========================= */

async function loadExcos() {

    const response =
        await fetch(
            "/api/admin/excos"
        );


    allExcos =
        await response.json();


    const container =
        document.getElementById(
            "excosContainer"
        );


    container.innerHTML = "";


    const grouped = {};


    allExcos.forEach(exco => {

        if (!grouped[exco.ward]) {

            grouped[exco.ward] = [];

        }

        grouped[exco.ward].push(exco);

    });


    Object.entries(grouped)
        .forEach(
            ([ward, excos]) => {

                const section =
                    document.createElement(
                        "div"
                    );


                section.className =
                    "exco-ward";


                section.innerHTML =
                    `<h2>${escapeHTML(ward)}</h2>`;


                excos.forEach(exco => {

                    const row =
                        document.createElement(
                            "div"
                        );


                    row.className =
                        "exco-row";


                    row.innerHTML = `

                        <strong>
                            ${escapeHTML(
                                exco.position
                            )}
                        </strong>

                        <input
                            id="exco-${exco.id}"
                            value="${escapeHTML(
                                exco.name
                            )}"
                            placeholder="Enter name"
                        >

                        <button
                            class="save-btn"
                            onclick="saveExco(${exco.id})"
                        >
                            Save
                        </button>

                    `;


                    section.appendChild(row);

                });


                container.appendChild(
                    section
                );

            }
        );

}


async function saveExco(id) {

    const input =
        document.getElementById(
            `exco-${id}`
        );


    const response =
        await fetch(
            `/api/admin/excos/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        name: input.value
                    })
            }
        );


    if (response.ok) {

        alert(
            "Exco updated successfully."
        );

    }

}


/* =========================
   WARDS
========================= */

async function loadWards() {

    const response =
        await fetch(
            "/api/wards"
        );


    const wards =
        await response.json();


    const container =
        document.getElementById(
            "adminWards"
        );


    container.innerHTML = "";


    wards.forEach(ward => {

        const card =
            document.createElement("div");


        card.className =
            "admin-ward";


        card.innerHTML = `

            <strong>
                Ward ${ward.number}
            </strong>

            <p>
                ${escapeHTML(ward.name)}
            </p>

            <small>
                ${ward.women}
                registered women
            </small>

        `;


        container.appendChild(card);

    });

}


/* =========================
   LOGOUT
========================= */

async function logout() {

    await fetch(
        "/api/admin/logout",
        {
            method: "POST"
        }
    );


    window.location =
        "/admin/login.html";

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================
   START
========================= */

(async function() {

    const authenticated =
        await checkAuth();


    if (!authenticated)
        return;


    loadStats();

})();
```
