# 🌾 AgroChain – Blockchain-based Farm Produce Traceability  

![AgroChain Logo](https://agrochain-blockchain-0590.bolt.host/logo.png)  

### 🔗 Live Demo: [AgroChain](https://agrochain-blockchain-0590.bolt.host/)  

---

## 📌 Overview  
AgroChain is a **blockchain-inspired produce traceability platform** that ensures transparency and trust across the agricultural supply chain. From **farmers → wholesalers → retailers → consumers**, every transaction is securely recorded and verified through QR codes and immutable records.  

---

## 🎯 Features  
- 👨‍🌾 **Farmer Dashboard** – Upload produce details (type, harvest date, price, location).  
- 📦 **Wholesaler & Retailer Dashboard** – Verify authenticity, update supply chain records.  
- 🛒 **Consumer Portal** – Scan/enter QR code to view produce origin and journey.  
- 🔐 **Role-based Access Control** – Separate dashboards for farmers, wholesalers, retailers, and consumers.  
- 🧾 **Blockchain Simulation** – SHA-256 hash ensures immutability of transactions.  
- 📊 **Analytics Page** – Track number of uploads, transactions, and verifications.  

---

## 🏗️ Tech Stack  
### Frontend  
- ⚛️ React.js  
- 🎨 Tailwind CSS  

### Backend  
- 🐍 Django (Python)  
- 🗄️ MySQL Database  

### Blockchain Layer (Simulated)  
- 🔑 SHA-256 Hashing for immutable records  
- 📜 QR Code Generation for produce tracking  

---

## 🔄 Workflow  
1. **Farmer** uploads produce details → system generates QR + blockchain hash.  
2. **Wholesaler** verifies and updates ownership.  
3. **Retailer** checks authenticity before selling.  
4. **Customer** scans QR → sees full history (farm-to-store journey).  

---

## 🚀 Getting Started  

### 🔧 Installation (Local Development)  
```bash
# Clone the repo
git clone https://github.com/your-username/agrochain.git
cd agrochain

# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup
cd backend
pip install -r requirements.txt
python manage.py runserver
