# 🛡️ MotorShield LK — Motor Insurance Management System
<img width="1268" height="877" alt="Screenshot 2026-06-26 141048" src="https://github.com/user-attachments/assets/b1b82c64-cfa5-4060-846e-bbfdebcdc5c4" />
<img width="1265" height="798" alt="Screenshot 2026-06-26 141120" src="https://github.com/user-attachments/assets/d2bbb844-610e-428f-92f6-f85a64b3494e" />


![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

**MotorShield LK** is a comprehensive, modern vehicle insurance platform tailored to streamline the entire insurance lifecycle. From seamless policy registrations to efficient claims processing, this system bridges the gap between administrators and vehicle owners.

## ✨ Key Features
* 👥 **Dual-Role Dashboards:** Secure and separate interfaces for System Administrators and Customers.
* 🚗 **Vehicle & Policy Tracking:** Easily register vehicles, renew policies, and track expiration dates.
* 💳 **Payment Management:** A streamlined system to manage and verify insurance premium payments.
* 📝 **Claims Processing:** Fast, automated vehicle claim requests, damage assessments, and approvals.
* 📊 **Analytics & Reports:** Detailed insights and visual reports for administrative decision-making.

## 🛠️ Technology Stack
* **Frontend:** React.js, Vite, Tailwind CSS (or your CSS framework)
* **Backend:** Laravel 12 (PHP)
* **Database:** MySQL
* **Authentication:** Laravel Sanctum

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
* [PHP](https://www.php.net/) & [Composer](https://getcomposer.org/)
* [Node.js](https://nodejs.org/) & npm
* [XAMPP](https://www.apachefriends.org/index.html) (for MySQL Database)

### ⚙️ Installation

**1. Clone the repository**

git clone [https://github.com/charithwannisingha/MotorShield-Insurance-System.git](https://github.com/charithwannisingha/MotorShield-Insurance-System.git)

2. Database Setup

Start Apache and MySQL in your XAMPP Control Panel.

Open http://localhost/phpmyadmin in your browser.

Create a new database (e.g., motorshield_db) and import the provided .sql file located in the root directory.

3. Backend Setup (Laravel)
Open a terminal, navigate to the api-backend folder, and run:

Bash
cd api-backend
composer install
copy .env.example .env
php artisan key:generate
php artisan serve
4. Frontend Setup (React/Vite)
Open a new terminal, navigate to the frontend folder (or root if React is there), and run:

Bash
npm install
npm run dev
🔐 Default Login Credentials
Use the following credentials to explore the Administrator features:

Email: admin@motorshield.lk

Password: admin123

Developed by Charith Wannisingha 🚀
