# Public Website JavaScript

```javascript
async function loadWards() {

    const response =
        await fetch("/api/wards");

    const wards =
        await response.json();


    const container =
        document.getElementById(
            "wardsContainer"
        );


    const select =
        document.getElementById("ward");


    container.innerHTML = "";

    select.innerHTML = `
        <option value="">
            Select your ward
        </option>
    `;


    wards.forEach(ward => {

        const card =
            document.createElement("div");

        card.className = "ward-card";

        card.onclick =
            () => openWard(ward.name);


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
                ${ward.women}
                registered
            </p>

        `;


        container.appendChild(card);


        const option =
            document.createElement("option");

        option.value = ward.name;

        option.textContent =
            `Ward ${ward.number} — ${ward.name}`;

        select.appendChild(option);

    });


    document.getElementById(
        "womenCount"
    ).textContent =
        wards.reduce(
            (total, ward) =>
                total + ward.women,
            0
        );

}


async function openWard(ward) {

    const response =
        await fetch(
            `/api/wards/${encodeURIComponent(ward)}`
        );


    const data =
        await response.json();


    document.getElementById(
        "wardDetails"
    ).classList.remove("hidden");


    document.getElementById(
        "wards"
    ).style.display = "none";


    document.getElementById(
        "selectedWard"
    ).textContent = data.ward;


    document.getElementById(
        "wardWomenCount"
    ).textContent =
        data.women.length;


    const excos =
        document.getElementById(
            "wardExcos"
        );


    excos.innerHTML = "";


    data.excos.forEach(exco => {

        const card =
            document.createElement("div");

        card.className = "exco";


        card.innerHTML = `

            <small>
                ${escapeHTML(exco.position)}
            </small>

            <strong>
                ${escapeHTML(
                    exco.name ||
                    "Not yet added"
                )}
            </strong>

        `;


        excos.appendChild(card);

    });


    const women =
        document.getElementById(
            "wardWomen"
        );


    women.innerHTML = "";


    if (!data.women.length) {

        women.innerHTML = `
            <div class="woman">
                No registered women yet.
            </div>
        `;

    }


    data.women.forEach(woman => {

        const card =
            document.createElement("div");

        card.className = "woman";


        card.innerHTML = `

            <strong>
                ${escapeHTML(woman.name)}
            </strong>

            <small>
                Registered member
            </small>

        `;


        women.appendChild(card);

    });


    document.getElementById(
        "wardDetails"
    ).scrollIntoView({
        behavior: "smooth"
    });

}


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


async function searchWomen() {

    const query =
        document.getElementById(
            "searchInput"
        ).value.trim();


    const results =
        document.getElementById(
            "searchResults"
        );


    if (!query) {

        results.innerHTML = "";

        return;

    }


    const response =
        await fetch(
            `/api/women/search?q=${encodeURIComponent(query)}`
        );


    const women =
        await response.json();


    results.innerHTML = "";


    if (!women.length) {

        results.innerHTML = `
            <div class="woman">
                No registered woman found.
            </div>
        `;

        return;

    }


    women.forEach(woman => {

        const card =
            document.createElement("div");

        card.className = "woman";


        card.innerHTML = `

            <strong>
                ${escapeHTML(woman.name)}
            </strong>

            <small>
                ${escapeHTML(woman.ward)}
            </small>

        `;


        results.appendChild(card);

    });

}


document
    .getElementById("registrationForm")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const data = {

                name:
                    document
                        .getElementById("name")
                        .value
                        .trim(),

                phone:
                    document
                        .getElementById("phone")
                        .value
                        .trim(),

                bank:
                    document
                        .getElementById("bank")
                        .value
                        .trim(),

                account:
                    document
                        .getElementById("account")
                        .value
                        .trim(),

                ward:
                    document
                        .getElementById("ward")
                        .value

            };


            const response =
                await fetch(
                    "/api/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );


            const result =
                await response.json();


            const message =
                document.getElementById(
                    "registrationMessage"
                );


            if (!response.ok) {

                message.innerHTML = `
                    <p style="color:red;text-align:center">
                        ❌ ${escapeHTML(
                            result.error
                        )}
                    </p>
                `;

                return;

            }


            message.innerHTML = `
                <p style="
                    color:green;
                    text-align:center;
                    margin:20px;
                ">
                    ✅ Registration successful.
                </p>
            `;


            document
                .getElementById(
                    "registrationForm"
                )
                .reset();


            loadWards();

        }
    );


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


loadWards();
```
