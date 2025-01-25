const { MongoClient } = require("mongodb");

// Chuỗi kết nối từ MongoDB Atlas
const url = "mongodb+srv://admin:lSxn30gpdwSdRaTi@cluster0.mongodb.net/test";
const client = new MongoClient(url);

async function connectDB() {
    try {
        // Kết nối tới MongoDB
        await client.connect();
        console.log("Database connected!");

        // Lấy database "test"
        const db = client.db("test");

        // Kiểm tra và tạo collection "customers" nếu chưa tồn tại
        const collections = await db.listCollections({ name: "customers" }).toArray();
        if (collections.length === 0) {
            const result = await db.createCollection("customers");
            console.log("Collection created:", result.collectionName);
        } else {
            console.log("Collection already exists.");
        }
    } catch (err) {
        console.error("Database connection error:", err);
    } finally {
        // Đóng kết nối
        await client.close();
    }
}

// Gọi hàm kết nối
connectDB();
