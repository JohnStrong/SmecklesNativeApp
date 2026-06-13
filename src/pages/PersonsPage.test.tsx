  import { render, screen, fireEvent } from '@testing-library/react';
  import { describe, it, expect } from 'vitest';
  import PersonsPage from './PersonsPage';

  describe('PersonsPage', () => {

    it('shows "New here?" when no persons exist', () => {
        render(<PersonsPage />);

        expect(screen.getByText("New here?")).toBeInTheDocument();
        expect(screen.getByText("Add")).toBeInTheDocument();
    });

    it('adds a person and shows the list view', () => {
        render(<PersonsPage />);
        
        _fireAddPersonEvent('john@test.com');

        expect(screen.getByText('john@test.com')).toBeInTheDocument();
        expect(screen.queryByText('New here?')).not.toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
        expect(screen.getByText("Add")).toBeInTheDocument();
    });

    it('removes a person and shows "New here?" if persons is empty', () => {
        render(<PersonsPage />)
        _fireAddPersonEvent('john@test.com');
        expect(screen.queryByText("New here?")).not.toBeInTheDocument();

        _fireRemovePersonEvent('john@test.com');

        expect(screen.getByText("New here?")).toBeInTheDocument();
        expect(screen.getByText("Add")).toBeInTheDocument();
    })

    it('removes a person and shows remaining persons if > 0 persons', () => {
        render(<PersonsPage />)
        _fireAddPersonEvent('john@test.com');
        _fireAddPersonEvent('paul@test.com');

        _fireRemovePersonEvent('john@test.com');

        expect(screen.queryByText("New here?")).not.toBeInTheDocument();
        expect(screen.queryByText("paul@test.com")).toBeInTheDocument();
        expect(screen.getByText("Add")).toBeInTheDocument();
    });

    it('shows error when adding empty email in empty state', () => {
        render(<PersonsPage />);

        fireEvent.click(screen.getByText('Add'));

        expect(screen.getByText('cannot be empty - Please enter a valid email address')).toBeInTheDocument();
        expect(screen.getByText('New here?')).toBeInTheDocument();
    });

    it('shows error when adding invalid email in empty state', () => {
        render(<PersonsPage />);
        const input = screen.getByPlaceholderText('Enter your email');
        fireEvent(input, new CustomEvent('ionInput', { detail: { value: 'notanemail' } }));

        fireEvent.click(screen.getByText('Add'));

        expect(screen.getByText('invalid pattern - Please enter a valid email address')).toBeInTheDocument();
    });

    it('does not add person when email is invalid', () => {
        render(<PersonsPage />);
        const input = screen.getByPlaceholderText('Enter your email');
        fireEvent(input, new CustomEvent('ionInput', { detail: { value: 'bad@' } }));

        fireEvent.click(screen.getByText('Add'));

        expect(screen.queryByText('bad@')).not.toBeInTheDocument();
        expect(screen.getByText('New here?')).toBeInTheDocument();
    });

    it('clears error after entering a valid email and adding', () => {
        render(<PersonsPage />);
        const input = screen.getByPlaceholderText('Enter your email');
        fireEvent(input, new CustomEvent('ionInput', { detail: { value: 'bad' } }));
        fireEvent.click(screen.getByText('Add'));
        expect(screen.getByText('invalid pattern - Please enter a valid email address')).toBeInTheDocument();

        fireEvent(input, new CustomEvent('ionInput', { detail: { value: 'good@example.com' } }));
        fireEvent.click(screen.getByText('Add'));

        expect(screen.queryByText('invalid pattern - Please enter a valid email address')).not.toBeInTheDocument();
        expect(screen.getByText('good@example.com')).toBeInTheDocument();
    });

    it('shows error when adding invalid email in list state', () => {
        render(<PersonsPage />);
        _fireAddPersonEvent('first@test.com');

        const input = screen.getByPlaceholderText('Enter your email');
        fireEvent(input, new CustomEvent('ionInput', { detail: { value: 'invalid' } }));
        fireEvent.click(screen.getAllByText('Add')[0]);

        expect(screen.getByText('invalid pattern - Please enter a valid email address')).toBeInTheDocument();
    });

    it('shows error when adding duplicate email', () => {
        render(<PersonsPage />);
        _fireAddPersonEvent('john@test.com');
        expect(screen.queryByText('email already exists')).not.toBeInTheDocument();

        _fireAddPersonEvent('john@test.com');

        expect(screen.getByText('email already exists')).toBeInTheDocument();
        expect(screen.getAllByText('john@test.com')).toHaveLength(1);
    });

    const _fireAddPersonEvent = (email: string) => {
        const input = screen.getByPlaceholderText('Enter your email');
        fireEvent(input, new CustomEvent('ionInput', { detail: { value: email } }));
        fireEvent.click(screen.getByText('Add'));
    };

    const _fireRemovePersonEvent = (email: string) => {
        const label = screen.getByText(email);
        const listItem = label.closest('ion-item');
        const removeBtn = listItem?.querySelector('ion-button')!;
        fireEvent.click(removeBtn);
    }
  });
