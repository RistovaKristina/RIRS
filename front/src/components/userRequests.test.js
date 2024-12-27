import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserRequests from '../components/UserRequests';
import { approveRequest, declineRequest } from '../services/api';

jest.mock('../services/api', () => ({
    approveRequest: jest.fn(),
    declineRequest: jest.fn(),
}));

describe('UserRequests Component', () => {
    const mockUsersRequests = [
        {
            _id: '1',
            user: { name: 'John Doe' },
            date: '2024-12-17T00:00:00Z',
            amount: 150,
            description: 'Business lunch expenses',
        },
        {
            _id: '2',
            user: { name: 'Jane Smith' },
            date: '2024-12-16T00:00:00Z',
            amount: 200,
            description: 'Hotel booking',
        },
    ];

    test('renders user requests correctly', () => {
        render(<UserRequests usersRequests={mockUsersRequests} />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('150€')).toBeInTheDocument();
        expect(screen.getByText('200€')).toBeInTheDocument();
    });

    test('handles approve button click', () => {
        render(<UserRequests usersRequests={mockUsersRequests} />);
        const approveButton = screen.getAllByText('Approve')[0];
        fireEvent.click(approveButton);
        expect(approveRequest).toHaveBeenCalledWith('1');
    });

    test('handles decline button click', () => {
        render(<UserRequests usersRequests={mockUsersRequests} />);
        const declineButton = screen.getAllByText('Decline')[0];
        fireEvent.click(declineButton);
        expect(declineRequest).toHaveBeenCalledWith('1');
    });

    test('renders category dropdown and allows selection', () => {
        render(<UserRequests usersRequests={mockUsersRequests} />);
        const dropdowns = screen.getAllByRole('combobox').filter((dropdown) =>
            dropdown.textContent.includes('Select Category')
        );
        expect(dropdowns).toHaveLength(mockUsersRequests.length);
        fireEvent.mouseDown(dropdowns[0]); // Open the dropdown
        const travelOption = screen.getByText('Travel');
        fireEvent.click(travelOption);
        expect(dropdowns[0]).toHaveTextContent('Travel');
    });

    test('approve buttons are accessible for all rows', () => {
        render(<UserRequests usersRequests={mockUsersRequests} />);
        const approveButtons = screen.getAllByText('Approve');
        approveButtons.forEach((button) => {
            expect(button).toBeEnabled();
            expect(button).toHaveAttribute('type', 'submit');
        });
    });

    test('decline buttons are accessible for all rows', () => {
        render(<UserRequests usersRequests={mockUsersRequests} />);
        const declineButtons = screen.getAllByText('Decline');
        declineButtons.forEach((button) => {
            expect(button).toBeEnabled();
            expect(button).toHaveAttribute('type', 'submit');
        });
    });
});
