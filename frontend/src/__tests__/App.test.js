import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders learn react link', () => {
  let app = render(<App />);
  const linkElement = screen.getByText(/MyMovies/i);
  expect(linkElement).toBeInTheDocument();
});
