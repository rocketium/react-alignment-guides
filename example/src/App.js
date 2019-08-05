import React, { Component } from 'react'

import AlignmentGuides from 'react-alignment-guides';

// Dummy position data to generate the boxes
const POS_DATA = [
	{ x: 0, y: 0, width: 400, height: 200, top: 0, left: 0, metadata: { type: 'image' } },
	{ x: 650, y: 300, width: 300, height: 150, top: 550, left: 650, metadata: { type: 'caption' } },
	{ x: 300, y: 250, width: 150, height: 350, top: 250, left: 300, metadata: { type: 'caption' } }
];

export default class App extends Component {
	render () {
		return (
			<AlignmentGuides
				boxes={POS_DATA}
				boxStyle={{ backgroundColor: '#A8EEED' }}
				style={{ backgroundColor: '#333', width: '75%', height: '75%', top: '150px', left: '150px' }}
			/>
		)
	}
}
