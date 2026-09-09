# Prayer Time PWA using JAKIM API (Malaysia Only)

## Project info

### Current location

Press **Use my location** and allow your browser's location request. The app sends
the device coordinates to [Waktu Solat's zone API](https://api.waktusolat.app/docs),
which maps the point to a Malaysian prayer-zone polygon. It then loads that zone's
prayer times directly from JAKIM e-Solat. Coordinates are not saved by this app;
only the selected zone is stored locally. Waktu Solat is a third-party service.

GPS requires HTTPS (or localhost for development), browser permission, and device
location services. If embedded in another website, that site's permissions policy
must also allow geolocation. Desktop locations may be approximate; check the
detected area, particularly near zone boundaries. Locations with reported accuracy
worse than 10 km are rejected. No Malaysian zone is substituted when detection fails
or the coordinates are outside the supported polygons. Manual search remains available.

The bundled zone catalog was refreshed from `https://api.waktusolat.app/zones`
on 2026-09-10. Refresh this catalog when upstream zone definitions change.

### Validation

Run `npm ci`, `npm test`, `npm run typecheck`, and `npm run build`.
The tests use simulated device coordinates and service responses. Real device
permission prompts and GPS accuracy should also be checked on an HTTPS deployment.

## How can I edit this code?

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. 

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

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

