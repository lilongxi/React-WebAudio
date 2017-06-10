//歌曲列表页
import React, {Component} from 'react';
//mobx观察
//import {observer} from 'mobx-react';

import '../styles/TrackList.scss';

//@observer
class TrackList extends Component {
	
	SoucreCreate =(url, index)=> {
		this.props.mobx.soucreCreate(url, index);
	}
	
	render(){
		return (
			<div className={this.props.list === true ? "TrackListShow" : "TrackListHidden"} >
			  <ol>
				 {this.props.store.map((item, index) => <li className="playing" key={index} onClick={this.SoucreCreate.bind(this, item.url, index)}><span className={this.props.index === index && "current"}>{item.name}</span></li>)}
			  </ol>
			</div>
		)
	}
}

export default TrackList;