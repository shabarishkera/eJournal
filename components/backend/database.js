import * as SQLite from "expo-sqlite";
const database = SQLite.openDatabaseSync("diaryDatabase");

export async function init() {
    try {
        // Create the diarydata table using execAsync
        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS diarydata(
            dateinfo varchar(20) ,
            year int,
            day varchar(20),
            data TEXT,
            email TEXT,
            PRIMARY KEY (email, dateinfo)
          );
        `);

        // Create the user table using execAsync
        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS user(
            email varchar(50) UNIQUE,
            name varchar(25),
            password TEXT,
            avatarUrl TEXT,
            bio TEXT
          );
        `);

        console.log("tables created successfully");
    } catch (error) {
        console.error("Error creating tables:", error);
        throw error; // Propagate the error
    }
}
export async function deleteTables() {
    try {
        // Delete the diarydata table if it exists
        await database.execAsync(`
            DROP TABLE IF EXISTS diarydata;
        `);

        // Delete the user table if it exists
        await database.execAsync(`
            DROP TABLE IF EXISTS user;
        `);

        console.log("Tables deleted successfully");
    } catch (error) {
        console.error("Error deleting tables:", error);
        throw error; // Propagate the error
    }
}

export async function deleteUserData(email) {
    try {
        // Delete the diarydata table if it exists
        if (!email) {
            throw new Error("Email is required");
        }

        // Delete all rows in the diarydata table for the given email
        await database.runAsync(
            `
            DELETE FROM diarydata WHERE email = ?;
        `,
            [email]
        );

        console.log(`Rows  deleted successfully`);
    } catch (error) {
        console.error("Error deleting tables:", error);
        throw error; // Propagate the error
    }
}
export async function deleteDiaryData(email, dateinfo) {
    try {
        // Delete the diarydata table if it exists
        if (!email) {
            throw new Error("Email is required");
        }

        // Delete all rows in the diarydata table for the given email
        await database.runAsync(
            `
            DELETE FROM diarydata WHERE email = ? AND dateinfo=?;
        `,
            [email, dateinfo]
        );

        console.log(`Rows for email ${email} deleted successfully`);
    } catch (error) {
        console.error("Error deleting tables:", error);
        throw error; // Propagate the error
    }
}

export async function createuser(email, username, password, bio, avatarUrl) {
    console.log(email, username, bio, avatarUrl, password);
    try {
        const res = await database.runAsync(
            `INSERT INTO user (email,name,password,avatarUrl,bio) VALUES (?, ?, ?,?,?)`,
            email,
            username,
            password,
            avatarUrl,
            bio
        );
        return res;
    } catch (error) {
        if (error.message.includes("UNIQUE constraint failed")) {
            throw new Error("email exists");
        }
        console.log(error.message);
    }
}
export async function edituser(email, username, bio, avatarUrl) {
    await database
        .runAsync(`UPDATE user SET name=? ,bio=?,avatarUrl=? WHERE  email=?`, username, bio, avatarUrl, email)
        .then(() => {
            console.log("data updated");
            return "Ok";
        })
        .catch((err) => {
            throw err;
        });
    return "data updated successfully";
}
export async function finduser(email, password) {
    try {
        const a = await database.getAllAsync("SELECT * FROM user");
        console.log(a);

        const res = await database.getFirstAsync(`SELECT * FROM user where email=? and password=?`, email, password);
        return res;
    } catch (error) {
        throw error;
    }
}
export async function finduserDetails(email) {
    try {
        const res = await database.getFirstAsync(`SELECT * FROM user where email=? `, email);
        return res;
    } catch (error) {
        throw error;
    }
}
export async function fetchalldiary(email) {
    const res = await database.getAllAsync("SELECT * FROM diarydata WHERE email=?", email);

    return res;
}

export async function addDiary(date, year, day, data, email) {
    await database
        .runAsync("INSERT INTO diarydata (dateinfo ,year, day,data,email) VALUES(?,?,?,?,?)", date, year, day, data, email)
        .then(() => {
            console.log("data added successfully");
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
    return "data saved successfully";
}
export async function editDiary(date, year, day, data, email) {
    await database
        .runAsync(`UPDATE diarydata SET data=? WHERE dateinfo=?  AND email=?`, data, date, email)
        .then(() => {
            console.log("data updated");
            return "Ok";
        })
        .catch((err) => {
            throw err;
        });
    return "data updated successfully";
}
export async function getDiaryByDate(date, email) {
    const firstRow = await database.getFirstAsync(`SELECT * FROM diarydata  WHERE  dateinfo='${date}' AND email="${email}"`);

    return firstRow.data;
}

export async function getLast30DaysData(key, email) {
    const dates = [];
    const today = new Date();

    // Loop for the last 30 days
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i); // Subtract 'i' days
        const formattedDate = date.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
        dates.push(formattedDate); // Add to the array
    }

    try {
        const result = await database.getAllAsync("SELECT * FROM diarydata WHERE email=?", email);
        let ans = [];
        for (let row of result) {
            if (dates.includes(row.dateinfo)) ans.push(row);
        }
        let finalResult = [];
        if (key) {
            key = key.toLowerCase();
            for (let a of ans) if (a.dateinfo.toLowerCase().includes(key) || a.data.toLowerCase().includes(key)) finalResult.push(a);
            return finalResult;
        }

        return ans;
    } catch (error) {
        console.error("Error fetching data for the last 30 days:", error);
        throw error; // Propagate the error
    }
}
