import React from 'react';
import { render, screen } from '@testing-library/react';
import GithubRepos from './GithubRepos';

test('renders GithubRepos component', () => {
    render(<GithubRepos />);
    const linkElement = screen.getByText(/Github Repositories/i);
    expect(linkElement).toBeInTheDocument();
});