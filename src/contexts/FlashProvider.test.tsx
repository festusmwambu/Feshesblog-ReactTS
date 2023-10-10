import { render, screen, act } from '@testing-library/react';
import React, { useEffect } from 'react';
import FlashProvider, { useFlashProviderContext } from './FlashProvider';
import FlashMessage from '../components/FlashMessage';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers()
});

test('flashes a message', () => {
  const Test = () => {
    const flash = useFlashProviderContext();
    useEffect(() => {
      flash('foo', 'danger');
    }, [flash]);
    return null;
  };
  
  render(
    <FlashProvider>
      <FlashMessage />
      <Test />
    </FlashProvider>
  );

  const alert = screen.getByRole('alert');

  expect(alert).toHaveTextContent('foo');
  expect(alert).toHaveClass('alert-danger');
  expect(alert).toHaveAttribute('data-visible', 'true');

  act(() => jest.runAllTimers());
  expect(alert).toHaveAttribute('data-visible', 'false');
});