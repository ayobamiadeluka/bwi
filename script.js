// ========================================
// WARD DATA
// ========================================

const wards = [
    {
        id: 1,
        name: "Ward 1",

        exco: [
            {
                position: "Chairperson",
                name: "Not yet added"
            },
            {
                position: "Secretary",
                name: "Not yet added"
            },
            {
                position: "Treasurer",
                name: "Not yet added"
            }
        ],

        women: []
    },

    {
        id: 2,
        name: "Ward 2",

        exco: [
            {
                position: "Chairperson",
                name: "Not yet added"
            },
            {
                position: "Secretary",
                name: "Not yet added"
            },
            {
                position: "Treasurer",
                name: "Not yet added"
            }
        ],

        women: []
    },

    {
        id: 3,
        name: "Ward 3",

        exco: [
            {
                position: "Chairperson",
                name: "Not yet added"
            },
            {
                position: "Secretary",
                name: "Not yet added"
            },
            {
                position: "Treasurer",
                name: "Not yet added"
            }
        ],

        women: []
    }
];


// ========================================
// DISPLAY WARDS
// ========================================

const wardContainer =
    document.getElementById("wardContainer");

const wardSelect =
    document.getElementById("ward");


function displayWards() {

    wardContainer.innerHTML = "";

    wardSelect.innerHTML =
        `<option value="">Select a ward</option>`;

    wards.forEach(ward => {

        // Create ward card

        const card =
            document.createElement("div");

        card.className = "ward-card";

        card.innerHTML = `
            <h3>${ward.name}</h3>
            <p>View women and EXCOs</p>
        `;

        card.onclick = () => {
            showWard(ward.id);
        };

        wardContainer.appendChild(card);


        // Add ward to registration dropdown

        const option =
            document.createElement("option");

        option.value = ward.id;

        option.textContent = ward.name;

        wardSelect.appendChild(option);

    });
}


// ========================================
// SHOW A WARD
// ========================================

function showWard(id) {

    const ward =
        wards.find(w => w.id === id);

    if (!ward) {
        return;
    }


    document
        .getElementById("wards")
        .classList.add("hidden");


    document
        .getElementById("register")
        .classList.add("hidden");


    document
        .getElementById("wardDetails")
        .classList.remove("hidden");


    document
        .getElementById("wardTitle")
        .textContent = ward.name;


    // EXCO

    const excoList =
        document.getElementById("excoList");

    excoList.innerHTML = "";

    ward.exco.forEach(person => {

        excoList.innerHTML += `
            <div class="person">
                <strong>${person.position}</strong>
                <span>${person.name}</span>
            </div>
        `;

    });


    // WOMEN

    const womenList =
        document.getElementById("womenList");

    womenList.innerHTML = "";


    if (ward.women.length === 0) {

        womenList.innerHTML = `
            <p>No women registered yet.</p>
        `;

    } else {

        ward.women.forEach((woman, index) => {

            womenList.innerHTML += `
                <div class="person">
                    <strong>
                        ${index + 1}. ${woman.name}
                    </strong>

                    <span>
                        ${woman.phone}
                    </span>
                </div>
            `;

        });

    }

}


// ========================================
// BACK TO WARDS
// ========================================

function showWards() {

    document
        .getElementById("wardDetails")
        .classList.add("hidden");

    document
        .getElementById("wards")
        .classList.remove("hidden");

    document
        .getElementById("register")
        .classList.remove("hidden");

}


// ========================================
// REGISTRATION
// ========================================

const form =
    document.getElementById("registrationForm");


form.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();


    const wardId =
        Number(
            document.getElementById("ward").value
        );


    const phone =
        document.getElementById("phone").value.trim();


    if (!name || !wardId || !phone) {

        return;

    }


    const ward =
        wards.find(w => w.id === wardId);


    ward.women.push({
        name: name,
        phone: phone
    });


    document.getElementById("message").textContent =
        `${name} has been registered successfully.`;


    form.reset();


    console.log(
        "Registered woman:",
        name,
        "Ward:",
        ward.name
    );

});


// ========================================
// START WEBSITE
// ========================================

displayWards();
