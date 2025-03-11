import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Leaflet map component to avoid issues in tests
jest.mock('./components/Map', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="map-component">Map Component Mock</div>
  };
});

test('renders the app header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Property Land Cover Analysis/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders the main app components', () => {
  render(<App />);
  // Check for description text
  expect(screen.getByText(/Draw a property boundary on the map and analyze land cover types/i)).toBeInTheDocument();
  
  // Check for map component
  expect(screen.getByTestId('map-component')).toBeInTheDocument();
  
  // Check for analyze button - using role to be more specific
  expect(screen.getByRole('button', { name: /Analyze Property/i })).toBeInTheDocument();
  
  // Check for footer info
  expect(screen.getByText(/This is a prototype application using open-source tools/i)).toBeInTheDocument();
});
