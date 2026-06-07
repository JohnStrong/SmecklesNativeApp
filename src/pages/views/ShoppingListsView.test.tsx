import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ShoppingListsView from './ShoppingListsView';

const renderWithRouter = (name: string) => {
  render(
    <MemoryRouter initialEntries={[`/person/${name}/shopping-lists`]}>
      <Route path="/person/:name/shopping-lists" component={ShoppingListsView} />
    </MemoryRouter>
  );
};

describe('ShoppingListsView', () => {
  it('renders the breadcrumb with Persons link', () => {
    renderWithRouter('Alice');
    expect(screen.getByText('Persons')).toBeInTheDocument();
  });

  it('renders the person name in breadcrumb', () => {
    renderWithRouter('Alice');
    expect(screen.getByText(/Expenses \(Alice\)/)).toBeInTheDocument();
  });

  it('renders Shopping Lists as current breadcrumb', () => {
    renderWithRouter('Alice');
    expect(screen.getByText('Shopping Lists')).toBeInTheDocument();
  });

  it('shows empty state message', () => {
    renderWithRouter('Alice');
    expect(screen.getByText('No shopping lists yet.')).toBeInTheDocument();
  });

  it('renders the Smeckles header', () => {
    renderWithRouter('Bob');
    expect(screen.getByText('Smeckles')).toBeInTheDocument();
  });
});
