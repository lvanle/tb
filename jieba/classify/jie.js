/** 接口文档说明
 *  TODO:
 *  - [] 文本输入：   json文本 -> 分词
 *  - [] 切词：      句子 -> 单词
 *  - [] 筛选情感词： 通过自定义情感词库 -> 筛选出情感词
 */ 

const nodejieba = require("nodejieba");
const dict = require('../tmp/positive_dic');
// let sentence = `挺好的一次购物，比较满意，先带两天，看看准确度咋样，五星好评，习惯。`;
// let str = sentence.replace(/[\ |\~|\，|\。|\（|\）|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\d|(A-Z)|(a-z)|\《|\》|\—|\￥|\(…)|\！]/g, "");
// let res = jieba.cut(str);
// console.log(res);
var sentence = `开机不足十秒（小视频只能拍8秒，很遗憾就差两秒）性能比想象中的要好一些，我不玩游戏只办公基本听不见风扇的声音。偶尔五一放假打一下DNF很流畅，比想象中的流畅很多。键盘手感很好，不会出现手指粗大点错的情况，屏幕调节亮度的快捷键很方便。自带的喇叭要给个赞，音质真的很不错的，我现在都不用外置音箱听音乐和看电影了。鲁大师跑分20万左右（不开任何软件20万，开QQ音乐不到19万，随便开个软件在测试还是有影响的。）我是首售抢购的优惠300元3699买的，如果带个鼠标和鼠标垫就好了，遗憾中，最后还是单独购买了，不带鼠标太不方便了。触控板的功能还是很强大的，两根手指向上下滑动可以代替鼠标的转轮功能，三个手指上下滑动可以隐藏桌面打开窗口缩小至任务栏向上可以显示所有打开的窗口以便选择需要使用哪个，左右滑动可以快速切换当前显示的窗口。还是很方便的，暂时只是用到这几个手势功能。指纹开机很方便，真正做到了安全和简单合二为一的一键开机。`;

// 没有主动调用nodejieba.load载入词典的时候，
// 会在第一次调用cut或者其他需要词典的函数时，自动载入默认词典。
// 词典只会被加载一次。
// result = nodejieba.cut(sentence);
// console.log(result);

// result = nodejieba.cut(sentence, true);
// console.log(result);

// result = nodejieba.cutHMM(sentence);
// console.log(result);

// result = nodejieba.cutAll(sentence);
// console.log(result);

// result = nodejieba.cutForSearch(sentence);
// console.log(result);

// result = nodejieba.tag(sentence);
// console.log(result);
// console.log('=======');
// console.log(nodejieba.extractWithWords(nodejieba.tagWordsToStr(result), 5));
// console.log(nodejieba.extract(sentence, 30));

// console.log(nodejieba.textRankExtractWithWords(nodejieba.tagWordsToStr(result), 5));
// console.log(nodejieba.textRankExtract(sentence, 5));
// console.log('=======');
// var topN = 5;
// result = nodejieba.extract(sentence, topN);
// console.log(result);

// result = nodejieba.cut("男默女泪");
// console.log(result);
// nodejieba.insertWord("男默女泪");
// result = nodejieba.cut("男默女泪");
// console.log(result);

// result = nodejieba.cutSmall("南京市长江大桥", 3);
// console.log(result);


let result = nodejieba.extract(sentence, 1000);  // 从文本中抽取
let tagList = dict; // 自定义词库

let res = result.filter(item => tagList.indexOf(item.word) >= 0);
console.log(res);
