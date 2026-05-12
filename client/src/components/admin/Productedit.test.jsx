import { describe, it, expect, vi } from 'vitest';
import { screen, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import ProductEdit from './Productedit';

// mock axios so we don't make real API calls
vi.mock('axios');

// mock useParams to return a fake product id
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '101' }),
  };
});

// fake product data returned by the API
const fakeProduct = {
  name: 'Test Product',
  price: 10.99,
  stock: 5,
  picture_link: '',
};

describe('test component ProductEdit', () => {
  it('test name input is displayed', async () => {
    axios.get.mockResolvedValue({ data: fakeProduct });
    render(
      <BrowserRouter>
        <ProductEdit />
      </BrowserRouter>
    );
    const element = await screen.findByDisplayValue('Test Product');
    expect(element).toBeInTheDocument();
  });

  it('test price input is displayed', async () => {
    axios.get.mockResolvedValue({ data: fakeProduct });
    render(
      <BrowserRouter>
        <ProductEdit />
      </BrowserRouter>
    );
    const element = await screen.findByDisplayValue('10.99');
    expect(element).toBeInTheDocument();
  });

  it('test save changes button is displayed', async () => {
    axios.get.mockResolvedValue({ data: fakeProduct });
    render(
      <BrowserRouter>
        <ProductEdit />
      </BrowserRouter>
    );
    const element = await screen.findByRole('button', { name: /save changes/i });
    expect(element).toBeInTheDocument();
  });

  it('test cancel button is displayed', async () => {
    axios.get.mockResolvedValue({ data: fakeProduct });
    render(
      <BrowserRouter>
        <ProductEdit />
      </BrowserRouter>
    );
    const element = await screen.findByRole('button', { name: /cancel/i });
    expect(element).toBeInTheDocument();
  });
});