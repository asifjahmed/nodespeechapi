var sampledata = 'hey did not work today';
var changetext = 'change did not to we did not';

console.log(getwordsbeforeword(getwordsafterword(changetext, 'change'), 'to'));


function getwordsafterword(splittext, keyword) {
	var findkeyword = splittext.indexOf(keyword);
	if(findkeyword >= 0) {
		return splittext.substring(splittext.indexOf(keyword)+(keyword).length+1);
	} else {
		return '[error]';
	}
}

function getwordsbeforeword(splittext, keyword) {
	var findkeyword = splittext.indexOf(keyword);
	if(findkeyword >= 0) {
		return splittext.substring(0,splittext.indexOf(keyword)).trim();
	} else {
		return '[error]';
	}
}