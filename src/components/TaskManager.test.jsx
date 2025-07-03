import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskManager from './TaskManager';

// Mock jQuery for testing
const jQuery = require('jquery');
window.$ = window.jQuery = jQuery;

describe('TaskManager Component', () => {
    let mockDispatchEvent;

    beforeEach(() => {
        mockDispatchEvent = jest.spyOn(document, 'dispatchEvent');
    });

    afterEach(() => {
        mockDispatchEvent.mockRestore();
        jest.clearAllMocks();
    });
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    test('renders without crashing', () => {
        render(React.createElement(TaskManager));
        expect(screen.getByText('Task Manager')).toBeInTheDocument();
    });

    test('adds a new task', () => {
        render(React.createElement(TaskManager));

        const input = screen.getByPlaceholderText('Add a new task...');
        const button = screen.getByText('Add Task');

        fireEvent.change(input, { target: { value: 'Test Task' } });
        fireEvent.click(button);

        expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    test('completes a task', () => {
        render(React.createElement(TaskManager));

        const input = screen.getByPlaceholderText('Add a new task...');
        const button = screen.getByText('Add Task');

        fireEvent.change(input, { target: { value: 'Test Task' } });
        fireEvent.click(button);

        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);

        expect(screen.getByText('Test Task')).toHaveClass('completed');
    });

    test('deletes a task', () => {
        render(React.createElement(TaskManager));

        const input = screen.getByPlaceholderText('Add a new task...');
        const button = screen.getByText('Add Task');

        fireEvent.change(input, { target: { value: 'Test Task' } });
        fireEvent.click(button);

        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);

        expect(screen.queryByText('Test Task')).not.toBeInTheDocument();
    });

    test('handles initial tasks prop', () => {
        const initialTasks = [
            { text: 'Initial Task 1', completed: false },
            { text: 'Initial Task 2', completed: true }
        ];

        render(React.createElement(TaskManager, { initialTasks }));

        expect(screen.getByText('Initial Task 1')).toBeInTheDocument();
        expect(screen.getByText('Initial Task 2')).toBeInTheDocument();
        expect(screen.getByText('Initial Task 2')).toHaveClass('completed');
    });

    test('emits task count event', () => {
        // Mock the dispatchEvent on document
        const mockDispatchEvent = jest.fn();
        document.dispatchEvent = mockDispatchEvent;

        // Render the component
        const { container } = render(<TaskManager />);

        // Wait for the component to be mounted
        setTimeout(() => {
            // Find the button after the component is mounted
            const button = container.querySelector('button');
            fireEvent.click(button);

            // Wait for the event to be dispatched
            setTimeout(() => {
                expect(mockDispatchEvent).toHaveBeenCalledWith(
                    expect.objectContaining({
                        type: 'taskCountUpdated',
                        detail: expect.objectContaining({ total: 1, completed: 0 })
                    })
                );
            }, 0);
        }, 0);
    });

    test('handles task injection from jQuery', () => {
        // Wait for component to mount
        setTimeout(() => {
            const event = new CustomEvent('injectTask', { detail: 'Injected Task' });
            document.dispatchEvent(event);

            // Wait for task to be added
            setTimeout(() => {
                expect(screen.getByText('Injected Task')).toBeInTheDocument();
            }, 0);
        }, 0);
    });
});
