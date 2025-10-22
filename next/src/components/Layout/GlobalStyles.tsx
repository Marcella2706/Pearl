import { createGlobalStyle } from 'styled-components';

const styled = { createGlobalStyle };

export const GlobalStyles = styled.createGlobalStyle`
  :root {
    /* Light theme variables */
    --Background: #ffffff;
    --white: #000000;
    --light-gray: #374151;
    --link-color: #6b7280;
    --green: #10b981;
    --emerald: #059669;
    --text-primary: #111827;
    --text-secondary: #6b7280;
    --border-color: #e5e7eb;
    --card-bg: #f9fafb;
    --hover-bg: #f3f4f6;
  }

  [data-theme="dark"] {
    /* Dark theme variables */
    --Background: #070606;
    --white: #fff;
    --light-gray: #dcdcdc;
    --link-color: #bdbdbd;
    --green: #808080;
    --emerald: #6e6e6e;
    --text-primary: #ffffff;
    --text-secondary: #bdbdbd;
    --border-color: #374151;
    --card-bg: #1f2937;
    --hover-bg: #374151;
  }

  .dark {
    /* Dark theme variables for class-based approach */
    --Background: #070606;
    --white: #fff;
    --light-gray: #dcdcdc;
    --link-color: #bdbdbd;
    --green: #808080;
    --emerald: #6e6e6e;
    --text-primary: #ffffff;
    --text-secondary: #bdbdbd;
    --border-color: #374151;
    --card-bg: #1f2937;
    --hover-bg: #374151;
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    -webkit-font-smoothing: antialiased;
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
    font-family: 'SF Pro Display', sans-serif;
    background-color: var(--Background);
    color: var(--white);
    scroll-snap-type: y mandatory;

    &::-webkit-scrollbar {
      width: 0.5rem;
      border-radius: 0.5rem;
      &-thumb {
        background: var(--link-color);
        border-radius: 0.5rem;
      }

      &-track {
        background: var(--Background);
      }
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .parallax {
    overflow: hidden;
    margin: 0;
    white-space: nowrap;
    display: flex;
    flex-wrap: nowrap;
  }

  .parallax .scroller {
    display: flex;
    white-space: nowrap;
    display: flex;
    flex-wrap: nowrap;
  }

  .scroller span {
    display: block;
    margin-right: 5rem;
  }

  .not_complete {
    display: none;
  }

  .complete {
  }

  /* Auth Page Styles */
  .auth-page {
    min-height: 100vh;
    background-color: var(--Background);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .auth-background-overlay {
    background: var(--Background);
    background-image: 
      linear-gradient(to right, var(--border-color) 1px, transparent 1px),
      linear-gradient(to bottom, var(--border-color) 1px, transparent 1px);
    background-size: 4rem 4rem;
    mask-image: radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 110%);
  }

  .auth-blob-1 {
    background: var(--light-gray);
    opacity: 0.3;
  }

  .auth-blob-2 {
    background: var(--link-color);
    opacity: 0.3;
  }

  .auth-card {
    background: var(--card-bg);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border-color);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    transition: all 0.3s ease;
  }

  [data-theme="dark"] .auth-card {
    background: rgba(0, 0, 0, 0.7);
    box-shadow: 0 25px 50px -12px rgba(255, 255, 255, 0.1);
  }

  .dark .auth-card {
    background: rgba(0, 0, 0, 0.7);
    box-shadow: 0 25px 50px -12px rgba(255, 255, 255, 0.1);
  }

  .auth-title {
    background: linear-gradient(to right, var(--text-primary), var(--text-secondary));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.3s ease;
  }

  .auth-subtitle {
    color: var(--text-secondary);
    transition: color 0.3s ease;
  }

  .auth-google-btn {
    background: var(--hover-bg);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    transition: all 0.3s ease;
  }

  .auth-google-btn:hover {
    background: var(--border-color);
  }

  .auth-input-label {
    color: var(--text-secondary);
    transition: color 0.3s ease;
  }

  .auth-input-icon {
    color: var(--link-color);
    transition: color 0.3s ease;
  }

  .auth-input {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    transition: all 0.3s ease;
  }

  [data-theme="dark"] .auth-input {
    background: rgba(31, 41, 55, 0.5);
  }

  .dark .auth-input {
    background: rgba(31, 41, 55, 0.5);
  }

  .auth-input:focus {
    border-color: var(--link-color);
    box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.2);
  }

  [data-theme="dark"] .auth-input:focus {
    box-shadow: 0 0 0 3px rgba(189, 189, 189, 0.2);
  }

  .dark .auth-input:focus {
    box-shadow: 0 0 0 3px rgba(189, 189, 189, 0.2);
  }

  .auth-submit-btn {
    background: linear-gradient(to right, var(--text-primary), var(--text-secondary));
    color: var(--Background);
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  [data-theme="dark"] .auth-submit-btn {
    background: linear-gradient(to right, var(--white), var(--light-gray));
    color: var(--Background);
  }

  .dark .auth-submit-btn {
    background: linear-gradient(to right, var(--white), var(--light-gray));
    color: var(--Background);
  }

  .auth-submit-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  .auth-link-btn {
    color: var(--text-secondary);
    transition: color 0.3s ease;
  }

  .auth-link-btn:hover {
    color: var(--text-primary);
  }

  /* Ensure proper theme inheritance for auth components */
  .auth-page * {
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  }

  /* Light theme specific overrides */
  :root .auth-background-overlay {
    opacity: 0.06;
  }

  /* Dark theme specific overrides */
  [data-theme="dark"] .auth-background-overlay,
  .dark .auth-background-overlay {
    opacity: 0.08;
  }

  /* Error text styling for auth */
  .auth-error-text {
    color: #ef4444;
  }

  [data-theme="dark"] .auth-error-text,
  .dark .auth-error-text {
    color: #f87171;
  }
`;
