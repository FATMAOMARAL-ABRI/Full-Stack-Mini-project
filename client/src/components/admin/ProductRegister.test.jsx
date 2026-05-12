import { describe, it, expect } from 'vitest';
import { screen, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductRegister from './ProductRegister';

describe('test component ProductRegister', () => {
  it('test product id input', () => {
    render(
      <BrowserRouter>
        <ProductRegister />
      </BrowserRouter>
    );
    const element = screen.getByPlaceholderText('e.g., 101');
    expect(element).toBeInTheDocument();
  });

  it('test name input', () => {
    render(
      <BrowserRouter>
        <ProductRegister />
      </BrowserRouter>
    );
    const element = screen.getByPlaceholderText('Product name');
    expect(element).toBeInTheDocument();
  });

  it('test price input', () => {
    render(
      <BrowserRouter>
        <ProductRegister />
      </BrowserRouter>
    );
    const element = screen.getByPlaceholderText('0.00');
    expect(element).toBeInTheDocument();
  });

  it('test stock input', () => {
    render(
      <BrowserRouter>
        <ProductRegister />
      </BrowserRouter>
    );
    const element = screen.getByPlaceholderText('0');
    expect(element).toBeInTheDocument();
  });

  it('test file upload input', () => {
    render(
      <BrowserRouter>
        <ProductRegister />
      </BrowserRouter>
    );
    const element = screen.getByPlaceholderText('Choose an image file');
    expect(element).toBeInTheDocument();
  });

  it('test add product button', () => {
    render(
      <BrowserRouter>
        <ProductRegister />
      </BrowserRouter>
    );
    const element = screen.getByRole('button', { name: /add product/i });
    expect(element).toBeInTheDocument();
  });

  it('test cancel button', () => {
    render(
      <BrowserRouter>
        <ProductRegister />
      </BrowserRouter>
    );
    const element = screen.getByRole('button', { name: /cancel/i });
    expect(element).toBeInTheDocument();
  });
});