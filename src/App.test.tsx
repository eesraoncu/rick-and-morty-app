import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders Rick and Morty title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Rick and Morty Karakterleri/i);
    expect(titleElement).toBeInTheDocument();
  });
});
