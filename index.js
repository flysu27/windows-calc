//显示公式
var formula = "";
//当前正在输入的数字 只有当输入非数字或非正负号或非小数点才push到输入数组
//清空num
var num = "";
//公式显示模块
var f = document.getElementsByClassName('showFormula')[0];
f.innerText = "";
//结果或当前输入显示模块
var r = document.getElementsByClassName('showResult')[0];
r.innerText = "0";
//获取按键或点击事件的符号
var btn = document.getElementsByClassName('btn')[0];
//符号按键
var sym = document.getElementsByClassName('sym');

//所有按键点击事件
btn.addEventListener("click",hander);
//点击处理函数
function hander(e){
    var cur = e.target.innerText;
    var parseCur = parseInt(cur);

    //解除错误禁用按钮
    if(sym[0].getAttribute("disabled")=="disabled"){
        for(var i=0; i<sym.length; i++){
            sym[i].removeAttribute("disabled");
        }
        reset();
    }
    //CE/C/DEL
    if(formula[formula.length-1]=="="){//继续输入 回退 =
        formula = formula.slice(0,formula.length-1);
        f.innerText = formula;
        if(!isNaN(cur) || cur=="(" || cur==")"){
            alert("请输入=+-*/%");
            return;
        }
    }
    if(cur=="CE"){//清除当前输入
        num = "";
        r.innerText = num==""?"0":num;
        return;
    }else if(cur=="C"){//reset
        reset();
        return;
    }else if(cur=="del"){//退格
        var tmp = num.slice(0,num.length-1);
        num = (tmp!="" && !isNaN(tmp))?tmp:"";//-999=>0
        r.innerText = num==""?"0":num;
        return;
    }else if(cur=="back"){//回退公式
        formula = formula.slice(0,formula.length-1);
        f.innerText = formula;
        return;
    }else if(cur=="."){//小数点
        if(num.indexOf(".")==-1){
            if(num==""){
                num="0";
            }
            num+=".";
            r.innerText = num;
        }
        return;
    }else if(cur=="+/-"){//+/-
        if(num!=""){
            if(num[0]=="-"){
                num = num.slice(1);
            }else{
                num = "-" + num;
            }
            r.innerText = num;
        }
       
        return;
    }else if(isNaN(cur)){
        if(num[0]=="-"){
            formula+="(0"+num+")";
        }else{
            formula+=num;
        }
        num="";
        r.innerText="0";
        var lastPos = formula[formula.length-1];
        if(lastPos=="."){
            cur = "0"+cur;
        }else if(isNaN(lastPos) && cur!="(" && cur!=")" && lastPos !=")"){
            alert("请输入数字");
            return;
        }
        formula+=cur;
        f.innerText=formula;
        if(cur=="="){//等号
            computed(formula);
        }
    }else if(!isNaN(cur)){
        num += cur;
        r.innerText = num;
    }
    var rLength = r.innerText.length;
    if(rLength>=4){
        var splitArr = [];
    for(var i=rLength-3; i>=0; i-=3){
        var tmp = r.innerText.substr(i,3);
        splitArr.push(tmp);
        console.log(i);
        if(i<3 && i>0){
            splitArr.push(r.innerText.substr(0,i));
        }
    }
    console.log(splitArr);
    r.innerText=splitArr.reverse().join(',');
    }
    
}
function calc_error(message){
    r.innerText=message;
    var e = new RangeError("");
    f.innerText = formula;
    for(var i=0; i<sym.length; i++){
        sym[i].setAttribute("disabled","disabled");
    }
    return e;
}
function reset(){
    inputArr = [];
    formula = "";
    f.innerText = formula;
    num = "";
    r.innerText = num==""?"0":num;
}
function computed(formula){
    formula = lastMustNum(formula);
    console.log(formula);
    inputArr  = fsToArr(formula);
    var back = midToBack(inputArr);
    //开始计算
    var stack = [];
    for(var i=0; i<back.length; i++){
        var cur = back[i];
        if(!isNaN(cur)){
            stack.push(cur);
        }else{
            var two = stack.pop();
            var one = stack.pop();
            var res = 0;
            switch(cur){
                case "+":
                    res = one+two;
                    break;
                case "-":
                    res = one-two;
                    break;
                case "*":
                    res = one*two;
                    break;
                case "/":
                    if(two==0){
                        throw new calc_error("除数不能为零");
                    }else{
                        res = one/two;
                    }
                    break;
                case "%":
                    if(two==0){
                        throw new calc_error("模数不能为零");
                    }else{
                        res = one%two;
                    }
                    break;
            }
            stack.push(res);
        }
    }
    r.innerText = stack[0];
}
function lastMustNum(formula) {
    while(isNaN(formula[formula.length-1]) && formula[formula.length-1]!=")"){
        formula = formula.slice(0,formula.length-1);
    }
    return formula;
}
function fsToArr(formula){
    var arr = [];
    while(formula){
        var cur = "";
        do{
            cur+=formula[0];
            formula = formula.slice(1);
        }
        while(!isNaN(cur[0]) &&!isNaN(formula[0]) || formula[0]==".");
        if(!isNaN(cur)){
            cur = parseFloat(cur);
        }
        arr.push(cur);
    }
    return arr;
}
// 中缀转后缀
function midToBack(arr){
    console.log(arr);
    var stack = [];
    var back = [];
    for(var i=0; i<arr.length; i++){
        var cur = arr[i];
        console.log(cur);
        if(!isNaN(cur)){//数字
            back.push(cur);
        }else{
            if(stack.length==0){
                stack.push(cur);
            }else if(cur==")"){
                while(stack.length!=0 && stack[stack.length-1]!="("){
                    back.push(stack.pop());
                }
                if(stack.length==0)//栈空 说明表达式()个数不匹配表达式错误
                {
                    throw new calc_error("表达式错误");
                    return;
                }else{
                     stack.pop();//弹出(
                }
            }else if( cur=="(" || symPrior[cur]<symPrior[stack[stack.length-1]]){
                stack.push(cur);    
            }else{
                while(stack.length!=0 && stack[stack.length-1]!="(" && symPrior[cur]>=symPrior[stack[stack.length-1]]){
                    back.push(stack.pop());
                }
                stack.push(cur);
            }
        }
    }
    while(stack.length!=0){
        back.push(stack.pop());
    }
    console.log(back);
    return back;
}

var symPrior = {"(":0,")":0,"%":1,"/":1,"*":1,"+":2,"-":2};



