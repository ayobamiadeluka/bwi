const WARDS = [
    { number: 1, name: "ADO 'A' AJILOSUN" },
    { number: 2, name: "ADO 'B' INISA" },
    { number: 3, name: "ADO 'C' IDOLOFIN" },
    { number: 4, name: "ADO 'D' IJIGBO" },
    { number: 5, name: "ADO 'E' IJOKA / OREREOWU" },
    { number: 6, name: "ADO 'F' OKEYINMI" },
    { number: 7, name: "ADO 'G' OKE ILA" },
    { number: 8, name: "ADO 'H' EREGURU" },
    { number: 9, name: "ADO 'I' DALLIMORE" },
    { number: 10, name: "ADO 'J' OKESA" },
    { number: 11, name: "ADO 'K' IRONA" },
    { number: 12, name: "ADO 'L' IGBEHIN" },
    { number: 13, name: "ADO 'M' FARM SETTLEMENT" }
];

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

const REGISTRATION_KEY = "bwi_registrations";
const EXCO_KEY = "bwi_excos";

const USERNAME = "admin";
const PASSWORD = "admin123";


// ===============================
// STORAGE
// ===============================

function getRegistrations() {
    return JSON.parse(
        localStorage.getItem(REGISTRATION_KEY) || "[]"
    );
}

function saveRegistrations(data) {
    localStorage.setItem(
        REGISTRATION_KEY,
        JSON.stringify(data)
    );
}

function getExcos() {
    return JSON.parse(
        localStorage.getItem(EXCO_KEY) || "{}"
    );
}

function saveExcos(data) {
    localStorage.setItem(
        EXCO_KEY,
        JSON.stringify(data)
    );
}


// ===============================
// LOGIN
// ===============================

document
    .getElementById("loginForm")
    ?.addEventListener("submit", function (e) {

        e.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        if (
            username === USERNAME &&
            password === PASSWORD
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
    });


function showDashboard() {

    document
        .getElementById("loginScreen")
        .classList.add("hidden");

    document
        .getElementById("dashboard")
        .classList.remove("hidden");

    populateSelectors();

    renderOverview();

    renderWomen();

    renderExcos();

    renderWards();
}


function logout() {

    sessionStorage.removeItem(
        "bwi_admin_logged_in"
    );

    location.reload();
}


// ===============================
// NAVIGATION
// ===============================

function showPanel(name) {

    document
        .querySelectorAll(".panel")
        .forEach(panel =>
            panel.classList.add("hidden")
        );

    document
        .getElementById(name)
        ?.classList.remove("hidden");

    const titles = {
        overview: "Dashboard",
        women: "Registrations",
        excos: "Ward Excos",
        wards: "Wards"
    };

    document.getElementById("pageTitle")
        .textContent =
        titles[name] || "Dashboard";
}


// ===============================
// DASHBOARD
// ===============================

function renderOverview() {

    const registrations =
        getRegistrations();

    const pending =
        registrations.filter(
            r => r.status === "pending"
        ).length;

    const approved =
        registrations.filter(
            r => r.status === "approved"
        ).length;

    const statWomen =
        document.getElementById("statWomen");

    if (statWomen) {
        statWomen.textContent = approved;
    }

    const container =
        document.getElementById("wardStats");

    if (!container) return;

    container.innerHTML = "";

    WARDS.forEach(ward => {

        const count =
            registrations.filter(
                r =>
                    r.status === "approved" &&
                    r.ward === ward.name
            ).length;

        container.innerHTML += `
            <div class="ward-stat">
                <strong>Ward ${ward.number}</strong>
                <span>${ward.name}</span>
                <b>${count}</b>
            </div>
        `;
    });

    const pendingBadge =
        document.getElementById("pendingCount");

    if (pendingBadge) {
        pendingBadge.textContent = pending;
    }

    const approvedBadge =
        document.getElementById("approvedCount");

    if (approvedBadge) {
        approvedBadge.textContent = approved;
    }
}


// ===============================
// REGISTRATION LIST
// ===============================

function renderWomen() {

    const container =
        document.getElementById("womenTable");

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

    const registrations =
        getRegistrations();

    let filtered =
        registrations.filter(reg => {

            const matchesSearch =
                !search ||
                reg.name
                    .toLowerCase()
                    .includes(search);

            const matchesWard =
                !ward ||
                reg.ward === ward;

            return matchesSearch &&
                   matchesWard;
        });


    if (!filtered.length) {

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
                    <th>Ward</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>

            </thead>

            <tbody>
    `;


    filtered.forEach(reg => {

        html += `
            <tr>

                <td>
                    ${escapeHTML(reg.name)}
                </td>

                <td>
                    ${escapeHTML(reg.phone)}
                </td>

                <td>
                    ${escapeHTML(reg.ward)}
                </td>

                <td>
                    <span class="status ${reg.status}">
                        ${reg.status}
                    </span>
                </td>

                <td>

                    ${
                        reg.status === "pending"
                        ? `
                            <button
                                onclick="approveRegistration(${reg.id})"
                                class="approve-btn"
                            >
                                ✅ Approve
                            </button>

                            <button
                                onclick="rejectRegistration(${reg.id})"
                                class="reject-btn"
                            >
                                ❌ Reject
                            </button>
                        `
                        : ""
                    }

                    ${
                        reg.status === "approved"
                        ? `
                            <button
                                onclick="rejectRegistration(${reg.id})"
                                class="reject-btn"
                            >
                                Reject
                            </button>
                        `
                        : ""
                    }

                    ${
                        reg.status === "rejected"
                        ? `
                            <button
                                onclick="approveRegistration(${reg.id})"
                                class="approve-btn"
                            >
                                Approve
                            </button>
                        `
                        : ""
                    }

                    <button
                        onclick="deleteRegistration(${reg.id})"
                        class="delete-btn"
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


// ===============================
// APPROVE / REJECT
// ===============================

function approveRegistration(id) {

    const registrations =
        getRegistrations();

    const person =
        registrations.find(
            r => r.id === id
        );

    if (!person) return;

    person.status = "approved";

    saveRegistrations(registrations);

    refreshAll();

}


function rejectRegistration(id) {

    const registrations =
        getRegistrations();

    const person =
        registrations.find(
            r => r.id === id
        );

    if (!person) return;

    person.status = "rejected";

    saveRegistrations(registrations);

    refreshAll();

}


function deleteRegistration(id) {

    if (
        !confirm(
            "Delete this registration permanently?"
        )
    ) return;

    const registrations =
        getRegistrations()
            .filter(r => r.id !== id);

    saveRegistrations(registrations);

    refreshAll();
}


// ===============================
// EXCOS
// ===============================

function renderExcos() {

    const wardSelect =
        document.getElementById("excoWard");

    const container =
        document.getElementById("excoEditor");

    if (!wardSelect || !container) return;

    const ward =
        wardSelect.value;

    const data =
        getExcos();

    if (!data[ward]) {
        data[ward] = {};
    }

    container.innerHTML = "";

    POSITIONS.forEach((position, index) => {

        const value =
            data[ward][position] || "";

        container.innerHTML += `

            <div class="exco-row">

                <label>
                    ${escapeHTML(position)}
                </label>

                <input
                    id="exco-${index}"
                    value="${escapeHTML(value)}"
                    placeholder="Executive name"
                >

                <button
                    onclick="saveExco(${index})"
                    class="save-exco"
                >
                    Save
                </button>

            </div>

        `;
    });
}


function saveExco(index) {

    const ward =
        document.getElementById(
            "excoWard"
        ).value;

    const input =
        document.getElementById(
            `exco-${index}`
        );

    const data =
        getExcos();

    if (!data[ward]) {
        data[ward] = {};
    }

    data[ward][POSITIONS[index]] =
        input.value.trim();

    saveExcos(data);

    renderExcos();
}


// ===============================
// WARDS
// ===============================

function renderWards() {

    const container =
        document.getElementById(
            "adminWards"
        );

    if (!container) return;

    container.innerHTML = "";

    const registrations =
        getRegistrations();

    WARDS.forEach(ward => {

        const count =
            registrations.filter(
                r =>
                    r.status === "approved" &&
                    r.ward === ward.name
            ).length;

        container.innerHTML += `

            <div class="admin-ward">

                <strong>
                    Ward ${ward.number}
                </strong>

                <span>
                    ${escapeHTML(ward.name)}
                </span>

                <b>
                    ${count} approved
                </b>

            </div>
        `;
    });
}


// ===============================
// SELECTORS
// ===============================

function populateSelectors() {

    const wardFilter =
        document.getElementById(
            "wardFilter"
        );

    const excoWard =
        document.getElementById(
            "excoWard"
        );


    if (wardFilter) {

        wardFilter.innerHTML =
            `<option value="">
                All Wards
            </option>`;

        WARDS.forEach(ward => {

            wardFilter.innerHTML += `
                <option value="${escapeHTML(ward.name)}">
                    Ward ${ward.number} — ${escapeHTML(ward.name)}
                </option>
            `;

        });
    }


    if (excoWard) {

        excoWard.innerHTML = "";

        WARDS.forEach(ward => {

            excoWard.innerHTML += `
                <option value="${escapeHTML(ward.name)}">
                    Ward ${ward.number} — ${escapeHTML(ward.name)}
                </option>
            `;

        });
    }
}


// ===============================
// REFRESH
// ===============================

function refreshAll() {

    renderOverview();

    renderWomen();

    renderExcos();

    renderWards();
}


// ===============================
// ESCAPE HTML
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
// START
// ===============================

if (
    sessionStorage.getItem(
        "bwi_admin_logged_in"
    ) === "true"
) {

    showDashboard();

}
