import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import BudgetingPage from './BudgetingPage';

const renderWithRouter = (name: string) => {
  render(
    <MemoryRouter initialEntries={[`/person/${name}`]}>
      <Route path="/person/:name" component={BudgetingPage} />
    </MemoryRouter>
  );
};

describe('BudgetingPage', () => {
  it('renders the side-nav with Persons link', () => {
    renderWithRouter('Alice');
    const items = screen.getAllByText('Persons');
    expect(items.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Expenses heading in side-nav', () => {
    renderWithRouter('Alice');
    expect(screen.getByText('Expenses')).toBeInTheDocument();
  });

  it('renders Shopping Lists category in side-nav', () => {
    renderWithRouter('Alice');
    const items = screen.getAllByText('Shopping Lists');
    expect(items.length).toBeGreaterThanOrEqual(1);
  });
});
