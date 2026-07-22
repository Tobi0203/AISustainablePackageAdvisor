# EcoPack AI — Sustainable Packaging Advisor & Supplier Platform

EcoPack AI is a full-stack, AI-powered web application that helps businesses choose sustainable packaging materials and connect with packaging suppliers. It combines a product marketplace, supplier catalog management, RFQ and quotation workflows, private real-time buyer–supplier messaging, sustainability comparisons, and Google Gemini-powered packaging guidance.

> Assessment project: Startup / Manufacturing Web Application

## Live Submission Details

| Item | Link / value |
| --- | --- |
| GitHub repository | https://github.com/Tobi0203/AISustainablePackageAdvisor |
| Live frontend URL | Add deployed frontend URL after deployment |
| Live API URL | Add deployed API URL after deployment |

## Assessment Alignment

This project is designed to address the requested assessment areas:

| Assessment requirement | Implementation in this project |
| --- | --- |
| Requirement analysis | Sustainable packaging selection and supplier discovery problem are addressed through customer, supplier, and administrator workflows. |
| Product thinking | The platform balances material cost, protection, sustainability, supplier availability, and quote management. |
| Prompt engineering | Gemini prompts are versioned in `backend/services/geminiService.js` and request structured, explainable output. |
| UI/UX design | Responsive SaaS interface, protected dashboards, marketplace filters, clear empty/loading/error states, and mobile navigation. |
| AI-assisted development | The project includes Gemini recommendations, sustainability scoring, cost estimation, and a packaging chatbot. |
| Complete application development | React frontend, Express/MongoDB backend, role-based authentication, database models, REST APIs, and AI endpoints. |
| Testing and QA | Build validation, API checklist, validation rules, error handling, security checks, and responsive test scenarios are documented below. |
| Deployment | Deployment instructions for Vercel/Netlify frontend and Render/Railway backend are included below. |

## Problem Statement

Businesses need packaging that protects their products without compromising cost, usability, or environmental responsibility. Selecting material manually is slow because product requirements, sustainability claims, supplier details, certification information, delivery conditions, and pricing are usually fragmented.

EcoPack AI centralizes this decision process. Customers describe their packaging needs, compare sustainable products, ask suppliers for quotations, and use AI to understand material trade-offs. Suppliers can maintain profiles and respond to buyer requests, while administrators manage users and supplier verification.

## Target Users and Roles

| Role | Primary capabilities |
| --- | --- |
| Customer | Browse products, use the AI adviser, save favorites, compare products, request supplier quotes, accept/reject offers, and message suppliers within an RFQ. |
| Supplier | Maintain a company profile, create/edit/delete packaging products, review RFQs, send quotations, and message customers within an RFQ. |
| Admin | Review users, oversee suppliers, and verify supplier accounts directly from the admin dashboard. |

## Core Features

- Cookie-based JWT authentication and role-based access control
- Customer, supplier, and administrator dashboards
- Sustainable packaging product marketplace
- Product search, category filtering, eco-score filtering, favorites, and product comparison
- Supplier directory with verification status
- Supplier product catalog management: create, edit, and delete own listings
- RFQ and quotation workflow: customers create RFQs; suppliers quote or decline; customers accept, reject, or cancel
- Private real-time buyer–supplier messaging within each quotation using Socket.IO
- Google Gemini AI packaging recommendation engine
- AI sustainability score and cost-estimation endpoints
- Context-aware packaging chatbot
- Responsive navigation, forms, loading states, empty states, error routes, toast feedback, and an application error boundary

## AI Design and Justification

### Selected AI Capability

Google Gemini is used for natural-language packaging decision support. This use case benefits from an LLM because the recommendation depends on several interacting variables: product type, weight, budget, fragility, destination, and a sustainability preference.

### Why an LLM Instead of a Traditional ML Model

A traditional predictive model would require a large, high-quality historical dataset of packaging outcomes, prices, damage rates, and lifecycle assessments. That data is not available for an MVP. Gemini can provide structured advisory guidance from a constrained prompt while the application clearly labels results as non-binding estimates.

RAG, computer vision, OCR, speech-to-text, and predictive ML are not required for the current MVP. They are appropriate future extensions for supplier-certificate verification, packaging-document retrieval, product-image analysis, and fulfillment/demand forecasting.

### AI Features

1. **Packaging recommendation** — Recommends a best material, alternatives, cost range, eco score, explanation, and disposal guidance.
2. **Sustainability score generator** — Returns a planning-oriented eco score and explanation.
3. **Cost estimator** — Returns an estimated material cost range and alternatives.
4. **Packaging chatbot** — Answers packaging-related questions while avoiding compliance guarantees.

### AI Safety Controls

- The Gemini API key remains server-side and is never exposed to the browser.
- AI endpoints require authentication and have request limits.
- Prompts explicitly prohibit invented certifications and legal/compliance guarantees.
- Structured JSON output is requested and defensively parsed.
- AI results are labelled as estimates for planning, not supplier quotations or legal advice.

## Master Prompt

The application sends the following intent to the recommendation model. The executable version is maintained in `backend/services/geminiService.js`.

```text
You are EcoPack AI, a sustainable-packaging decision-support expert.
Provide conservative, non-binding estimates. Never invent certifications or
regulatory compliance. State assumptions in the explanation. Recommend only
commercially plausible packaging.

Using the supplied product type, weight, budget, fragility, destination, and
sustainability preference, return structured JSON containing:
- bestMaterial
- estimatedCost: low, high, currency, basis
- ecoScore from 0 to 100
- explanation
- disposalGuidance
- alternative materials with eco score, estimated cost, and trade-off
```

## User Flow

```text
Visitor
  → Register / sign in
  → Customer, supplier, or admin workspace

Customer
  → Browse/search/filter packaging products
  → Compare or save products
  → Use AI adviser for a material recommendation
  → Open a product and send RFQ
  → Review supplier quotations

Supplier
  → Complete supplier profile
  → Add products
  → Receive RFQs
  → Return pricing, lead time, and quotation details

Admin
  → Review users
  → Review suppliers
  → Verify supplier profiles
```

## Application Architecture

```text
React 19 + Vite + Tailwind CSS
        │ Axios (secure cookies)
        ▼
Node.js + Express REST API
        │
        ├── JWT authentication / RBAC / validation / rate limits
        ├── Google Gemini AI service
        ▼
MongoDB + Mongoose
```

## Technology Stack

### Frontend

- React 19 and Vite
- React Router
- Tailwind CSS
- Axios
- React Hook Form
- Framer Motion
- React Hot Toast

### Backend

- Node.js and Express
- MongoDB and Mongoose
- JWT stored in HTTP-only cookies
- bcryptjs
- express-validator
- Helmet, HPP, CORS, and express-rate-limit
- Google Gemini API (`@google/genai`)
- Socket.IO for authenticated real-time quotation messages

## Folder Structure

```text
AISustainablePackageAdvisor/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # REST endpoint handlers
│   ├── middleware/      # auth, validation, errors, security, rate limiting
│   ├── models/          # User, Supplier, Product, Quote, Favorite
│   ├── routes/          # API route definitions
│   ├── services/        # Gemini integration and prompts
│   ├── utils/           # token and error helpers
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  # navigation, loaders, cards, chatbot, guards
│   │   ├── context/     # authentication and comparison state
│   │   ├── lib/         # Axios client
│   │   ├── pages/       # routed screens
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Local Setup

### Prerequisites

- Node.js 18 or newer
- MongoDB locally or a MongoDB Atlas connection string
- Google Gemini API key from Google AI Studio

### 1. Configure the Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Set these required values in `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/sustainable-packaging-advisor
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=your_google_ai_studio_api_key
CLIENT_URL=http://localhost:5173
```

### 2. Configure the Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Set this value in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Open the local Vite URL shown in the terminal, normally `http://localhost:5173`.

## API Documentation

Base URL: `/api/v1`

All protected endpoints require the secure authentication cookie created by login/register. The API also accepts `Authorization: Bearer <JWT>` for non-browser clients.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register a customer or supplier |
| POST | `/auth/login` | Public | Sign in and create secure cookie |
| POST | `/auth/logout` | Public | Clear secure cookie |
| GET | `/auth/me` | Authenticated | Get current user and supplier profile |
| PATCH | `/users/me` | Authenticated | Update personal profile |
| GET | `/users` | Admin | List platform users |
| PATCH | `/users/:id/status` | Admin | Activate/deactivate a user |
| GET | `/suppliers` | Public | List/search suppliers |
| GET | `/suppliers/:id` | Public | Supplier details |
| GET/PATCH | `/suppliers/me` | Supplier | Get/update own supplier profile |
| PATCH | `/suppliers/:id/verification` | Admin | Verify supplier |
| GET | `/products` | Public | Search/filter/paginate products |
| GET | `/products/mine` | Supplier | List the authenticated supplier's products |
| GET | `/products/:id` | Public | Product details |
| POST | `/products` | Supplier | Create a product |
| PATCH/DELETE | `/products/:id` | Supplier/Admin | Update/delete owned product |
| GET/POST | `/quotes` | Customer/Supplier/Admin | List quotes / customer creates RFQ |
| PATCH | `/quotes/:id` | Quote owner/Admin | Update quote status/details |
| GET | `/quotes/:quoteId/messages` | Quote participants/Admin | Get the private RFQ conversation |
| POST | `/quotes/:quoteId/messages` | Quote participants/Admin | Send a private RFQ message; broadcasts instantly with Socket.IO |
| GET/POST | `/favorites` | Customer | List/add favorite product |
| DELETE | `/favorites/:productId` | Customer | Remove favorite |
| POST | `/ai/recommendations` | Authenticated | Full AI packaging recommendation |
| POST | `/ai/sustainability-score` | Authenticated | Eco score and guidance |
| POST | `/ai/cost-estimate` | Authenticated | Cost estimate and alternatives |
| POST | `/ai/chat` | Authenticated | Packaging chatbot response |

### AI Recommendation Request Example

```json
{
  "productType": "Glass skincare bottle",
  "weight": "350 g",
  "budget": "$1.20 per unit",
  "fragility": "high",
  "destination": "Hyderabad, India",
  "sustainabilityPreference": "recyclable"
}
```

## Validation, Loading, Empty, and Error States

- Client-side forms use React Hook Form with required-field and password-length validation.
- Server-side requests use `express-validator` and Mongoose schema validation.
- AI endpoints validate all required packaging inputs and chatbot message lengths.
- Loading spinners are provided for pages and AI response generation.
- Product and supplier views provide empty states.
- The application includes a not-found route, API error toasts, centralized Express error handling, and a React error boundary.

## Security Controls

- Password hashing with bcrypt using 12 salt rounds
- JWT stored in HTTP-only cookies
- Role-based authorization for Customer, Supplier, and Admin roles
- Secure cookie flags in production (`Secure`, `SameSite=None`)
- CORS restricted to `CLIENT_URL`
- Helmet security headers
- HTTP parameter pollution protection
- Recursive request sanitization blocking MongoDB operator keys
- Request body size limit
- Validation and standardized error responses
- Secrets supplied only through environment variables

## Responsive UI/UX

- Mobile navigation menu and touch-friendly controls
- Responsive grids for products, suppliers, cards, and dashboard metrics
- Desktop, tablet, and mobile-friendly Tailwind breakpoints
- Accessible labels, focus states, semantic buttons, and keyboard-submit search
- Consistent visual system using forest green, leaf green, soft mist backgrounds, rounded cards, and clear hierarchy

## Testing and Quality Assurance Checklist

### Functional Testing

- [ ] Register customer and supplier accounts
- [ ] Sign in, sign out, and restore secure-cookie session
- [ ] Confirm unauthorized users are redirected from protected routes
- [ ] Confirm each role cannot access the other role’s dashboard
- [ ] Search and filter products
- [ ] Open product details and submit RFQ as customer
- [ ] Sign in as a supplier and create, edit, and delete own products
- [ ] Sign in as a supplier and respond to an RFQ with amount, currency, lead time, validity, and a message
- [ ] Sign in as a customer and accept, reject, or cancel a quotation
- [ ] Open the same RFQ as customer and supplier in separate sessions; verify messages arrive without refreshing
- [ ] Save/remove favorites and compare up to three products
- [ ] Update customer and supplier profiles
- [ ] Verify supplier as admin
- [ ] Submit AI recommendation request with valid and invalid fields
- [ ] Send chatbot questions and verify a useful response or graceful service error

### UI/UX Testing

- [ ] Test 320px mobile, tablet, and desktop layouts
- [ ] Test navigation menu at mobile width
- [ ] Confirm visible keyboard focus states
- [ ] Confirm loading, empty, not-found, and backend error states
- [ ] Test current Chrome, Firefox, Edge, and Safari

### Security Testing

- [ ] Ensure `.env` files are not committed
- [ ] Confirm protected routes reject missing/invalid cookies or JWTs
- [ ] Confirm supplier cannot edit another supplier’s product
- [ ] Test invalid MongoDB-style payload keys and malformed IDs
- [ ] Review CORS origin before production deployment

### Build Validation

```bash
cd backend
node --check server.js

cd ../frontend
npm run build
```

## Deployment Guide

### Backend: Render or Railway

1. Create a new Node.js web service from the GitHub repository.
2. Set root directory to `backend`.
3. Set build command to `npm install`.
4. Set start command to `npm start`.
5. Add all variables from `backend/.env.example`.
6. Set `NODE_ENV=production`.
7. Use MongoDB Atlas and allow the deployment provider’s network access.
8. Set `CLIENT_URL` to the deployed frontend URL exactly.

### Frontend: Vercel or Netlify

1. Import the same repository.
2. Set root directory to `frontend`.
3. Set build command to `npm run build`.
4. Set publish directory to `dist`.
5. Add `VITE_API_URL=https://your-api-domain/api/v1`.
6. Deploy and add the frontend deployment URL to backend `CLIENT_URL`.

### Post-Deployment Checks

- Confirm the API health endpoint: `GET /api/v1/health`
- Confirm browser cookies are `HttpOnly` and `Secure`
- Confirm CORS permits only the deployed frontend
- Test login, a protected API request, AI recommendation, and chatbot
- Add deployed links to the submission table at the beginning of this README

## Future Enhancements

- Verified lifecycle-assessment datasets and localized carbon calculations
- Supplier document upload, OCR, and certificate verification
- RAG over packaging regulations, certifications, and supplier documents
- Payment, purchase-order, and inventory integrations
- Supplier review and dispute workflows
- Automated testing suite with Vitest, React Testing Library, Supertest, and Playwright
- CI/CD quality gates and dependency/security scanning

## Submission Checklist

- [ ] GitHub repository is public or shared with the evaluator
- [ ] Live frontend URL is available and working
- [ ] Live backend URL is available and working
- [ ] README includes architecture, AI tooling, test checklist, and deployment guide
- [ ] Master prompt is present in this README and in source code
- [ ] Environment secrets are excluded from version control
- [ ] Demo credentials are included only if they are safe to share
