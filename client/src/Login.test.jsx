import { describe, it, expect } from 'vitest';
import { screen, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Login from './Login';
import authReducer from './features/authSlice';
import cartReducer from './features/cartSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

describe('test component Login', () => {
  it('test email input', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    const element = screen.getByPlaceholderText('Enter your email');
    expect(element).toBeInTheDocument();
  });

  it('test password input', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    const element = screen.getByPlaceholderText('Enter your password');
    expect(element).toBeInTheDocument();
  });

  it('test login button', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    const element = screen.getByRole('button', { name: /login/i });
    expect(element).toBeInTheDocument();
  });

  it('test create an account link', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    const element = screen.getByRole('link', { name: /create an account/i });
    expect(element).toBeInTheDocument();
  });
});