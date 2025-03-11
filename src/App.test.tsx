import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders the app header', () => {
  const { getByText } = render(<App />);
  const headerElement = getByText(/Property Land Cover Analysis/i);
  expect(headerElement).toBeInTheDocument();
});
