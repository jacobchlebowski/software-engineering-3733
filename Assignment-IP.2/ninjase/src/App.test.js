import React from 'react';
import { render, screen } from '@testing-library/react';
import Model from './model/Model.js';

//default configuration to use
import { level1 } from './model/Configuration.js'
var actualConfiguration = JSON.parse(JSON.stringify(level1));  // parses string into JSON object, used below.


var model = new Model(actualConfiguration);
test('No moves when model created', () => {
    expect(model.numMoves).toBe(0)
});
