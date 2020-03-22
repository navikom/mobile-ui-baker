import React from "react";
import { cleanup, render } from "@testing-library/react";
import EditorContext from "views/Editor/EditorContext";
import '@testing-library/jest-dom';

describe('EditorContext.js', () => {
  afterEach(cleanup);
  let editor;

  it('Control rendered', () => {
    editor = render(<EditorContext />);
    const controls = editor.getAllByTestId('control');
    expect(controls.length).toBe(1);
  });

});
