# LMS Project - Learning Management System

Bu loyiha **Next.js** (Frontend) va **Django REST Framework** (Backend) yordamida yaratilgan.

## Loyiha tarkibi
- `frontend/`: Next.js ilovasi (Tailwind CSS, Lucide icons).
- `backend/`: Django API (SQLite ma'lumotlar bazasi, JWT authentication).

## O'zgartirishlar va Tuzatishlar
1.  **CORS Sozlandi**: Frontend va Backend o'rtasidagi aloqa yo'lga qo'yildi.
2.  **Ma'lumotlar bazasi**: Mahalliy ishlash qulay bo'lishi uchun **SQLite**ga o'tkazildi.
3.  **Authentication**: JWT token xatoliklari to'g'rilandi va 401 (Unauthorized) holati uchun avtomatik logout qo'shildi.
4.  **Admin Panel**: [http://localhost:8000/admin](http://localhost:8000/admin) manzili orqali kirish mumkin.

## Ishga tushirish (Local Setup)

### 1. Backend (Django)
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
*Dastlabki admin foydalanuvchisi:*
- **Login**: `admin`
- **Parol**: `admin123`

### 2. Frontend (Next.js)
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Frontend serveri odatda [http://localhost:3000](http://localhost:3000) (yoki 3001) manzilida ishga tushadi.

## GitHub Push
Loyihani push qilish uchun:
```bash
git add .
git commit -m "Comprehensive fixes: CORS, Auth, SQLite and README"
git push origin main
```
