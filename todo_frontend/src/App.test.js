import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Todo Manager brand', () => {
  render(<App />);
  const brand = screen.getByText(/Todo Manager/i);
  expect(brand).toBeInTheDocument();
});

test('has Add button', () => {
  render(<App />);
  const addBtn = screen.getByRole('button', { name: /add todo|add/i });
  expect(addBtn).toBeInTheDocument();
});
