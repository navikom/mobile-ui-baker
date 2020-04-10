import React from "react";
import '@testing-library/jest-dom';
import { cleanup, render } from "@testing-library/react";
import EditorView from "./EditorView";

describe('EditorContext.js', () => {
  afterEach(cleanup);
  let editor;

  it('Control rendered', () => {
    editor = render(<EditorView />);
    const controls = editor.getAllByTestId('control');
    expect(controls.length).toBe(2);
  });

});
