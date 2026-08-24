/* =========================================
   EKITI STATE WOMEN OF INFLUENCE
   ADO LOCAL GOVERNMENT
========================================= */


/* =========================================
   OFFICIAL ADO LG WARDS
========================================= */

const wards = [

    {
        number: 1,
        name: "ADO 'A' AJILOSUN"
    },

    {
        number: 2,
        name: "ADO 'B' INISA"
    },

    {
        number: 3,
        name: "ADO 'C' IDOLOFIN"
    },

    {
        number: 4,
        name: "ADO 'D' IJIGBO"
    },

    {
        number: 5,
        name: "ADO 'E' IJOKA / OREREOWU"
    },

    {
        number: 6,
        name: "ADO 'F' OKEYINMI"
    },

    {
        number: 7,
        name: "ADO 'G' OKE ILA"
    },

    {
        number: 8,
        name: "ADO 'H' EREGURU"
    },

    {
        number: 9,
        name: "ADO 'I' DALLIMORE"
    },

    {
        number: 10,
        name: "ADO 'J' OKESA"
    },

    {
        number: 11,
        name: "ADO 'K' IRONA"
    },

    {
        number: 12,
        name: "ADO 'L' IGBEHIN"
    },

    {
        number: 13,
        name: "ADO 'M' FARM SETTLEMENT"
    }

];


/* =========================================
   WARD OFFICES
========================================= */

const officePositions = [

    "Ward Coordinator",

    "Deputy Ward Coordinator",

    "Secretary",

    "Mobilization Officer",

    "Women Empowerment Officer",

    "Media/Publicity Officer",

    "Welfare Officer",

    "Polling Unit Officer"

];


/* =========================================
   STORAGE KEYS
========================================= */

const REGISTRATION_KEY =
    "bwi_registrations";

const EXCO_KEY =
    "bwi_excos";


/* =========================================
   GET REGISTRATIONS
========================================= */

function getRegistrations() {

    return JSON.parse(
        localStorage.getItem(
            REGISTRATION_KEY
        ) || "[]"
    );

}


/* =========================================
   SAVE REGISTRATIONS
========================================= */

function saveRegistrations(data) {

    localStorage.setItem(
        REGISTRATION_KEY,
        JSON.stringify(data)
    );

}


/* =========================================
   GET EXCOS
========================================= */

function getExcos() {

    return JSON.parse(
        localStorage.getItem(
            EXCO_KEY
        ) || "{}"
    );

}


/* =========================================
   SAVE EXCOS
========================================= */

function saveExcos(data) {

    localStorage.setItem(
        EXCO_KEY,
        JSON.stringify(data)
    );

}


/* =========================================
   DISPLAY WARDS
========================================= */

function displayWards() {

    const container =
        document.getElementById(
            "wardsContainer"
        );

    if (!container) return;

    container.innerHTML = "";


    wards.forEach(ward => {

        const registrations =
            getRegistrations();


        const count =
            registrations.filter(
                woman =>
                    woman.ward === ward.name &&
                    woman.status === "approved"
            ).length;


        const card =
            document.createElement("div");


        card.className =
            "ward-card";


        card.onclick = function() {

            openWard(
                ward.name
            );

        };


        card.innerHTML = `

            <div class="ward-number">
                ${ward.number}
            </div>

            <h3>
                Ward ${ward.number}
            </h3>

            <p>
                ${escapeHTML(ward.name)}
            </p>

            <p>
                ${count}
                approved woman${count === 1 ? "" : "en"}
            </p>

        `;


        container.appendChild(card);

    });

}


/* =========================================
   OPEN WARD
========================================= */

function openWard(wardName) {

    const details =
        document.getElementById(
            "wardDetails"
        );

    const wardsSection =
        document.getElementById(
            "wards"
        );


    if (!details || !wardsSection)
        return;


    details.classList.remove(
        "hidden"
    );


    wardsSection.style.display =
        "none";


    document.getElementById(
        "selectedWard"
    ).textContent =
        wardName;


    const registrations =
        getRegistrations();


    const wardWomen =
        registrations.filter(
            woman =>
                woman.ward === wardName &&
                woman.status === "approved"
        );


    const count =
        document.getElementById(
            "wardWomenCount"
        );


    if (count) {

        count.textContent =
            wardWomen.length;

    }


    const container =
        document.getElementById(
            "wardWomen"
        );


    if (!container)
        return;


    container.innerHTML = "";


    if (wardWomen.length === 0) {

        container.innerHTML = `

            <div class="woman-card">

                <strong>
                    No approved women registered yet.
                </strong>

                <small>
                    Approved registration data
                    will appear here.
                </small>

            </div>

        `;

    }


    wardWomen.forEach(
        woman => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "woman-card";


            card.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(
                            woman.name
                        )}
                    </strong>

                    <small>
                        Registered member
                    </small>

                </div>

                <small>
                    Ward ${getWardNumber(
                        wardName
                    )}
                </small>

            `;


            container.appendChild(
                card
            );

        }
    );


    displayWardExcos(
        wardName
    );


    details.scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================================
   DISPLAY WARD EXCOS
========================================= */

function displayWardExcos(
    wardName
) {

    const container =
        document.getElementById(
            "wardExcos"
        );


    if (!container)
        return;


    container.innerHTML = "";


    const excos =
        getExcos();


    const wardExcos =
        excos[wardName] || {};


    officePositions.forEach(
        position => {

            const name =
                wardExcos[position] ||
                "Not yet added";


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "exco-card";


            card.innerHTML = `

                <div class="position">
                    ${escapeHTML(
                        position
                    )}
                </div>

                <strong>
                    ${escapeHTML(
                        name
                    )}
                </strong>

            `;


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================
   CLOSE WARD
========================================= */

function closeWard() {

    const details =
        document.getElementById(
            "wardDetails"
        );

    const wardsSection =
        document.getElementById(
            "wards"
        );


    if (details) {

        details.classList.add(
            "hidden"
        );

    }


    if (wardsSection) {

        wardsSection.style.display =
            "block";

        wardsSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================
   REGISTRATION
========================================= */

const registrationForm =
    document.getElementById(
        "registrationForm"
    );


if (registrationForm) {

    registrationForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "name"
                ).value.trim();


            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();


            const bank =
                document.getElementById(
                    "bank"
                ).value.trim();


            const account =
                document.getElementById(
                    "account"
                ).value.trim();


            const ward =
                document.getElementById(
                    "ward"
                ).value;


            /* =========================
               VALIDATION
            ========================= */

            if (
                !name ||
                !phone ||
                !bank ||
                !account ||
                !ward
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;

            }


            if (
                !/^\d{10}$/.test(
                    account
                )
            ) {

                alert(
                    "Account number must contain exactly 10 digits."
                );

                return;

            }


            /* =========================
               CREATE REGISTRATION
            ========================= */

            const registrations =
                getRegistrations();


            const registration = {

                id:
                    Date.now(),

                name:
                    name,

                phone:
                    phone,

                bank:
                    bank,

                account:
                    account,

                ward:
                    ward,

                status:
                    "pending",

                createdAt:
                    new Date().toISOString()

            };


            registrations.push(
                registration
            );


            saveRegistrations(
                registrations
            );


            /* =========================
               UPDATE WEBSITE
            ========================= */

            displayWards();

            updateStatistics();


            /* =========================
               SUCCESS MESSAGE
            ========================= */

            const message =
                document.getElementById(
                    "registrationMessage"
                );


            if (message) {

                message.innerHTML = `

                    <div class="success">

                        ✅

                        ${escapeHTML(
                            name
                        )}

                        has been registered successfully.

                        <br>

                        Your registration is now
                        <strong>
                            pending approval
                        </strong>.

                        <br>

                        Ward ${getWardNumber(
                            ward
                        )}

                    </div>

                `;

            }


            /* =========================
               RESET FORM
            ========================= */

            registrationForm.reset();


            /* =========================
               SCROLL MESSAGE
            ========================= */

            if (message) {

                message.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        }
    );

}


/* =========================================
   SEARCH WOMEN
========================================= */

function searchWomen() {

    const input =
        document.getElementById(
            "searchInput"
        );


    const results =
        document.getElementById(
            "searchResults"
        );


    if (!input || !results)
        return;


    const query =
        input.value
            .toLowerCase()
            .trim();


    if (!query) {

        results.innerHTML =
            "";

        return;

    }


    const registrations =
        getRegistrations();


    const matches =
        registrations.filter(
            woman =>
                woman.status ===
                    "approved" &&
                woman.name
                    .toLowerCase()
                    .includes(query)
        );


    results.innerHTML =
        "";


    if (matches.length === 0) {

        results.innerHTML = `

            <div class="woman-card">

                <strong>
                    No approved woman found.
                </strong>

            </div>

        `;

        return;

    }


    matches.forEach(
        woman => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "woman-card";


            card.innerHTML = `

                <div>

                    <strong>
                        ${escapeHTML(
                            woman.name
                        )}
                    </strong>

                    <small>
                        Approved member
                    </small>

                </div>

                <small>
                    ${escapeHTML(
                        woman.ward
                    )}
                </small>

            `;


            results.appendChild(
                card
            );

        }
    );

}


/* =========================================
   DISPLAY ALL EXCOS
========================================= */

function displayAllExcos() {

    const container =
        document.getElementById(
            "allExcos"
        );


    if (!container)
        return;


    container.innerHTML = "";


    const excos =
        getExcos();


    wards.forEach(
        ward => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "exco-overview-card";


            let html = `

                <h3>
                    Ward ${ward.number}
                </h3>

                <p>
                    <strong>
                        ${escapeHTML(
                            ward.name
                        )}
                    </strong>
                </p>

            `;


            officePositions.forEach(
                position => {

                    const name =
                        excos[
                            ward.name
                        ]?.[
                            position
                        ] ||
                        "Not yet added";


                    html += `

                        <p>

                            <strong>
                                ${escapeHTML(
                                    position
                                )}:
                            </strong>

                            ${escapeHTML(
                                name
                            )}

                        </p>

                    `;

                }
            );


            card.innerHTML =
                html;


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================
   STATISTICS
========================================= */

function updateStatistics() {

    const registrations =
        getRegistrations();


    const approved =
        registrations.filter(
            woman =>
                woman.status ===
                "approved"
        ).length;


    const womenCount =
        document.getElementById(
            "womenCount"
        );


    if (womenCount) {

        womenCount.textContent =
            approved;

    }


    const excoCount =
        document.getElementById(
            "excoCount"
        );


    if (excoCount) {

        excoCount.textContent =
            wards.length *
            officePositions.length;

    }

}


/* =========================================
   GET WARD NUMBER
========================================= */

function getWardNumber(
    wardName
) {

    const ward =
        wards.find(
            item =>
                item.name ===
                wardName
        );


    return ward
        ? ward.number
        : "";

}


/* =========================================
   MOBILE MENU
========================================= */

function toggleMenu() {

    const nav =
        document.getElementById(
            "mainNav"
        );


    if (nav) {

        nav.classList.toggle(
            "show"
        );

    }

}


/* =========================================
   HTML ESCAPING
========================================= */

function escapeHTML(
    value
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================
   START WEBSITE
========================================= */

displayWards();

displayAllExcos();

updateStatistics();
