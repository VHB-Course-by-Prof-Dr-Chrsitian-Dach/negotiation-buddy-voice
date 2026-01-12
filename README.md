
## Project info



Simply visit the [Lovable Project](https://lovable.dev/projects/5555afaf-32a3-45dc-bba5-0ede7dd04de7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Voice Negotiation Feature (Vapi Integration)

This project integrates the Vapi AI voice platform for real-time negotiation practice.

### Environment Variables

Create a `.env.local` file (copy from `.env.example`):

```
VITE_VAPI_PUBLIC_KEY=f1126e26-c62f-4452-8beb-29e341a2e639
VITE_VAPI_ASSISTANT_ID_GATEKEEPER=eed3866d-fbe9-49eb-a52a-3ff9cf579389
VITE_VAPI_ASSISTANT_ID_SKIPASS=0f4de0f8-b0d6-4fbf-82ab-0a15fe7f3f9f
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Do NOT expose or place your private key (`2ff0266a-...`) in frontend code. Only the public key is used in the browser.

### Authentication (Student Email Only)

This app requires login to access negotiation cases.

- Registration verifies email via a code sent to the inbox.
- Password reset uses an email code, then lets the user set a new password.
- Public email providers (e.g. Gmail/Yahoo/Outlook) are blocked — users must use a student/institutional email domain.

For production (Cloudflare Pages), set these environment variables:

- `VITE_VAPI_PUBLIC_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Common Troubleshooting

- Microphone denied: allow mic access in browser permissions, then retry.
- Missing env vars: status will show "Missing Vapi configuration"; ensure `.env.local` is loaded (restart dev server after adding).
- Incorrect assistant ID: verify the ID matches the one in your Vapi dashboard.
- Network / HTTPS: production deployments must serve over HTTPS for consistent audio capture.

### Extending

Potential enhancements include transcript logging, negotiation scoring, and persistence of session outcomes. The `vapi.on('message', ...)` hook in `VoiceInterface` is a good entry point for capturing conversation turns.


**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5555afaf-32a3-45dc-bba5-0ede7dd04de7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
