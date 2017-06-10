//音乐可视化

import React, {Component} from 'react';

class Canvas extends Component {
	
	componentDidMount(){
		this.props.mobx.getCanvas(this.refs.canvas)
	}
	
	render(){
		
		const styleCanvas = {
			width:"350px",
			height:"200px"
		}
		
		return (
			<div>
				<canvas ref="canvas" style={styleCanvas}/>
			</div>
		)
	}
}

export default Canvas;