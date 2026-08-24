# Server

```javascript
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const path = require("path");

const {
    db,
    wards,
    positions
} = require("./database");

const app = express();

const PORT = process.env.PORT || 3000;


/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            "temporary-secret-change-me",

        resave: false,

        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 1000 * 60 * 60 * 8
        }
    })
);


/* =========================
   STATIC FILES
========================= */

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

app.use(
    "/admin",
    express.static(
        path.join(__dirname, "admin")
    )
);


/* =========================
   ADMIN AUTH
========================= */

function requireAdmin(req, res, next) {

    if (!req.session.admin) {

        return res.status(401).json({
            error: "Unauthorized"
        });

    }

    next();
}


/* =========================
   LOGIN
========================= */

app.post("/api/admin/login", async (req, res) => {

    const {
        username,
        password
    } = req.body;


    if (
        !username ||
        !password
    ) {

        return res.status(400).json({
            error: "Username and password are required."
        });

    }


    const validUsername =
        username === process.env.ADMIN_USERNAME;


    const validPassword =
        await bcrypt.compare(
            password,
            await bcrypt.hash(
                process.env.ADMIN_PASSWORD,
                10
            )
        );


    if (
        !validUsername ||
        !validPassword
    ) {

        return res.status(401).json({
            error: "Invalid login details."
        });

    }


    req.session.admin = true;


    res.json({
        success: true
    });

});


/* =========================
   LOGOUT
========================= */

app.post(
    "/api/admin/logout",
    requireAdmin,
    (req, res) => {

        req.session.destroy(() => {

            res.json({
                success: true
            });

        });

    }
);


/* =========================
   CURRENT ADMIN
========================= */

app.get(
    "/api/admin/me",
    requireAdmin,
    (req, res) => {

        res.json({
            loggedIn: true
        });

    }
);


/* =========================
   PUBLIC WARDS
========================= */

app.get("/api/wards", (req, res) => {

    const result = wards.map(
        (ward, index) => ({

            number: index + 1,

            name: ward,

            women:
                db.prepare(`
                    SELECT COUNT(*) AS count
                    FROM women
                    WHERE ward = ?
                `)
                .get(ward)
                .count

        })
    );


    res.json(result);

});


/* =========================
   PUBLIC WOMEN SEARCH
========================= */

app.get("/api/women/search", (req, res) => {

    const q =
        String(req.query.q || "")
            .trim();


    if (!q) {

        return res.json([]);

    }


    const result =
        db.prepare(`
            SELECT
                id,
                name,
                ward
            FROM women
            WHERE name LIKE ?
            ORDER BY name
        `)
        .all(`%${q}%`);


    res.json(result);

});


/* =========================
   PUBLIC WARD DETAILS
========================= */

app.get("/api/wards/:ward", (req, res) => {

    const ward =
        req.params.ward;


    if (!wards.includes(ward)) {

        return res.status(404).json({
            error: "Ward not found."
        });

    }


    const excos =
        db.prepare(`
            SELECT position, name
            FROM excos
            WHERE ward = ?
            ORDER BY id
        `)
        .all(ward);


    const women =
        db.prepare(`
            SELECT id, name, ward
            FROM women
            WHERE ward = ?
            ORDER BY name
        `)
        .all(ward);


    res.json({
        ward,
        excos,
        women
    });

});


/* =========================
   PUBLIC REGISTRATION
========================= */

app.post("/api/register", (req, res) => {

    const {
        name,
        phone,
        bank,
        account,
        ward
    } = req.body;


    if (
        !name ||
        !phone ||
        !bank ||
        !account ||
        !ward
    ) {

        return res.status(400).json({
            error:
                "All fields are required."
        });

    }


    if (!wards.includes(ward)) {

        return res.status(400).json({
            error: "Invalid ward."
        });

    }


    if (!/^\d{10}$/.test(account)) {

        return res.status(400).json({
            error:
                "Account number must contain 10 digits."
        });

    }


    const result =
        db.prepare(`
            INSERT INTO women
            (name, phone, bank, account, ward)
            VALUES (?, ?, ?, ?, ?)
        `)
        .run(
            name.trim(),
            phone.trim(),
            bank.trim(),
            account.trim(),
            ward
        );


    res.json({
        success: true,
        id: result.lastInsertRowid
    });

});


/* =========================
   ADMIN DASHBOARD STATS
========================= */

app.get(
    "/api/admin/stats",
    requireAdmin,
    (req, res) => {

        const women =
            db.prepare(`
                SELECT COUNT(*) AS count
                FROM women
            `)
            .get()
            .count;


        res.json({

            women,

            wards: wards.length,

            excoPositions:
                wards.length *
                positions.length

        });

    }
);


/* =========================
   ADMIN WOMEN
========================= */

app.get(
    "/api/admin/women",
    requireAdmin,
    (req, res) => {

        const women =
            db.prepare(`
                SELECT *
                FROM women
                ORDER BY created_at DESC
            `)
            .all();


        res.json(women);

    }
);


/* =========================
   ADD WOMAN
========================= */

app.post(
    "/api/admin/women",
    requireAdmin,
    (req, res) => {

        const {
            name,
            phone,
            bank,
            account,
            ward
        } = req.body;


        if (
            !name ||
            !phone ||
            !bank ||
            !account ||
            !ward
        ) {

            return res.status(400).json({
                error: "All fields are required."
            });

        }


        const result =
            db.prepare(`
                INSERT INTO women
                (name, phone, bank, account, ward)
                VALUES (?, ?, ?, ?, ?)
            `)
            .run(
                name,
                phone,
                bank,
                account,
                ward
            );


        res.json({
            success: true,
            id: result.lastInsertRowid
        });

    }
);


/* =========================
   DELETE WOMAN
========================= */

app.delete(
    "/api/admin/women/:id",
    requireAdmin,
    (req, res) => {

        db.prepare(`
            DELETE FROM women
            WHERE id = ?
        `)
        .run(req.params.id);


        res.json({
            success: true
        });

    }
);


/* =========================
   ADMIN EXCOS
========================= */

app.get(
    "/api/admin/excos",
    requireAdmin,
    (req, res) => {

        const excos =
            db.prepare(`
                SELECT *
                FROM excos
                ORDER BY ward, id
            `)
            .all();


        res.json(excos);

    }
);


/* =========================
   UPDATE EXCO
========================= */

app.put(
    "/api/admin/excos/:id",
    requireAdmin,
    (req, res) => {

        const {
            name
        } = req.body;


        db.prepare(`
            UPDATE excos
            SET name = ?
            WHERE id = ?
        `)
        .run(
            name || "",
            req.params.id
        );


        res.json({
            success: true
        });

    }
);


/* =========================
   START
========================= */

app.listen(
    PORT,
    () => {

        console.log("");
        console.log(
            "=================================="
        );
        console.log(
            "EKITI STATE WOMEN OF INFLUENCE"
        );
        console.log(
            "ADO LG WEBSITE"
        );
        console.log(
            "=================================="
        );
        console.log(
            `Website: http://localhost:${PORT}`
        );
        console.log(
            `Admin:   http://localhost:${PORT}/admin/login.html`
        );
        console.log(
            "=================================="
        );
        console.log("");

    }
);
```
