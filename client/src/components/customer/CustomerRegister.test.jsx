import { describe, it, expect } from 'vitest';
import { screen, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CustomerRegister from './CustomerRegister';

describe('test component CustomerRegister', () => {
  it('test customer name input', () => {
    render(
      <BrowserRouter>
        <CustomerRegister />
      </BrowserRouter>
    );
    const element = screen.getByPlaceholderText('Enter your name');
    expect(element).toBeInTheDocument();
  });

  it('test email input', () => {
    render(
      <BrowserRouter>
        <CustomerRegister />
      </BrowserRouter>
    );
    const element = screen.getByPlaceholderText('Enter your email');
    expect(element).toBeInTheDocument();
  });

  it('test phone number input', () => {
    render(
      <BrowserRouter>
        <CustomerRegister />
      </BrowserRouter>
    );
    const element = screen.getByPlaceholderText('Enter your phone number');
    expect(element).toBeInTheDocument();
  });

  it('test password input', () => {
    render(
      <BrowserRouter>
        <CustomerRegister />
      </BrowserRouter>
    );
    const element = screen.getByPlaceholderText('Enter your password');
    expect(element).toBeInTheDocument();
  });

  it('test register button', () => {
    render(
      <BrowserRouter>
        <CustomerRegister />
      </BrowserRouter>
    );
    const element = screen.getByRole('button', { name: /register/i });
    expect(element).toBeInTheDocument();
  });

  it('test login link', () => {
    render(
      <BrowserRouter>
        <CustomerRegister />
      </BrowserRouter>
    );
    const element = screen.getByRole('link', { name: /login/i });
    expect(element).toBeInTheDocument();
  });
});