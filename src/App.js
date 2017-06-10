import React, {Component} from 'react';

//mobx观察
import {observer} from 'mobx-react';
//数据操作
import mobx from './mobx/mobx';
//数据渲染
import store from './mobx/mobx_store';
//http
import Request from './http/request';

//加载组件
import TrackList from './component/TrackList'
import Controls from './component/Controls'
import Progress from './component/Progress'
import Canvas from './component/Canvas'

import './App.scss';
//antd
import 'antd/dist/antd.less';

@observer
class App extends Component {
  componentWillMount(){
  	Request('get', 'http://localhost:8080/data')
			 .then(function(res){
			 	mobx.initData(res.data.content);
			})
			 .catch(function(err){
				console.log(err);
			});
  }
  render() {
    return (
      <div className="App">
      		<TrackList mobx={mobx} index={store.currentIndex} list={store.listStatus} store={store.audio_todo}/>
      		<Controls mobx={mobx} store={store} />
      		<Progress mobx={mobx} voice={store.voiceStatus} progress={store.currentProgress} duration={store.durationMM} current={store.currentMM} status={store.playStatus}/>
      		<Canvas mobx={mobx} />
      </div>
    )
  }
}

export default App;


