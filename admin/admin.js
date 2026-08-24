const WARDS = Array.from(
    { length: 13 },
    (_, i) => `Ward ${i + 1}`
);

const POSITIONS = [
    "Ward Coordinator",
    "Deputy Ward Coordinator",
    "Secretary",
    "Mobilization Officer",
    "Women Empowerment Officer",
    "Media/Publicity Officer",
    "Welfare Officer",
    "Polling Unit Officer"
];

const WOMEN_KEY = "bwi_registered_women";
const EXCO_KEY = "bwi_excos";


// ===============================
// DATA
// ===============================

function getWomen() {
    return JSON.parse(
        localStorage.getItem(WOMEN_KEY) || "[]"
    );
}

function saveWomen(data) {
    localStorage.setItem(
        WOMEN_KEY,
        JSON.stringify(data)
    );
}

function getExcos() {

    let data = JSON.parse(
        localStorage.getItem(EXCO_KEY) || "null"
    );

    if (!data) {

        data = {};

        WARDS.forEach(ward => {

            data[ward] = {};

            POSITIONS.forEach(position => {
                data[ward][position] = "";
            });

        });

        saveExcos(data);
    }

    return data;
}

function saveExcos(data) {
    localStorage.setItem(
        EXCO_KEY,
        JSON.stringify(data)
    );
}


// ===============================
// SECURITY HELPERS
// ===============================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ===============================
// ADMIN LOGIN
// ===============================

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";


const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const username =
                document.getElementById(
                    "username"
                ).value.trim();

            const password =
                document.getElementById(
                    "password"
                ).value;


            if (
                username === ADMIN_USERNAME &&
                password === ADMIN_PASSWORD
            ) {

                sessionStorage.setItem(
                    "bwi_admin_logged_in",
                    "true"
                );

                showDashboard();

            } else {

                document.getElementById(
                    "loginError"
                ).textContent =
                    "Invalid username or password.";

            }

        }
    );
}


function showDashboard() {

    document
        .getElementById("loginScreen")
        .classList.add("hidden");

    document
        .getElementById("dashboard")
        .classList.remove("hidden");

    populateWardSelectors();

    renderOverview();

    renderWomen();

    renderExcos();

    renderAdminWards();
}


function logout() {

    sessionStorage.removeItem(
        "bwi_admin_logged_in"
    );

    location.reload();
}


// ===============================
// PANEL NAVIGATION
// ===============================

function showPanel(panelName) {

    document
        .querySelectorAll(".panel")
        .forEach(panel => {
            panel.classList.add("hidden");
        });


    const selected =
        document.getElementById(panelName);

    if (selected) {
        selected.classList.remove("hidden");
    }


    const titles = {
        overview: "Dashboard",
        women: "Registered Women",
        excos: "Ward Excos",
        wards: "Wards"
    };


    document.getElementById(
        "pageTitle"
    ).textContent =
        titles[panelName] || "Dashboard";
}


// ===============================
// OVERVIEW
// ===============================

function renderOverview() {

    const women = getWomen();

    const stat =
        document.getElementById(
            "statWomen"
        );

    if (stat) {
        stat.textContent = women.length;
    }


    const container =
        document.getElementById(
            "wardStats"
        );

    if (!container) return;

    container.innerHTML = "";


    WARDS.forEach(ward => {

        const count =
            women.filter(
                person =>
                    person.ward === ward
            ).length;


        container.innerHTML += `

            <div class="ward-stat">

                <strong>
                    ${escapeHTML(ward)}
                </strong>

                <span>
                    ${count} registered women
                </span>

            </div>

        `;
    });
}


// ===============================
// WARD SELECTORS
// ===============================

function populateWardSelectors() {

    const filter =
        document.getElementById(
            "wardFilter"
        );

    const excoWard =
        document.getElementById(
            "excoWard"
        );


    if (filter) {

        filter.innerHTML = `
            <option value="">
                All Wards
            </option>
        `;

        WARDS.forEach(ward => {

            filter.innerHTML += `
                <option value="${escapeHTML(ward)}">
                    ${escapeHTML(ward)}
                </option>
            `;

        });
    }


    if (excoWard) {

        excoWard.innerHTML = "";

        WARDS.forEach(ward => {

            excoWard.innerHTML += `
                <option value="${escapeHTML(ward)}">
                    ${escapeHTML(ward)}
                </option>
            `;

        });
    }
}


// ===============================
// REGISTERED WOMEN
// ===============================

function renderWomen() {

    const container =
        document.getElementById(
            "womenTable"
        );

    if (!container) return;


    const search =
        (
            document.getElementById(
                "adminSearch"
            )?.value || ""
        )
        .toLowerCase()
        .trim();


    const ward =
        document.getElementById(
            "wardFilter"
        )?.value || "";


    let women = getWomen();


    if (search) {

        women = women.filter(person =>
            person.name
                .toLowerCase()
                .includes(search)
        );

    }


    if (ward) {

        women = women.filter(
            person =>
                person.ward === ward
        );

    }


    if (!women.length) {

        container.innerHTML = `
            <div class="empty-state">
                No registrations found.
            </div>
        `;

        return;
    }


    let html = `

        <table>

            <thead>

                <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Bank</th>
                    <th>Account</th>
                    <th>Ward</th>
                    <th>Action</th>
                </tr>

            </thead>

            <tbody>
    `;


    women.forEach(person => {

        html += `

            <tr>

                <td>
                    ${escapeHTML(person.name)}
                </td>

                <td>
                    ${escapeHTML(person.phone)}
                </td>

                <td>
                    ${escapeHTML(person.bank)}
                </td>

                <td>
                    ${escapeHTML(person.account)}
                </td>

                <td>
                    ${escapeHTML(person.ward)}
                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="deleteWoman(${person.id})"
                    >
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });


    html += `
            </tbody>

        </table>
    `;


    container.innerHTML = html;
}


function deleteWoman(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this registration?"
        );

    if (!confirmed) return;


    const women =
        getWomen().filter(
            person =>
                person.id !== id
        );


    saveWomen(women);

    renderWomen();

    renderOverview();

    renderAdminWards();
}


// ===============================
// EXCOS
// ===============================

function renderExcos() {

    const wardSelect =
        document.getElementById(
            "excoWard"
        );

    const container =
        document.getElementById(
            "excoEditor"
        );

    if (!wardSelect || !container) {
        return;
    }


    const ward = wardSelect.value;

    const data = getExcos();

    container.innerHTML = "";


    POSITIONS.forEach((position, index) => {

        const current =
            data[ward]?.[position] || "";


        const row =
            document.createElement("div");

        row.className = "exco-row";


        row.innerHTML = `

            <label>
                ${escapeHTML(position)}
            </label>

            <input
                type="text"
                id="excoInput${index}"
                value="${escapeHTML(current)}"
                placeholder="Enter executive name"
            >

            <button
                class="save-exco"
                onclick="saveExco(${index})"
            >
                Save
            </button>

        `;


        container.appendChild(row);

    });
}


function saveExco(index) {

    const ward =
        document.getElementById(
            "excoWard"
        ).value;


    const input =
        document.getElementById(
            `excoInput${index}`
        );


    if (!input) return;


    const position =
        POSITIONS[index];


    const data = getExcos();


    if (!data[ward]) {
        data[ward] = {};
    }


    data[ward][position] =
        input.value.trim();


    saveExcos(data);

    renderExcos();


    alert(
        `${position} saved for ${ward}.`
    );
}


// ===============================
// WARDS
// ===============================

function renderAdminWards() {

    const container =
        document.getElementById(
            "adminWards"
        );

    if (!container) return;


    const women = getWomen();

    container.innerHTML = "";


    WARDS.forEach(ward => {

        const count =
            women.filter(
                person =>
                    person.ward === ward
            ).length;


        container.innerHTML += `

            <div class="admin-ward">

                <strong>
                    ${escapeHTML(ward)}
                </strong>

                <span>
                    ${count} registered women
                </span>

            </div>

        `;

    });
}


// ===============================
// START
// ===============================

if (
    sessionStorage.getItem(
        "bwi_admin_logged_in"
    ) === "true"
) {

    showDashboard();

}
