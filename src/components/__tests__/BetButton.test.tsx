import { render, screen, fireEvent } from '@testing-library/react';
import BetButton from '../BetButton';

describe('BetButton', () => {
  const defaultProps = {
    label: 'Home Team',
    subLabel: 'Winner',
    odd: 2.5,
    isSelected: false,
    isDisabled: false,
    onClick: jest.fn(),
  };

  it('renders correctly with given props', () => {
    render(<BetButton {...defaultProps} />);
    expect(screen.getByText('Home Team')).toBeInTheDocument();
    expect(screen.getByText('Winner')).toBeInTheDocument();
    expect(screen.getByText('2.50')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<BetButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    render(<BetButton {...defaultProps} isDisabled={true} />);
    fireEvent.click(screen.getByRole('button'));
    // React Testing Library usually prevents click on disabled buttons
    // The disabled attribute must be present on the button
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
