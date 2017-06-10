//开始播放暂停下上曲
import React, {Component} from 'react';

import Images from './Images';
import '../styles/Controls.scss';

class Controls extends Component {
	
	Controls =()=> {
		this.props.mobx.controls(this.refs.controls)
	}
	
	PrevTrack =()=> {
		this.props.mobx.prevTrack()
	}
	
	NextTrack =()=> {
		this.props.mobx.nextTrack()
	}
	
	load =()=> {
		alert('暂未选择播放歌曲！')
	}
	
	render(){
		
		return (
			<div className="Controls">
				 <img src={Images.Arrow} className="Prev" alt={Images.None}  onClick={this.PrevTrack.bind(this)}/>
				 {
				 	this.props.store.statusFlag === true ? 
				 	<img src={Images.Load} alt={Images.None} className="Loading" onClick={this.load.bind(this)} /> : 
				 	<img src={this.props.store.flag === true ? Images.Play : Images.Pause} className="Play" alt={Images.None} onClick={this.Controls.bind(this)} ref="controls" />
				 }
				 <img src={Images.Arrow} className="Next" alt={Images.None}  onClick={this.NextTrack.bind(this)}/>
			</div>
		)
	}
}

export default Controls;