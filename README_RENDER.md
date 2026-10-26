# 🚀 Render Deployment Guide (Coaching Institute)

Yeh project **Render Blueprint (`render.yaml`)** ke zariye single-click me deploy hone ke liye fully configure ho chuka hai.

Is setup me:
1. **Backend Web Service (`coaching-institute-backend`)**: Node.js + Express API server.
2. **Frontend Static Site (`coaching-institute-frontend`)**: React + Vite SPA.
3. **Automatic Interconnection**: Render Blueprint automatically backend ka live HTTPS URL frontend ke `VITE_API_URL` me inject karega, aur frontend ka URL backend ke `CLIENT_URL` me inject karega!
4. **No CORS / 404 Errors**:
   - Dynamic CORS enabled hai jo kisi bhi domain ya Render subdomain ko block nahi karega.
   - SPA Rewrite Rule configured hai jisse refresh karne par `404 Not Found` error nahi aayega.
   - Render Free Tier ke 15-minute sleep ke liye API client me timeout 45 seconds rakha gaya hai taaki cold-start me timeout error na aaye.
   - Auto-seed configured hai taaki fresh deployment par database khali na rahe aur default admin login turant kaam kare.

---

## 📌 Step-by-Step Render Deployment (Blueprint)

### Step 1: Code ko GitHub par Push karein
Apne terminal me run karein:
```bash
git add .
git commit -m "Configure Render blueprint and frontend-backend connection"
git push origin main
```

---

### Step 2: Render me Blueprint Deploy karein
1. [Render Dashboard](https://dashboard.render.com/) me login karein.
2. Upar right side me **"New +"** button par click karein aur **"Blueprint"** select karein.
3. Apna GitHub repository connect karein jisme yeh code push kiya hai.
4. Render automatically `render.yaml` file ko detect kar lega aur 2 services show karega:
   - `coaching-institute-backend` (Web Service)
   - `coaching-institute-frontend` (Static Site)
5. **"Apply"** button par click karein.

Render dono services ko create aur deploy karna shuru kar dega!

---

## 🔗 Kaise Dono URLs Connect Hote Hain?

Jab Render deploy karta hai:
- Backend URL generate hota hai: `https://coaching-institute-backend-xxxx.onrender.com`
- Frontend URL generate hota hai: `https://coaching-institute-frontend-xxxx.onrender.com`

`render.yaml` me:
```yaml
envVars:
  - key: VITE_API_URL
    fromService:
      type: web
      name: coaching-institute-backend
      envVarKey: RENDER_EXTERNAL_URL
```
Yeh line Render ko bolti hai ki backend ka live public URL frontend ke build environment me inject kar do.

Frontend ke `client/src/services/api.js` me logic laga hua hai:
```javascript
// Agar URL me '/api' nahi hai toh automatically '/api' add kar dega
let cleanUrl = envUrl.trim().replace(/\/+$/, '');
if (!cleanUrl.endsWith('/api')) {
  cleanUrl = `${cleanUrl}/api`;
}
```
Isse agar backend URL `https://coaching-institute-backend.onrender.com` milta hai, toh frontend automatically `https://coaching-institute-backend.onrender.com/api` ko call karega, koi 404 error nahi aayega!

---

## 🔑 Default Login Credentials (Auto-Seeded)

First deployment par SQLite database me yeh accounts automatically ban jaate hain:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@coaching.com` | `admin123` |
| **Student** | `student@coaching.com` | `student123` |

Saath hi Courses, Faculty aur Announcements bhi auto-seed ho jaate hain taaki website khali na dikhe.

---

## 🛠️ Agar Manual Deploy Karna Ho (Alternative Option)

Agar aap Blueprint use nahi karna chahte aur Render Dashboard se manually 2 alag services banana chahte hain:

### 1. Backend Service (Web Service):
- **Name**: `coaching-institute-backend`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `PORT`: `10000`
  - `JWT_SECRET`: koi bhi secret key (e.g. `jwt_secret_render_key_123`)
  - `CLIENT_URL`: aapka frontend URL (e.g. `https://coaching-institute-frontend.onrender.com`)

### 2. Frontend Service (Static Site):
- **Name**: `coaching-institute-frontend`
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Redirects/Rewrites**:
  - Type: `Rewrite`
  - Source: `/*`
  - Destination: `/index.html`
- **Environment Variables**:
  - `VITE_API_URL`: aapka backend live URL (e.g. `https://coaching-institute-backend.onrender.com/api`)
