  import { render, screen, fireEvent } from '@testing-library/react';
  import { describe, it, expect } from 'vitest';
  import PersonsPage from './PersonsPage';

  describe('PersonsPage', () => {

    it('shows "Who are you?" when no persons exist', () => {
        render(<PersonsPage />);

        expect(screen.getByText("Who are you?")).toBeInTheDocument();
        expect(screen.getByText("Add")).toBeInTheDocument();
    });

    it('adds a person and shows the list view', () => {
        render(<PersonsPage />);
        
        _fireAddPersonEvent('John');

        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.queryByText('Who are you?')).not.toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
        expect(screen.getByText("Add")).toBeInTheDocument();
    });

    it('removes a person and shows "Who are you?" if persons is empty ', () => {
        render(<PersonsPage />)
        _fireAddPersonEvent('John');
        expect(screen.queryByText("Who are you?")).not.toBeInTheDocument();

        _fireRemovePersonEvent('John');

        expect(screen.getByText("Who are you?")).toBeInTheDocument();
        expect(screen.getByText("Add")).toBeInTheDocument();
    })

    it('removes a person and shows remaining persons if > 0 persons', () => {
        render(<PersonsPage />)
        const names: string[] = ['John', 'Paul'];
        names.forEach((item, _) => _fireAddPersonEvent(item));

        _fireRemovePersonEvent('John'); // remove only one

        expect(screen.queryByText("Who are you?")).not.toBeInTheDocument();
        expect(screen.queryByText("Paul")).toBeInTheDocument();
        expect(screen.getByText("Add")).toBeInTheDocument();
    });

    const _fireAddPersonEvent = (name: string) => {
        const input = screen.getByPlaceholderText('Enter your name');
        fireEvent(input, new CustomEvent('ionInput', { detail: { value: name } }));
        fireEvent.click(screen.getByText('Add'));
    };

    const _fireRemovePersonEvent = (name: string) => {
        const label = screen.getByText(name);
        const listItem = label.closest('ion-item');
        const removeBtn = listItem?.querySelector('ion-button')!;
        fireEvent.click(removeBtn);
    }
  });
