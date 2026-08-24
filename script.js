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
   THE 8 STRUCTURED WARD OFFICES
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
   WARD EXCO DATA
========================================= */

const excos = {};


wards.forEach(ward => {

    excos[ward.name] = {};

    officePositions.forEach(position => {

        excos[ward.name][position] = {

            name: "Not yet added"

        };

    });

});


/* =========================================
   REGISTERED WOMEN
========================================= */

let women = [

    /*
    Real registrations will be added here
    after the database is connected.

    Example:

    {
        name: "Jane Doe",
        phone: "08012345678",
        bank: "Example Bank",
        account: "1234567890",
        ward: "ADO 'A' AJILOSUN"
    }

    */

];


/* =========================================
   DISPLAY WARDS
========================================= */

function displayWards() {

    const container =
        document.getElementById("wardsContainer");

    container.innerHTML = "";


    wards.forEach(ward => {

        const count = women.filter(
            woman => woman.ward === ward.name
        ).length;


        const card =
            document.createElement("div");

        card.className = "ward-card";

        card.onclick = () =>
            openWard(ward.name);


        card.innerHTML = `

            <div class="ward-number">
                ${ward.number}
            </div>

            <h3>
                Ward ${ward.number}
            </h3>

            <p>
                ${ward.name}
            </p>

            <p>
                ${count}
                registered woman${count === 1 ? "" : "en"}
            </p>

        `;


        container.appendChild(card);

    });

}


/* =========================================
   POPULATE WARD SELECT
========================================= */

function populateWardSelect() {

    const select =
        document.getElementById("ward");


    wards.forEach(ward => {

        const option =
            document.createElement("option");


        option.value =
            ward.name;


        option.textContent =
            `Ward ${ward.number} — ${ward.name}`;


        select.appendChild(option);

    });

}


/* =========================================
   OPEN WARD
========================================= */

function openWard(wardName) {

    const details =
        document.getElementById("wardDetails");


    details.classList.remove("hidden");


    document.getElementById("wards")
        .style.display = "none";


    document.getElementById("selectedWard")
        .textContent = wardName;


    /* WOMEN */

    const wardWomen =
        women.filter(
            woman => woman.ward === wardName
        );


    document.getElementById(
        "wardWomenCount"
    ).textContent = wardWomen.length;


    const womenContainer =
        document.getElementById("wardWomen");


    womenContainer.innerHTML = "";


    if (wardWomen.length === 0) {

        womenContainer.innerHTML = `

            <div class="woman-card">

                <div>
                    <strong>
                        No women registered yet
                    </strong>

                    <small>
                        Registration data will appear
                        here after submission.
                    </small>
                </div>

            </div>

        `;

    }


    wardWomen.forEach(woman => {

        const card =
            document.createElement("div");


        card.className = "woman-card";


        /*
            IMPORTANT:
            Phone, bank and account number
            are deliberately NOT displayed
            publicly.
        */

        card.innerHTML = `

            <div>

                <strong>
                    ${escapeHTML(woman.name)}
                </strong>

                <small>
                    Registered member
                </small>

            </div>

            <small>
                Ward ${getWardNumber(wardName)}
            </small>

        `;


        womenContainer.appendChild(card);

    });


    /* EXCOS */

    displayWardExcos(wardName);


    details.scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================================
   DISPLAY WARD EXCOS
========================================= */

function displayWardExcos(wardName) {

    const container =
        document.getElementById("wardExcos");


    container.innerHTML = "";


    officePositions.forEach(position => {

        const exco =
            excos[wardName][position];


        const card =
            document.createElement("div");


        card.className = "exco-card";


        card.innerHTML = `

            <div class="position">
                ${position}
            </div>

            <strong>
                ${escapeHTML(exco.name)}
            </strong>

        `;


        container.appendChild(card);

    });

}


/* =========================================
   CLOSE WARD
========================================= */

function closeWard() {

    document.getElementById(
        "wardDetails"
    ).classList.add("hidden");


    document.getElementById(
        "wards"
    ).style.display = "block";


    document.getElementById(
        "wards"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


/* =========================================
   REGISTRATION
========================================= */

document
    .getElementById("registrationForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const bank =
                document
                    .getElementById("bank")
                    .value
                    .trim();


            const account =
                document
                    .getElementById("account")
                    .value
                    .trim();


            const ward =
                document
                    .getElementById("ward")
                    .value;


            /* VALIDATION */

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


            if (!/^\d{10}$/.test(account)) {

                alert(
                    "Account number must contain exactly 10 digits."
                );

                return;

            }


            /* SAVE */

            women.push({

                name,
                phone,
                bank,
                account,
                ward

            });


            /* UPDATE */

            displayWards();

            updateStatistics();


            /* SUCCESS */

            document.getElementById(
                "registrationMessage"
            ).innerHTML = `

                <div class="success">

                    ✅
                    ${escapeHTML(name)}
                    has been registered successfully
                    under Ward ${getWardNumber(ward)}.

                </div>

            `;


            /* RESET */

            document
                .getElementById("registrationForm")
                .reset();


            /* SCROLL */

            document.getElementById(
                "registrationMessage"
            ).scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }
    );


/* =========================================
   SEARCH WOMEN
========================================= */

function searchWomen() {

    const query =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    const results =
        document.getElementById("searchResults");


    if (!query) {

        results.innerHTML = "";

        return;

    }


    const matches =
        women.filter(
            woman =>
                woman.name
                    .toLowerCase()
                    .includes(query)
        );


    results.innerHTML = "";


    if (matches.length === 0) {

        results.innerHTML = `

            <div class="woman-card">

                <strong>
                    No registered woman found.
                </strong>

            </div>

        `;

        return;

    }


    matches.forEach(woman => {

        const card =
            document.createElement("div");


        card.className = "woman-card";


        card.innerHTML = `

            <div>

                <strong>
                    ${escapeHTML(woman.name)}
                </strong>

                <small>
                    Registered member
                </small>

            </div>

            <small>
                ${escapeHTML(woman.ward)}
            </small>

        `;


        results.appendChild(card);

    });

}


/* =========================================
   DISPLAY ALL EXCOS
========================================= */

function displayAllExcos() {

    const container =
        document.getElementById("allExcos");


    container.innerHTML = "";


    wards.forEach(ward => {

        const card =
            document.createElement("div");


        card.className =
            "exco-overview-card";


        let html = `

            <h3>
                Ward ${ward.number}
            </h3>

            <p>
                <strong>
                    ${ward.name}
                </strong>
            </p>

        `;


        officePositions.forEach(position => {

            html += `

                <p>

                    <strong>
                        ${position}:
                    </strong>

                    ${escapeHTML(
                        excos[ward.name][position].name
                    )}

                </p>

            `;

        });


        card.innerHTML = html;


        container.appendChild(card);

    });

}


/* =========================================
   STATISTICS
========================================= */

function updateStatistics() {

    document.getElementById(
        "womenCount"
    ).textContent = women.length;


    document.getElementById(
        "excoCount"
    ).textContent =
        wards.length * officePositions.length;

}


/* =========================================
   GET WARD NUMBER
========================================= */

function getWardNumber(wardName) {

    const ward =
        wards.find(
            item => item.name === wardName
        );


    return ward
        ? ward.number
        : "";

}


/* =========================================
   MOBILE MENU
========================================= */

function toggleMenu() {

    document
        .getElementById("mainNav")
        .classList.toggle("show");

}


/* =========================================
   BASIC HTML ESCAPING
========================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================
   START
========================================= */

displayWards();

populateWardSelect();

displayAllExcos();

updateStatistics();
