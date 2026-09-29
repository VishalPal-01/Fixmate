# FixMate — Find & Book Verified Repair Professionals

FixMate is a fully responsive, production-styled React application for discovering, comparing
and booking verified nearby repair & maintenance professionals — plumbers, electricians, AC
technicians, mobile & laptop repair experts, carpenters, appliance repair workers and more.

This is a **front-end demo build**: all data (technicians, bookings, reviews) is mocked in
`src/data/` and authentication is simulated in-memory via React Context, so you can explore the
full product experience without a backend. It's structured so a real API layer could be dropped
in behind the existing data/service functions with minimal changes.

## Tech stack

- **React 19** + **Vite** — app shell & tooling
- **React Router v7** — routing across 18 pages
- **Tailwind CSS v4** — design system (see `src/index.css` for tokens)
- **Framer Motion** — page and micro-interaction animation
- **lucide-react** — icon set

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## Exploring the app

There's no real backend, so login/register are simulated:

- Go to **Login** or **Register**, choose **Customer** or **Provider**, and submit the form
  (any values work) to enter the matching dashboard.
- Customer portal: `/dashboard`, `/bookings`, `/bookings/:id` (live tracking), `/reviews`
- Provider portal: `/provider/dashboard`, `/provider/requests`, `/provider/profile`,
  `/provider/reviews`
- Browse technicians publicly via `/services` → a category, or `/search`, then open a profile at
  `/pros/:id` and click **Book this pro** to walk through the booking flow.

## Project structure

```
src/
  components/
    layout/       Navbar, Footer, MainLayout, DashboardLayout (sidebar shell)
    sections/      Reusable landing-page blocks + TechnicianCard
    ui/            Design-system primitives (Button, Badge, Input, Modal, Rating, ...)
  context/         AuthContext (mock auth), ToastContext (notifications)
  data/            Mock data: categories, technicians, bookings, reviews, misc
  lib/             Small utilities (cn, date formatting, status metadata)
  pages/           One file per route (see App.jsx for the full route map)
```

## Pages included

Landing, Login, Register, Service Categories, Search & Nearby Services, Technician Detail,
Booking, Booking Confirmation, Customer Dashboard, My Bookings, Booking Tracking, Provider
Dashboard, Manage Requests, Edit Technician Profile, Reviews & Ratings (customer + provider),
About Us, Contact & Support, and a 404 page.
