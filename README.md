# Ứng dụng Chia sẻ Ảnh

Ứng dụng web cho phép người dùng đăng nhập, đăng ảnh và bình luận.

## Tính năng

- Đăng nhập/Đăng ký tài khoản
- Xem danh sách người dùng
- Xem thông tin chi tiết người dùng
- Đăng ảnh với chú thích
- Xem ảnh của người dùng
- Bình luận trên ảnh

## Công nghệ sử dụng

- Frontend: React, Material-UI
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: Session-based

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Cài đặt dependencies cho server:
```bash
cd server
npm install
```

3. Cài đặt dependencies cho client:
```bash
cd ../client
npm install
```

4. Tạo file .env trong thư mục server với nội dung:
```
PORT=3000
DB_URL=<your-mongodb-connection-string>
```

5. Khởi động server:
```bash
cd server
npm start
```

6. Khởi động client:
```bash
cd client
npm run dev
```

## Cấu trúc thư mục

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── routes/        # Route definitions
│   │   └── App.jsx        # Main App component
│   └── package.json
│
├── server/                 # Backend Node.js application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── images/           # Uploaded images
│   └── server.js         # Main server file
│
└── README.md
```

## API Endpoints

### Authentication
- POST /admin/login - Đăng nhập
- POST /admin/register - Đăng ký
- POST /admin/logout - Đăng xuất
- GET /admin/me - Lấy thông tin người dùng hiện tại

### Users
- GET /user/list - Lấy danh sách người dùng
- GET /user/:userId - Lấy thông tin chi tiết người dùng

### Photos
- GET /photos/user/:userId - Lấy ảnh của người dùng
- POST /photos/new - Đăng ảnh mới

### Comments
- GET /comments/:photoId - Lấy bình luận của ảnh
- POST /comments - Thêm bình luận mới 