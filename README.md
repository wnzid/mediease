<div align="center">
  <img src="public/branding/landscape-logo.svg" width="240" alt="MediEase" />

**A role-aware healthcare service prototype built around clear, accessible patient journeys.**

`Next.js` · `TypeScript` · `Supabase` · `Tailwind CSS`

</div>

MediEase combines a public hospital website, patient self-service, and internal workspaces for doctors, staff, and administrators. It was developed as a Human–Computer Interaction project, with particular attention to information architecture, feedback, readable interfaces, and task continuity.

## What is implemented

- Public services, clinic, doctor, accessibility, and support pages
- Patient registration, sign-in, recovery, and onboarding flows
- Doctor discovery and guided appointment booking
- Patient appointments, profile, saved doctors, documents, messages, and settings
- Doctor, staff, and administrator route groups
- Supabase-backed authentication and data access
- English and Lithuanian interface dictionaries
- Reduced-motion support, skip navigation, visible focus, and semantic page structure

Some internal screens intentionally remain presentation-ready placeholders. Documents, secure messaging, and parts of analytics still need a production integration.

## Route architecture

```text
src/app/
├── (marketing)/   Public hospital experience
├── (auth)/        Sign-in, registration, and recovery
├── (patient)/     Booking and self-service workspace
├── (doctor)/      Clinician workspace
├── (staff)/       Operational workspace
└── (admin)/       Platform administration
```

Shared UI lives in `src/components/`; domain workflows and page compositions live in `src/features/`; Supabase, sessions, localization, and data adapters live in `src/lib/`.

## Local development

```bash
npm ci
npm run dev
```

Create `.env.local` with your Supabase project values:

```text
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=server-only-service-role-key
MEDIEASE_ADMIN_PASSWORD=replace-the-development-default
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code or commit it to Git.

## Quality checks

```bash
npm run lint
npm run build
```

## HCI focus

MediEase is useful for evaluating navigation, role separation, feedback, error prevention, accessibility preferences, and the continuity of a multi-step healthcare task. It is not a deployed clinical system and must not be used to make care decisions or store real patient data without a full security, privacy, and compliance review.

## License

No license is currently declared. All rights are reserved by default.
