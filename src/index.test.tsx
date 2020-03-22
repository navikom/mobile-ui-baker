import React from 'react';
import { MemoryRouter } from 'react-router';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App', () => {
  afterEach(cleanup);
  let app;

  it('App rendered', () => {
    app = render(<MemoryRouter><App/></MemoryRouter>);
    expect(app.container).toBeInTheDocument();
  })
});
