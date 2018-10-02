function bencode(obj){if(obj===null||obj===undefined){throw"invalid: cannot encode null"}switch(btypeof(obj)){case"string":return bstring(obj);case"number":return bint(obj);case"list":return blist(obj);case"dictionary":return bdict(obj);case"boolean":return bint(obj?1:0);default:throw"invalid object type in source: "+btypeof(obj)}}function uintToString(uintArray){var s="";var skip=10400;var slice=uintArray.slice;for(var i=0,len=uintArray.length;i<len;i+=skip){if(!slice){s+=String.fromCharCode.apply(null,uintArray.subarray(i,Math.min(i+skip,len)))}else{s+=String.fromCharCode.apply(null,uintArray.slice(i,Math.min(i+skip,len)))}}return s}function bdecode(buf){if(!buf.substr){buf=uintToString(buf)}var dec=bparse(buf);return dec[0]}function bparse(str){switch(str.charAt(0)){case"d":return bparseDict(str.substr(1));case"l":return bparseList(str.substr(1));case"i":return bparseInt(str.substr(1));default:return bparseString(str)}}function ord(c){return c.charCodeAt(0)}function bparseString(str){str2=str.split(":",1)[0];if(isNum(str2)){len=parseInt(str2);return[str.substr(str2.length+1,len),str.substr(str2.length+1+len)]}return null}function bparseInt(str){var str2=str.split("e",1)[0];if(!isNum(str2)){return null}return[parseInt(str2),str.substr(str2.length+1)]}function bparseList(str){var p,list=[];while(str.charAt(0)!=="e"&&str.length>0){p=bparse(str);if(null===p){return null}list[list.length]=p[0];str=p[1]}if(str.length<=0){throw"unexpected end of buffer reading list"}return[list,str.substr(1)]}function bparseDict(str){var key,val,dict={};while(str.charAt(0)!=="e"&&str.length>0){key=bparseString(str);if(null===key){return}val=bparse(key[1]);if(null===val){return null}dict[key[0]]=val[0];str=val[1]}if(str.length<=0){return null}return[dict,str.substr(1)]}function isNum(str){return!isNaN(str.toString())}function btypeof(obj){var type=typeof obj;if(type==="object"){if(typeof obj.length==="undefined"){return"dictionary"}return"list"}return type}function bstring(str){return str.length+":"+str}function bint(num){return"i"+num+"e"}function blist(list){var str;str="l";for(key in list){str+=bencode(list[key])}return str+"e"}function bdict(dict){var str;str="d";for(key in dict){str+=bencode(key)+bencode(dict[key])}return str+"e"}