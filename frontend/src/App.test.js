import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the apiClient
jest.mock('./service/apiClient', () => ({
  authAPI: {
    login: jest.fn(),
    signup: jest.fn(),
  },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete_: jest.fn(),
}));

describe('App Component', () => {
  test('renders login page on root path', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    // Check if the login page is rendered
    const loginElements = screen.queryAllByText(/login|email/i);
    expect(loginElements.length).toBeGreaterThan(0);
  });

  test('renders signup page when navigating to /signup', async () => {
    window.history.pushState({}, 'Signup', '/signup');
    render(
      <BrowserRouter initialEntries={['/signup']}>
        <App />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      const signupElements = screen.queryAllByText(/create account|signup|full name/i);
      expect(signupElements.length).toBeGreaterThan(0);
    });
  });

  test('App renders without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByRole('main', { hidden: true }) || document.querySelector('main')).toBeInTheDocument;
  });
});
