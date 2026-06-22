import { render, screen } from '@testing-library/react';
import EventCard from '../EventCard';
import type { Match } from '@/lib/types';

const mockMatch: Match = {
  id: 'match-1',
  league: { id: 'l1', name: 'La Liga' },
  homeTeam: { id: 't1', name: 'Real Madrid', shortName: 'RMA' },
  awayTeam: { id: 't2', name: 'Barcelona', shortName: 'BAR' },
  startTime: '2026-06-22T20:00:00Z',
  market: {
    odds: { home: 1.5, draw: 3.0, away: 4.5 }
  }
};

describe('EventCard', () => {
  it('renders match details correctly', () => {
    render(<EventCard match={mockMatch} />);
    expect(screen.getByText('La Liga')).toBeInTheDocument();
    expect(screen.getByText('Real Madrid')).toBeInTheDocument();
    expect(screen.getAllByText('RMA').length).toBeGreaterThan(0);
    expect(screen.getByText('Barcelona')).toBeInTheDocument();
    expect(screen.getAllByText('BAR').length).toBeGreaterThan(0);
  });

  it('renders correctly when a pick is already placed', () => {
    render(<EventCard match={mockMatch} userPick="HOME" />);
    // "betPlacedBanner" translation should be present
    expect(screen.getByText('betPlacedBanner')).toBeInTheDocument();
  });
});
