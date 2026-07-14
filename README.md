# Dr. Arpit Sohane | Professional Portfolio & Digital Business Card

A premium, highly interactive, and production-ready portfolio and digital visiting card website designed for **Dr. Arpit Sohane** (MD Pediatrics, DM Neonatology), a Gold Medalist Neonatologist and Pediatrician based in Jabalpur, Madhya Pradesh.

Live Site: [https://dr-arpit-sohane.vercel.app](https://dr-arpit-sohane.vercel.app)  
Digital Visiting Card: [https://dr-arpit-sohane.vercel.app/card.html](https://dr-arpit-sohane.vercel.app/card.html)

---

## 🚀 Key Features

### 1. Main Portfolio (`index.html`)
* **Responsive Visual Sections**: Details academic journey, clinical pediatric/neonatal services, and medical research publications.
* **Cohesive Typography**: Premium medical-themed styling with elegant Google Fonts (*Inter* and *Plus Jakarta Sans*) and high-contrast clinical colors.
* **Bilingual Switcher**: Instant transition between English and Hindi text translations. Includes specialized CSS line-height/padding to prevent Devanagari vowel markers (matras) from clipping under overflow restrictions.
* **Apple & Linear-Inspired Animations**:
  - **Calming Radial Glow**: A background gradient that slowly moves and shifts colors over a 30-second loop.
  - **Unblurring Header Reveal**: Title rows slide up and gradually unblur (`blur(8px)` to `0px`) sequentially.
  - **Staggered Links & Buttons**: Navigation elements stagger into view with an 80ms delay. Links feature a sleek underline growing outward from the center on hover.
  - **Stats Card Counter**: Numbers (`60+` and `7+`) smoothly count up from `0` to their final values over exactly 1 second as they enter the screen.
  - **Scroll Reveal**: Sub-sections fade and translate up by `60px` using `easeOutExpo` as they enter the viewport.
  - **Reduced Motion Support**: Completely respects browser-level `prefers-reduced-motion: reduce` by disabling slide/float loops to support accessibility.

### 2. Interactive Digital Visiting Card (`card.html`)
* **Mobile-First Layout**: Tailored for clinical consultants sharing credentials on the move.
* **3D Mouse Parallax Tilt**: Interactive card container rotating in 3D perspective to follow desktop cursor movement.
* **Floating 3D Crosses & Stars**: Medical crosses and star particles floating behind the card in 3D space.
* **vCard Integration**: Direct offline contact download (`dr_arpit_sohane.vcf`) triggers to instantly save credentials to phone contact books.
* **Scan & Share**: QR code modal generator renders a scannable address linking directly to the digital card.

### 3. Serverless Appointment & Enquiry Dispatch
* **Secure Backend Delivery**: Node.js endpoints configured inside `api/send-email.js` using Nodemailer.
* **Anti-Credential Leakage**: Leverages Vercel Environment Variables (`EMAIL_USER` and `USER_PASS`) with support for Gmail App Passwords to securely dispatch emails without leaking secrets to public Git repositories.

---

## 🛠️ Technology Stack

* **Frontend**: HTML5, Vanilla CSS3 (Custom Variables, Flexbox, Grid, 3D Transforms), JavaScript (ES6, requestAnimationFrame, Intersection Observer API).
* **Backend**: Node.js, Nodemailer (Email SMTP Relay).
* **Hosting & Serverless**: Vercel (Static files hosting & Node.js Serverless Functions).

---

## 📂 Project Structure

```
├── .vercel/              # Vercel project configurations
├── api/
│   └── send-email.js     # Vercel Serverless Function (Nodemailer email handler)
├── index.html            # Main portfolio landing page
├── card.html             # Digital visiting card page
├── styles.css            # Modular stylesheet (with premium transitions & keyframes)
├── script.js             # Client-side form submissions, tilt effects, and page routing
├── package.json          # Serverless dependencies (Nodemailer)
├── dr_arpit_sohane.vcf   # Offline contact vCard
├── doctor_profile.jpg    # Doctor profile picture
├── hero_bg.png           # Hero section backdrop illustration
├── .gitignore            # Excludes node_modules, .env, and system logs
└── README.md             # Project documentation (this file)
```

---

## 💻 Local Setup & Development

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Muskannn03/Dr.-Arpit-Sohane.git
   cd Dr.-Arpit-Sohane
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   EMAIL_USER=your-email@gmail.com
   USER_PASS=your-16-character-google-app-password
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Locally via Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel dev
   ```
   Open `http://localhost:3000` in your web browser.

---

## ☁️ Deployment on Vercel

The project is configured for zero-setup deployments on Vercel:

1. Link your GitHub repository to your Vercel project dashboard.
2. In the Vercel project dashboard settings under **Environment Variables**, add:
   * `EMAIL_USER`: Your Gmail address.
   * `USER_PASS`: Your generated 16-character Gmail App Password (enable 2-Step Verification in Google Account -> Security -> App Passwords to generate this).
3. Commit and push any changes to your `main` branch. Vercel will automatically run builds and deploy serverless resources.
