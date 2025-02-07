// // const express = require('express')
// // const app = express()

// // app.get('/', (req, res) => {
// //     res.send('Hello API Update')
// // })
// // const PORT = process.env.PORT || 5000
// // app.listen(PORT, () => {
// //     console.log('node start on port '+ PORT)
// // })


// const express = require("express");
// const { MongoClient } = require("mongodb");

// // Chuỗi kết nối MongoDB
// const url = "mongodb+srv://admin:lSxn30gpdwSdRaTi@cluster0.rqu06.mongodb.net/test";
// const client = new MongoClient(url);

// const app = express();
// const port = 3000;

// app.get("/", async (req, res) => {
//     try {
//         // Kết nối tới MongoDB
//         await client.connect();
//         console.log("Database connected!");

//         // Lấy database "test" và collection "tbs"
//         const db = client.db("test");
//         const collection = db.collection("tbs");

//         // Lấy toàn bộ dữ liệu từ collection
//         const results = await collection.find({}).toArray();

//         // Hiển thị dữ liệu trên trang web
//         res.send(`
//             <h1>Danh Sách Dữ Liệu Từ Bảng TBS</h1>
//             <ul>
//                 ${results.map(item => `<li>${item.ten} - ${item.lop}</li>`).join("")}
//             </ul>
//         `);
//     } catch (err) {
//         console.error("Lỗi khi lấy dữ liệu:", err);
//         res.status(500).send("Lỗi khi kết nối hoặc lấy dữ liệu!");
//     } finally {
//         // Đóng kết nối
//         await client.close();
//     }
// });

// const PORT = process.env.PORT || 5000
// app.listen(PORT, () => {
//     console.log('node start on port '+ PORT)
// })
//=============================//
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json()); // Middleware để xử lý JSON
app.use(express.urlencoded({ extended: true })); // Middleware xử lý form

const url = "mongodb+srv://admin:lSxn30gpdwSdRaTi@cluster0.rqu06.mongodb.net/test";
const client = new MongoClient(url);
const dbName = "test";
const collectionName = "tbs";

// Hiển thị trang HTML với form
app.get("/", async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const results = await collection.find({}).toArray();
        
        let listItems = results.map(item => `
            <li>${item.ten} - ${item.lop} 
                <a href="/delete/${item._id}" onclick="return confirm('Bạn có chắc chắn muốn xóa?')">Xóa</a> | 
                <a href="/edit/${item._id}">Sửa</a>
            </li>`).join("\n");
        
        res.send(`
            <h1>Quản lý dữ liệu</h1>
            <form action="/add" method="POST">
                <input type="text" name="ten" placeholder="Tên" required>
                <input type="text" name="lop" placeholder="Lớp" required>
                <button type="submit">Thêm</button>
            </form>
            <ul>${listItems}</ul>
        `);
    } catch (err) {
        res.status(500).send("Lỗi khi lấy dữ liệu!");
    } finally {
        await client.close();
    }
});

// Thêm dữ liệu
app.post("/add", async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.insertOne(req.body);
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Lỗi khi thêm dữ liệu!");
    } finally {
        await client.close();
    }
});

// Xóa dữ liệu
app.get("/delete/:id", async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.redirect("/");
    } catch (err) {
        res.status(500).send("Lỗi khi xóa dữ liệu!");
    } finally {
        await client.close();
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});