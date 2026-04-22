# MediEase

MediEase is a modern hospital and healthcare web platform built around a calm, accessible, and role-aware user experience. The project includes a public-facing website, patient self-service flows, and internal workspaces for doctors, staff, and administrators.

This prototype was designed with Human-Computer Interaction (HCI) principles in mind, including clear navigation, visual hierarchy, feedback on actions, accessibility support, and structured task flows such as onboarding and appointment booking.

## Project overview

MediEase is intended to support the core needs of a digital healthcare platform, including:

- public hospital/clinic website pages
- patient sign up and sign in
- role-based access for patient, doctor, staff, and admin users
- appointment discovery and booking flows
- patient dashboard, profile, documents, messages, and settings
- doctor, staff, and admin workspaces
- accessibility preferences such as reduced motion and readable UI patterns
- Supabase-backed authentication and data access

## Main goals

The product aims to provide:

- a realistic healthcare website structure
- a functional multi-page interface with deep navigation
- interactive UI even where backend logic is still evolving
- a patient-first experience that is clear and easy to understand
- a strong foundation for further expansion into a full hospital platform

## Tech stack

Based on the uploaded source code, the project uses:

- **Next.js** with the App Router
- **React**
- **TypeScript**
- **Tailwind CSS**-style utility classes
- **Supabase** for authentication and database access
- custom UI and feature components organized by role and domain

## Current architecture

The codebase is organized around the `src` directory and follows a feature-oriented structure.

### Top-level structure

```text
src/
├── actions/             # Server actions such as auth flows
├── app/                 # App Router pages and layouts
│   ├── (marketing)/     # Public site pages
│   ├── (auth)/          # Authentication pages
│   ├── (patient)/       # Patient workspace
│   ├── (doctor)/        # Doctor workspace
│   ├── (staff)/         # Staff workspace
│   └── (admin)/         # Admin workspace
├── components/          # Shared UI, layout, forms, dashboard components
├── features/            # Role/domain-specific feature modules
├── lib/                 # Auth, constants, formatting, data, permissions, Supabase helpers
└── types/               # Shared TypeScript types
```

## Key product areas

### 1. Public/marketing website
The website includes a landing experience and supporting public pages such as:

- home
- about
- services
- appointments
- doctors
- contact
- privacy and other informational pages

These pages establish MediEase as a hospital platform rather than a single-purpose booking page.

### 2. Authentication
The project includes role-aware authentication flows, including:

- patient sign in
- patient sign up
- forgot password
- reset password
- verification flow
- internal staff/doctor/admin sign in path

Auth is implemented with server actions and Supabase.

### 3. Patient workspace
The patient side is currently the strongest showcase area and includes:

- dashboard
- appointment list and appointment details
- booking flow
- doctor discovery pages
- saved doctors
- messages
- documents
- profile
- onboarding form
- settings

### 4. Internal workspaces
The source also includes separate areas for:

- doctor
- staff
- admin

These provide the structure for a full healthcare platform, even if some areas are still placeholders or under active development.

## Notable UX and HCI decisions

The project intentionally reflects HCI-oriented design decisions such as:

- **clear navigation hierarchy** with public pages and role-based workspaces
- **two or more levels of navigation depth**, satisfying course project requirements
- **step-based booking and onboarding flows** to reduce cognitive overload
- **feedback and interaction patterns** such as toasts, dropdowns, loading states, and form validation
- **accessibility support** through provider-based preferences and keyboard-friendly UI patterns
- **visual grouping** through cards, sections, and dashboards to improve scanability
- **control and error prevention** with guided flows, validation, and role-based redirects

## Routing summary

### Public routes
Examples from the project include:

- `/`
- `/about`
- `/contact`
- `/faq`
- `/for-patients`
- `/for-doctors`
- `/pricing`
- `/privacy`

### Auth routes
Examples include:

- `/sign-in`
- `/sign-up`
- `/forgot-password`
- `/reset-password`
- `/verify`
- `/staff-login`

### Role home routes
Role-based redirects are configured for:

- patient → `/patient/dashboard`
- doctor → `/doctor/dashboard`
- staff → `/staff/dashboard`
- admin → `/admin/dashboard`

## Supabase integration

The source code shows Supabase-based helpers for:

- server client creation
- browser client creation
- middleware support
- service role usage for protected/admin-style setup tasks
- authentication actions
- data fetching for clinics, doctors, appointments, notifications, and profiles

### Environment variables
From the uploaded source, the following environment variables are used:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
# or
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=
# or
NEXT_PRIVATE_SUPABASE_SERVICE_ROLE_KEY=
```

If Supabase is not configured, some areas are designed to fail safely or return empty data.

## Accessibility support

The project includes accessibility-minded structure and providers, including:

- skip-to-content link in the root layout
- accessibility provider wrapping the app
- reduced-motion-friendly architecture
- visible focus support patterns
- readable visual hierarchy and card-based structure

This aligns well with the project’s HCI focus.

## Patient flow highlights

A typical patient-side flow currently looks like this:

1. Visit the public website
2. Sign up or sign in
3. Enter the patient dashboard
4. Complete onboarding/profile details
5. Find a doctor or begin booking
6. Book an appointment through a guided flow
7. Review appointments, documents, and settings

## Strengths of the current project

- strong route and layout structure
- clear role separation
- realistic healthcare platform scope
- patient-side flow already suitable for HCI demonstration
- good base for accessibility and interaction design discussion
- maintainable folder structure with shared types and domain-based modules

## Current limitations

At the current stage of development, some parts of the project are still incomplete or placeholder-based. Depending on the branch/version, this may include:

- placeholder content in some internal dashboards
- incomplete live data wiring in some pages
- partially implemented dashboard widgets
- role areas that exist structurally but are not yet fully production-ready
- bilingual/localization support still in progress unless added later

This is normal for a coursework prototype and does not reduce the value of the project as a UI/HCI-focused submission.

## Running the project locally

> Note: the uploaded archive contains the `src` code only. A `package.json` file was not included in the uploaded material, so the exact scripts below may need to be adjusted to match your local project.

Typical local setup for a Next.js + Supabase project would be:

```bash
npm install
npm run dev
```

Then open the local development URL shown in the terminal, commonly:

```text
http://localhost:3000
```

If your project uses a different package manager, use the equivalent command:

```bash
yarn install && yarn dev
# or
pnpm install && pnpm dev
```

## Recommended setup steps

1. Install dependencies
2. Create a local environment file
3. Add the required Supabase keys
4. Start the development server
5. Verify public pages
6. Verify auth flows
7. Test the patient booking and onboarding journey

## HCI relevance

This project was created in the context of a Human-Computer Interaction practical assignment. It is suitable for demonstrating:

- navigation and information architecture
- feedback and interaction design
- accessibility and readability
- affordance and efficiency
- error prevention and user control
- multi-role interface design

## Author

**Md Nahidul Islam**  
Software Engineering student  

---


