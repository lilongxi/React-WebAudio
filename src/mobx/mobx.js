//数据流整合，对view层进行操作
import {useStrict ,action, autorun} from 'mobx';

import store from './mobx_store';

useStrict(true);

class View {
	
//	--------------初始化各种所需文件----------------
	//获取数据
	@action initData(data){
		store.audio_todo = data;
	}
	
	//检查浏览器是否支持webaudio
	@action prepareAPI(){
		window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
		window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
		window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
		try {
			console.log('success!!!');
		} catch(e) {
			console.log(e);
		}
	}
	
	//对canvas进行初始化
	@action getCanvas(ctd){
		store.canvas_tag = ctd;
		let ctx = ctd.getContext('2d');
	    let line = ctx.createLinearGradient(0,0,0,ctd.height);
		let size = store.size;
		let Dots = store.Dots;
		line.addColorStop(0, "#404040");
		line.addColorStop(0.25, "#5a5a5a");
		line.addColorStop(0.5, "#919191");
		line.addColorStop(0.75, "#5a5a5a");
		line.addColorStop(1, "#404040");
		ctx.fillStyle = line;
		
		//循环产生小帽子
		for(let i=0; i < size; i++){
			Dots.push({
				cap:0
			})
		} 
	}
	
	@action webAudioInit(){
		//初始化音频控制和波形
		//createBufferSource创建audioBufferSourceNode对象
		//createAnalyser(), 创建AnalyserNode对象
		//createGain()/createGainNode 创建GainNode对象
		let audioContext = store.audioContext;
		store.GainNode = audioContext[audioContext.createGain ? "createGain" : "createGainNode"]();
		store.Analyser = audioContext.createAnalyser();
	}
	
	
//	--------------播放歌曲以及图像绘制----------------
	//webaudio解析歌曲
	@action getInit(url){
		
		//歌曲开始加载
		store.statusFlag = true;
		
		//清除定时器
		store.progressFlag !== null && clearInterval(store.progressFlag);
		
		//从store中获取定义好的数据
		let that = this,
			audioContext = store.audioContext,
			xhr = store.xhr,
			gainNode = store.GainNode,
			analyser = store.Analyser,
			currentBuffer = store.bufferSource;
		
		let count = 0;
			
		//链接gainNode,analyser
		analyser.fftSize = 512;
		gainNode.connect(audioContext.destination);
		analyser.connect(gainNode);
		
		let n = ++count;
		
		//列表中切换歌曲,先暂停当前曲目,判断bufferSource是否存在
		currentBuffer && currentBuffer[currentBuffer.stop ? 'stop' : 'noteOff']();
		
		//xhr请求歌曲
		xhr.abort();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function(){
			
			//修复快速点击会同时播放歌曲bug，当快速点击歌曲count会++，但是n是局部变量，在还没有执行load方法的时候不会变化
			if(n !== count ) return;
			
			//decodeAudioData异步解码，在fileResult内的数据
			audioContext.decodeAudioData(xhr.response, function(buffer){
				
				//歌曲开始播放
				store.statusFlag = false;
				
				//每次点击后新建bufferSource
				let bufferSource = audioContext.createBufferSource();
				bufferSource.buffer = buffer;
				bufferSource.connect(analyser);
				bufferSource[bufferSource.start? "start" : "noteOn"](audioContext.currentTime);
				
				//关闭单曲循环(默认也关闭)
				bufferSource.loop = store.loop;
				
				//当歌曲加载完毕后记录歌曲加载时间
				store.startTime = audioContext.currentTime;
				//记录歌曲总时间
				store.durationTime = buffer.duration;
				//记录buffer
				store.Buffer = buffer;
				//记录bufferSource
				store.bufferSource = bufferSource;
				
				//对analyser进行解码
				that.visualizer(analyser)
				
				//播放进度条(判断是否随机)
				that.getProgress();
				
				//计算歌曲总时间
				store.durationMM = that.timeConvert(buffer.duration);
				
				
			},function(err){
				
				console.log(err)
				
			})
		}
		//发送请求
		xhr.send();
		
	}
	
	
	//分析波形
	@action visualizer(analyser){
		
		let that = this;
		let analyserArr = new Uint8Array(analyser.frequencyBinCount);
		
		//歌曲开始时间从0开始,所以应该先减去加载时间
		
		requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
		function v(){
			analyser.getByteFrequencyData(analyserArr);
			//调用canvas绘图函数
			that.drawImage(analyserArr);	
			requestAnimationFrame(v);
		}
		requestAnimationFrame(v);
	}
	
	//计算进度条,判断歌曲播放完毕
	@action getProgress(){

		let audioContext = store.audioContext;
		let durationTime = store.durationTime;
		//减去加载歌曲时间
		let start;
		
		store.progressFlag = setInterval(()=>{
			start = audioContext.currentTime - store.startTime;
			//进度条计算
			store.currentProgress = parseFloat((( start / durationTime) * 100 ).toFixed(1));
			//自动播放下一曲,清除定时
			start > durationTime ? 
			(this.switchTrack(store.playStatus), clearInterval(arguments)) :
			store.currentMM = this.timeConvert(start);

		},300)
	}
	
	//根据playStatus判断是否随机播放(1),单曲(2),循环(0)
	
	@action switchTrack(status){
		
		switch(status){
			case 0:
				this.nextTrack();
				break;
			case 1:
				this.randomTrack();
				break;
			case 2:
				this.repeatTrack();
				break;
			default:
				this.nextTrack();
				return false;
		}
		
	}
	
	
	//计算歌曲时间
	@action timeConvert(timestamp){
		let minutes = Math.floor(timestamp / 60);
        let seconds = Math.floor(timestamp - (minutes * 60));

        if(seconds < 10){
        		seconds = '0' + seconds;
        }
        timestamp = minutes + ':' + seconds;
        return timestamp;
	}
	
	//canvas绘制可视化图像
	@action drawImage(analyserArr){
		
		let canvas = store.canvas_tag;
		let	ctx = canvas.getContext('2d');
		let	size = store.size;
		let	w = canvas.width / size;
		let	cw = w * .75;
		let capH = cw;
		let Dots = store.Dots;
		
		
		ctx.clearRect(0,0, canvas.width, canvas.height);
	
		for (let i=0; i<size; i++) {
			
			let h = analyserArr[i] / 300 * canvas.height;
			ctx.fillRect(w*i, canvas.height-h, cw, h)
			
			ctx.fillRect(w*i, canvas.height-(Dots[i].cap + capH), cw, capH);
			
			//纵坐标递减
			Dots[i].cap--;
			if(Dots[i].cap < 0){
				Dots[i].cap = 0
			}
			if(Dots[i].cap < h+10 && h>0){
				Dots[i].cap = h + 10 > canvas.height - capH ?  canvas.height - capH : h + 10;
			}
		}
		
	}
	
	
//	--------------歌曲操作功能实现----------------
	
	//点击列表播放对应歌曲
	@action soucreCreate(url, index){
		//每次改变歌曲前记录当前歌曲的index
		store.currentIndex = index;
		
		//调用webaudio方法,开始播放
		this.getInit(url);
		
		//改变flag
		store.flag = true;
		
	}
	
	
	@action getFirstTrack(){
		store.currentIndex = 0;	
		setTimeout(()=>{
			this.getInit(store.audio_todo[0].url);
		},1000)
	}
	
	
//	控制歌曲开始播放
	@action controls(controls){
		let audioContext = store.audioContext;
		let gainNode = store.GainNode;
		
		if(store.flag === false){
			gainNode.connect(audioContext.destination);
			this.getProgress();
		}else{
			//暂停播放
			clearInterval(store.progressFlag);
			gainNode.disconnect(audioContext.destination);
		}
	
		store.flag = !store.flag;
	}
	
	//上一曲
	@action prevTrack(){
		
		let audio_todo = store.audio_todo;
		let currentTrackIndex = store.currentIndex;
		
		if(currentTrackIndex < 0)return;
		
		//如果点击了随机播放,执行随机函数
		if(store.playStatus === 1){
			let random = this.random(0, audio_todo.length - 1)
			this.getInit(audio_todo[random].url);
			store.currentIndex = random;
		}else{
			currentTrackIndex !== 0 ? 
			(this.getInit(audio_todo[--currentTrackIndex].url), store.currentIndex = currentTrackIndex) :
			(this.getInit(audio_todo[audio_todo.length-1].url), store.currentIndex = audio_todo.length-1);
		}
	}
	
	//下一曲
	@action nextTrack(){
		
		let audio_todo = store.audio_todo;
		let currentTrackIndex = store.currentIndex;
		
		if(currentTrackIndex < 0)return;
		
		//如果点击了随机播放,执行随机函数
		if(store.playStatus === 1){
			let random = this.random(0, audio_todo.length - 1)
			this.getInit(audio_todo[random].url);
			store.currentIndex = random;
		}else{
			currentTrackIndex !== audio_todo.length-1 ? 
			(this.getInit(audio_todo[++currentTrackIndex].url), store.currentIndex = currentTrackIndex) :
			(this.getInit(audio_todo[0].url), store.currentIndex = 0);
		}
	}
	
	//生成随机数
	@action random(min,max){
		return parseInt(Math.random() * (max - min + 1) + min);
	}
	
	//随机播放歌曲方法
	@action randomTrack(){
		
		let audio_todo = store.audio_todo;
		
		let randomTrackIndex = this.random(0, audio_todo.length - 1);
		store.currentIndex = randomTrackIndex;
		this.getInit(audio_todo[randomTrackIndex].url);
	}
	
	//单曲播放
	@action repeatTrack(){
		let audio_todo = store.audio_todo;
		let currentTrackIndex = store.currentIndex;
		
		this.getInit(audio_todo[currentTrackIndex].url);
		
	}
	
	//点击图标改变歌曲播放状态,随机(1),单曲(2),循环(0)
	@action playStatus(){
		let status = store.playStatus
		status < 2 ? ++store.playStatus : store.playStatus = 0;
	}
	
	//静音
	@action voiceControls(){
		let gainNode = store.GainNode;
		store.voiceStatus === true ? gainNode.gain.value = 0 : gainNode.gain.value = 1;
		store.voiceStatus = !store.voiceStatus;
	}
	
	//控制列表
	@action listControls(){
		store.listStatus = !store.listStatus;
	}
	
}

const view = new View();

autorun(() => view.webAudioInit()) && autorun(() => view.prepareAPI()) && autorun(() => view.getFirstTrack())

export default view;
