# MallowCare Insurance Demo

This project is a demonstration of the MallowCare insurance web application, featuring separate user flows for individual and business clients.

## Getting Started

To run the project, open `index.html` in a modern web browser. No build steps are required.

## Project Structure

The project is organized into two main user flows:

- **Individual Flow**: For personal or family insurance management.
- **Business Flow**: For employers managing employee benefits.

### Core Files

- `index.html`: The main landing page, serving as the entry point for all users.
- `signup.html`: A user-type selection page that directs users to the appropriate login or signup form.
- `style.css`: Global styles for the landing page.
- `dashboard.css`: Shared styles for both individual and business dashboards.
- `login.css`: Shared styles for all login and signup pages.

### Authentication Flow

The authentication process is managed by `auth.js` and `app.js`:

1.  **`index.html` / `signup.html`**: The user selects their account type and is directed to either `individual-login.html` or `business-login.html`.
2.  **Login Pages**: On form submission, `auth.js` captures the login attempt.
3.  **Session Start**: `auth.js` sets a `userType` (`individual` or `business`) in `localStorage` to establish a session and redirects the user to their corresponding dashboard (`individual-dashboard.html` or `business-dashboard.html`).
4.  **Protected Routes**: On all protected pages (dashboards, profiles, settings), `app.js` runs first. It checks for the `userType` in `localStorage`. If it's missing, the user is redirected to `index.html`.
5.  **Logout**: The "Log Out" button, managed by `app.js`, clears the `userType` from `localStorage` and redirects the user to `index.html`.

### Data Management

-   **Persistence**: User data and preferences are persisted in the browser's `localStorage`.
-   **Data Isolation**: To prevent data conflicts between user types, all `localStorage` keys are prefixed:
    -   Individual user data: `mallow-individual-`
    -   Business user data: `mallow-business-`
-   **Scripts**:
    -   `profile.js`, `settings.js`, `payments.js`: Manage data for the individual flow.
    -   `business-profile.js`, `business-billing.js`, `members.js`: Manage data for the business flow.

This architecture ensures that the two user flows are cleanly separated while reusing shared assets like CSS files and core session management logic.