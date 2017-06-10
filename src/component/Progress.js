//进度条，时间，列表展示，静音，重播等操作
import React, {Component} from 'react';
import {useStrict} from 'mobx';
//antd
import { Slider } from 'antd';

import Images from './Images';

import '../styles/Progress.scss';

//进度条实时更新，关闭mobx严格模式
useStrict(false);

class Progress extends Component {
	PlayStatus =()=> {
			this.props.mobx.playStatus()
		}
		
	VoiceControls =()=> {
		this.props.mobx.voiceControls()
	}
	
	ListControls =()=> {
		this.props.mobx.listControls()
	}
	
	render(){
		
		return (
			<div className="listContainer">
				<div className="slider">
					<div>{this.props.current}/{this.props.duration}</div>
					<div>
						<img src={Images.List} alt={Images.None} onClick={this.ListControls.bind(this)}/>
						<img src={Images.actionRound[this.props.status].type} alt={Images.actionRound[this.props.status].name}  onClick={this.PlayStatus.bind(this)}/>
						<img src={this.props.voice === true ? Images.Sound : Images.Usound } alt={Images.None} onClick={this.VoiceControls.bind(this)}/>
					</div>
				</div>
				<Slider className="Slider" value={this.props.progress} />
			</div>
		)
	}
}

export default Progress;