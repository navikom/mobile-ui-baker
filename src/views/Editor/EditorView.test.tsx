import React from 'react';
import '@testing-library/jest-dom';
import { RouteComponentProps } from 'react-router';
import { MemoryRouter } from 'react-router-dom';
import { cleanup, render } from '@testing-library/react';
import EditorView from './EditorView';

describe('EditorContext.js', () => {
  afterEach(cleanup);
  let editor;

  it('Control rendered', () => {
    const props = {
      history: { location: { pathname: '' } },
      location: { search: '' }
    } as RouteComponentProps;
    editor = render(<MemoryRouter><EditorView {...props} /></MemoryRouter>);
    const controls = editor.getAllByTestId('control');
    expect(controls.length).toBe(1);
  });

});
