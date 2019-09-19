import React, { Component } from 'react'

import AlignmentGuides from 'react-alignment-guides';

// Dummy position data to generate the boxes
const POS_DATA = [
	{ x: 300, y: 200, width: 400, height: 200, top: 200, left: 300, zIndex: 9, metadata: { type: 'image' } },
	// { x: 650, y: 300, width: 300, height: 150, top: 550, left: 650, zIndex: 10, metadata: { type: 'text' } },
	// { x: 300, y: 250, width: 150, height: 350, top: 250, left: 300, zIndex: 10, metadata: { type: 'text' } }
];

export default class App extends Component {
	render () {
		return (
			<AlignmentGuides
				boxes={POS_DATA}
				boxStyle={{ backgroundColor: '#A8EEED' }}
				style={{ backgroundColor: '#333', width: '1280px', height: '720px', top: '150px', left: '150px' }}
			/>
		)
	}
}
