const express = require("express");
const { MongoClient } = require("mongodb");

// Chuỗi kết nối MongoDB
const url = "mongodb+srv://admin:lSxn30gpdwSdRaTi@cluster0.rqu06.mongodb.net/test";
const client = new MongoClient(url);

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
    try {
        // Kết nối tới MongoDB
        await client.connect();
        console.log("Database connected!");

        // Lấy database "test" và collection "tbs"
        const db = client.db("test");
        const collection = db.collection("tbs");

        // Lấy toàn bộ dữ liệu từ collection
        const results = await collection.find({}).toArray();

        // Hiển thị dữ liệu trên trang web
        res.send(`
            <h1>Danh Sách Dữ Liệu Từ Bảng TBS</h1>
            <ul>
                ${results.map(item => `<li>${item.ten} - ${item.lop}</li>`).join("")}
            </ul>
        `);
    } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
        res.status(500).send("Lỗi khi kết nối hoặc lấy dữ liệu!");
    } finally {
        // Đóng kết nối
        await client.close();
    }
});

// Lắng nghe server
app.listen(port, () => {
    console.log(`Server đang chạy tại: http://localhost:${port}`);
});
