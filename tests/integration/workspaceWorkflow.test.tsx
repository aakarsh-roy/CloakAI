import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../../src/app/App.tsx';

describe('Workspace User Workflow Integration', () => {
  it('renders the workspace with empty initial state', () => {
    render(<App />);
    expect(screen.getByText('Privacy Redaction Workspace')).toBeInTheDocument();
    expect(screen.getByText('Prompt Editor')).toBeInTheDocument();
    expect(screen.getByText('No findings detected')).toBeInTheDocument();
  });

  it('detects sensitive entities when prompt is entered and displays masked findings', async () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/Paste or write your prompt here/i);

    fireEvent.change(textarea, {
      target: {
        value: 'Contact alice@example.com for secret key AKIAIOSFODNN7EXAMPLE today.',
      },
    });

    // Wait for debounced detection to execute
    await waitFor(() => {
      expect(screen.getByText(/Critical Credentials Detected/i)).toBeInTheDocument();
    });

    // Verify entities are detected (getAllByText handles multiple matching text elements)
    expect(screen.getAllByText(/Email Address/i).length).toBeGreaterThan(0);
    expect(screen.getByText('AWS Access Key ID')).toBeInTheDocument();

    // Verify values are masked by default
    expect(screen.getByText('al•••@example.com')).toBeInTheDocument();
  });

  it('allows revealing masked sensitive values on explicit click', async () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/Paste or write your prompt here/i);

    fireEvent.change(textarea, {
      target: { value: 'My email is bob@domain.com' },
    });

    await waitFor(() => {
      expect(screen.getByText('bo•••@domain.com')).toBeInTheDocument();
    });

    const revealButtons = screen.getAllByLabelText(/Toggle value visibility/i);
    fireEvent.click(revealButtons[0]);

    expect(screen.getByText('bob@domain.com')).toBeInTheDocument();
  });

  it('navigates cleanly between Workspace, Settings, and Privacy pages', () => {
    render(<App />);

    // Click Settings
    const settingsButton = screen.getByRole('button', { name: /^Settings$/i });
    fireEvent.click(settingsButton);
    expect(screen.getByText(/Privacy & Detection Preferences/i)).toBeInTheDocument();

    // Click Privacy
    const privacyButton = screen.getByRole('button', { name: /Privacy & Specs/i });
    fireEvent.click(privacyButton);
    expect(screen.getByText(/How CloakAI Protects Your Privacy/i)).toBeInTheDocument();

    // Back to Workspace using header button
    const workspaceButton = screen.getByRole('button', { name: /^Workspace$/i });
    fireEvent.click(workspaceButton);
    expect(screen.getByText(/Privacy Redaction Workspace/i)).toBeInTheDocument();
  });
});
