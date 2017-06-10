
import Play from '../images/开始.png';
import Pause from '../images/开始_1.png';
import Arrow from '../images/向左.png';
import List from '../images/列表.png';
import Random from '../images/随机播放.png';
import Once from '../images/单曲循环.png';
import Sound from '../images/声音.png';
import Circle from '../images/循环.png';
import Usound from '../images/静音.png';
import Load from '../images/加载.png';

const Images = {
	None:'图片走丢了',
	action:[
		{name:'播放', type: Pause},
		{name:'暂停', type: Play}
	],
	Pause,
	Play,
	Sound,
	Usound,
	Arrow,
	List,
	Load,
	actionRound:[
		{name:"列表循环", type: Circle},
		{name:"随机播放", type: Random},
		{name:"单曲循环", type: Once}
	]
}

export default Images