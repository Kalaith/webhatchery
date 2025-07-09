# Auth0 Setup for Frontend Application

This document provides step-by-step instructions for integrating Auth0 into the frontend application of the South Eastern Speedskaters (SES) project. The integration will enable a secure login system that supports multiple authentication providers.

## Prerequisites

- A valid Auth0 account. If you do not have one, sign up at [Auth0](https://auth0.com/).
- Basic knowledge of React and TypeScript.

## Step 1: Create an Auth0 Application

1. Log in to your Auth0 dashboard.
2. Navigate to the **Applications** section.
3. Click on the **Create Application** button.
4. Choose a name for your application (e.g., "SES Frontend") and select **Single Page Web Applications** as the application type.
5. Click **Create**.

## Step 2: Configure Application Settings

1. In the application settings, locate the **Allowed Callback URLs** field.
   - Add the URL where your application will be hosted (e.g., `http://localhost:3000` for local development).
2. Set the **Allowed Logout URLs** to the same URL.
3. Set the **Allowed Web Origins** to the same URL.
4. Save the changes.

## Step 3: Install Auth0 React SDK

In your frontend project directory, install the Auth0 React SDK using npm or yarn:

```bash
npm install @auth0/auth0-react
```

or

```bash
yarn add @auth0/auth0-react
```

## Step 4: Set Up Auth0 Provider

Wrap your application with the `Auth0Provider` component to provide authentication context to your app. Update your `index.tsx` file as follows:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);
```

## Step 5: Configure Environment Variables

Create a `.env` file in the root of your frontend project and add the following variables:

```
REACT_APP_AUTH0_DOMAIN=your-auth0-domain
REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
```

Replace `your-auth0-domain` and `your-auth0-client-id` with the values from your Auth0 application settings.

## Step 6: Implement Authentication Logic

Create a custom hook or utility functions to handle login, logout, and user information retrieval. For example, you can create a file named `useAuth.ts`:

```tsx
import { useAuth0 } from '@auth0/auth0-react';

export const useAuth = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  return {
    login: () => loginWithRedirect(),
    logout: () => logout({ returnTo: window.location.origin }),
    user,
    isAuthenticated,
    isLoading,
  };
};
```

## Step 7: Update Components for Authentication

Use the `useAuth` hook in your components to manage authentication state. For example, in your `Navbar` component:

```tsx
import React from 'react';
import { useAuth } from './useAuth';

const Navbar = () => {
  const { login, logout, user, isAuthenticated } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </nav>
  );
};

export default Navbar;
```

## Conclusion

Following these steps will set up Auth0 in your frontend application, enabling a secure login system that supports multiple authentication providers. Ensure to test the integration thoroughly and handle any edge cases related to authentication state management.