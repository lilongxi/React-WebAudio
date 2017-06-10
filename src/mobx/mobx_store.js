//放置数据流，对view层进行渲染
import {observable, useStrict} from 'mobx';

useStrict(true);

class Store {
	//定义歌曲列表
	@observable audio_todo = [];
	//记录当前播放歌曲的index
	@observable currentIndex = -1;
	//定义webAudio实例
	@observable audioContext = new (window.AudioContext || window.webkitAudioContext)();
	//XMLHttpRequest实例,用于webaudio获取歌曲
	@observable xhr = new XMLHttpRequest();
	//歌曲buffer
	@observable Buffer = null;
	//gainNode控制音量
	@observable GainNode = null;
	//analyser用于波形分析
	@observable Analyser = null;
	//歌曲当前播放时间
	@observable currentTime = null;
	//webaudio开始加载歌曲时间
	@observable startTime = null;
	//设置歌曲暂停时的时间
	@observable stopTime = null;
	
	//用于记录时间差
	@observable stoping = null;
	@observable starting = null;
	
	//歌曲总时间
	@observable durationTime = null;
	//bufferSource
	@observable bufferSource = null;
	//存放canvas标签
	@observable canvas_tag = null;
	//绘制音频条数
	@observable size = 75;
	//存放小帽子
	@observable Dots = [];
	//设置播放暂停的flag,true播放;
	@observable flag = true;
	//定义歌曲当前进度
	@observable currentProgress = 0;
	//定义歌曲加载时间flag
	@observable statusFlag = true;
	//进度条flag
	@observable progressFlag = null;
	//时分秒,歌曲总时间
	@observable durationMM = '0:00';
	//时分秒,播放时间
	@observable currentMM = '0:00';
	//点击图标改变歌曲播放状态,随机,单曲,循环flag
	@observable playStatus = 0;
	//音量切换,true代表开启声音,false静音
	@observable voiceStatus = true;
	//控制列表的显示隐藏,true显示
	@observable listStatus = true;
	
}

const store = new Store();
export default store;
