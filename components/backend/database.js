import * as SQLite from "expo-sqlite";
const database = SQLite.openDatabaseSync("diaryDatabase");
import AsyncStorage from "@react-native-async-storage/async-storage";
export async function init() {
    try {
        // Create the diarydata table using execAsync
        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS diarydata(
            dateinfo varchar(20) PRIMARY KEY,
            year int,
            day varchar(20),
            data TEXT
          );
        `);

        // Create the user table using execAsync
        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS user(
            email varchar(30) UNIQUE,
            name varchar(25),
            password TEXT
          );
        `);

        console.log("tables created successfully");
    } catch (error) {
        console.error("Error creating tables:", error);
        throw error; // Propagate the error
    }
}

export function createuser(email, username, password) {
    try {
        database
            .runAsync(`INSERT INTO user (email,name,password) VALUES (?, ?, ?)`, email, username, password)
            .then((res) => {
                console.log("user data saved successfully", res);
            })
            .catch((err) => {
                throw err;
            });
    } catch (error) {
        throw error;
    }
}
export async function fetchalldiary() {
    const res = await database.getAllAsync("SELECT * FROM diarydata");

    return res;
}

export async function addDiary(date, year, day, data) {
    console.log(date);
    await database
        .runAsync(`INSERT INTO diarydata values('${date}',${year},${day},"${data}") `)
        .then(() => {
            console.log("data saved");
            return "Ok";
        })
        .catch((err) => {
            throw err;
        });
    return "data saved successfully";
}
export async function editDiary(date, year, day, data) {
    console.log("CURRENTY LEDITING", date, data);
    await database
        .runAsync(`UPDATE diarydata SET data="${data}" WHERE dateinfo='${date}' `)
        .then(() => {
            console.log("data updated");
            return "Ok";
        })
        .catch((err) => {
            throw err;
        });
    return "data updated successfully";
}
export async function getDiaryByDate(date) {
    console.log(date);
    const firstRow = await database.getFirstAsync(`SELECT * FROM diarydata  WHERE  dateinfo='${date}'`);
    console.log(firstRow + "data");

    return firstRow.data;
}

export async function getLast30DaysData(key) {
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
        const result = await database.getAllAsync("SELECT * FROM diarydata");
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
