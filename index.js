//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//历史记录 含算术式与结果
var historyArr = [];
//运算符优先级
var symPrior = { "(": 0, ")": 0, "%": 1, "/": 1, "*": 1, "+": 2, "-": 2 };
//显示公式
var formula = "";
//当前正在输入的数字 只有当输入非数字或非正负号或非小数点才push到输入数组
//清空num
var num = "";
//公式显示模块
var f = document.getElementsByClassName("sF")[0];
f.innerText = "";
//结果或当前输入显示模块
var r = document.getElementsByClassName("sR")[0];
r.innerText = "0";
//获取按键或点击事件的符号
var btn = document.getElementsByClassName("btn")[0];
//符号按键
var sym = document.getElementsByClassName("sym");
var oldClass = "";
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var mask = document.getElementsByClassName('mask')[0];
//历史记录按钮逻辑
var history = [];
var hisBtn = document.getElementsByClassName("history")[0];
var historyBox = document.getElementsByClassName("historyBox")[0];
var historyList = document.getElementsByClassName("historyList")[0];
var historyBox_old_top = 0;
var body = document.body;
var bHeight = body.getBoundingClientRect().height;
var bWidth = body.getBoundingClientRect().width;
hisBtn.addEventListener("click",function (e){
    mask.style.display="block";
    //historyBox动画从下到上
    historyBox_old_top = historyBox.getBoundingClientRect().top;
    getHistoryList();
    itemEvent();
    move(historyBox,450/690*bHeight,0.5,"top");
    
})
//渲染history列表
function getHistoryList(){
  historyList.innerHTML = "";
  for(var i=0; i<historyArr.length; i++){
    var tmp = historyArr[i];
    historyList.innerHTML+=`
    <div class="show" data-id='`+i+`'">
       <div class="showFormula">`+tmp[0]+`</div>
       <div class="showResult">`+tmp[1]+`</div>
    </div>
    `;
  }
}
//历史清理
var clearBox = document.getElementsByClassName("clearBox")[0];
clearBox.addEventListener("click",function (e){
  historyArr = [];
  historyList.innerHTML = "";
  e.stopPropagation();//禁止冒泡
})
//计算器菜单
var funcBtn = document.getElementsByClassName("funcBtn")[0];
var funcBtn_old_left = 0;
var cates = document.getElementsByClassName("cates")[0];
funcBtn.addEventListener("click",function (e){
  mask.style.display="block";
  //cates动画从左到右
  if(parseInt(cates.style.left)>=0){
    move(cates,0.75*bWidth,0.5,"left");//收回
    setTimeout(()=>{
      mask.style.display="none";
    },500);
  }else{
    move(cates,0.75*bWidth,0.5,"right");
  }
})
function itemEvent(){
  //历史公式项
  var historyItem = historyList.getElementsByClassName("show");
  for(var i=0; i<historyItem.length; i++){
    historyItem[i].addEventListener("click",function (e){
      //formula = formula.slice(0, formula.length - 1);
      //公式\结果显示
      f.innerText = this.children[0].innerText;
      r.innerText = this.children[1].innerText;
      //更新历史列表
      var curId = parseInt(this.getAttribute("data-id"));
      console.log(curId);
      var tmp = historyArr[0];
      historyArr[0] = historyArr[curId];
      historyArr[curId] = tmp;
      console.log(historyArr);
    })
  }
}
//遮罩层
mask.addEventListener("click",function (e){
    
    if(parseInt(historyBox.style.top)<historyBox_old_top){
      historyBox.style.top=historyBox_old_top+"px";
    }
    if(parseInt(cates.style.left)>=0){
      move(cates,0.75*bWidth,0.5,"left");//收回
    }
    setTimeout(()=>{
      this.style.display="none";
    },500);
    
})
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//所有按键点击事件
btn.addEventListener("mousedown", function (e) {
  var curEle = e.target;
  oldClass = curEle.getAttribute("class");
  curEle.setAttribute("class", oldClass + " btn-click");
});
btn.addEventListener("mouseup", function (e) {
  var curEle = e.target;
  curEle.setAttribute("class", oldClass);
});
btn.addEventListener("touchdown", function (e) {
  var curEle = e.target;
  oldClass = curEle.getAttribute("class");
  curEle.setAttribute("class", oldClass + " btn-click");
});
btn.addEventListener("touchup", function (e) {
  var curEle = e.target;
  curEle.setAttribute("class", oldClass);
});
btn.addEventListener("click", hander);
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//点击处理函数
function hander(e) {
  var cur = e.target.innerText;
  var parseCur = parseInt(cur);

  //解除错误禁用按钮
  if (sym[0].getAttribute("disabled") == "disabled") {
    for (var i = 0; i < sym.length; i++) {
      sym[i].removeAttribute("disabled");
    }
    reset();
  }
  //CE/C/DEL
  if (formula[formula.length - 1] == "=") {
    //继续输入 回退 =
    formula = formula.slice(0, formula.length - 1);
    f.innerText = formula;
    if (!isNaN(cur) || cur == "(" || cur == ")") {
      alert("请输入=+-*/%");
      return;
    }
  }
  if (cur == "CE") {
    //清除当前输入
    num = "";
    r.innerText = num == "" ? "0" : num;
    return;
  } else if (cur == "C") {
    //reset
    reset();
    return;
  } else if (cur == "del") {
    //退格
    var tmp = num.slice(0, num.length - 1);
    num = tmp != "" && !isNaN(tmp) ? tmp : ""; //-999=>0
    r.innerText = num == "" ? "0" : num;
    return;
  } else if (cur == "back") {
    //回退公式
    formula = formula.slice(0, formula.length - 1);
    f.innerText = formula;
    return;
  } else if (cur == ".") {
    //小数点
    if (num.indexOf(".") == -1) {
      if (num == "") {
        num = "0";
      }
      num += ".";
      r.innerText = num;
    }
    return;
  } else if (cur == "+/-") {
    //+/-
    if (num != "") {
      if (num[0] == "-") {
        num = num.slice(1);
      } else {
        num = "-" + num;
      }
      r.innerText = num;
    }

    return;
  } else if (isNaN(cur)) {
    if (num[0] == "-") {
      formula += "(0" + num + ")";
    } else {
      formula += num;
    }
    num = "";
    r.innerText = "0";
    var lastPos = formula[formula.length - 1];
    if (lastPos == ".") {
      cur = "0" + cur;
    } else if (isNaN(lastPos) && cur != "(" && cur != ")" && lastPos != ")") {
      alert("请输入数字");
      return;
    }
    formula += cur;
    f.innerText = formula;
    if (cur == "=") {
      //等号
      computed(formula);
    }
  } else if (!isNaN(cur)) {
    num += cur;
    r.innerText = num;
  }
  var rLength = r.innerText.length;
  if (rLength >= 4) {
    var splitArr = [];
    for (var i = rLength - 3; i >= 0; i -= 3) {
      var tmp = r.innerText.substr(i, 3);
      splitArr.push(tmp);
      console.log(i);
      if (i < 3 && i > 0) {
        splitArr.push(r.innerText.substr(0, i));
      }
    }
    console.log(splitArr);
    r.innerText = splitArr.reverse().join(",");
  }
}
function calc_error(message) {
  r.innerText = message;
  var e = new RangeError("");
  f.innerText = formula;
  for (var i = 0; i < sym.length; i++) {
    sym[i].setAttribute("disabled", "disabled");
  }
  return e;
}
function reset() {
  inputArr = [];
  formula = "";
  f.innerText = formula;
  num = "";
  r.innerText = num == "" ? "0" : num;
}
function computed(formula) {
  formula = lastMustNum(formula);
  console.log(formula);
  inputArr = fsToArr(formula);
  var back = midToBack(inputArr);
  //开始计算
  var stack = [];
  for (var i = 0; i < back.length; i++) {
    var cur = back[i];
    if (!isNaN(cur)) {
      stack.push(cur);
    } else {
      var two = stack.pop();
      var one = stack.pop();
      var res = 0;
      switch (cur) {
        case "+":
          res = one + two;
          break;
        case "-":
          res = one - two;
          break;
        case "*":
          res = one * two;
          break;
        case "/":
          if (two == 0) {
            throw new calc_error("除数不能为零");
          } else {
            res = one / two;
          }
          break;
        case "%":
          if (two == 0) {
            throw new calc_error("模数不能为零");
          } else {
            res = one % two;
          }
          break;
      }
      stack.push(res);
    }
  }
  var result = stack[0];
  r.innerText = result
  historyArr.push([formula+"=",result]);
}
function lastMustNum(formula) {
  while (
    isNaN(formula[formula.length - 1]) &&
    formula[formula.length - 1] != ")"
  ) {
    formula = formula.slice(0, formula.length - 1);
  }
  return formula;
}
function fsToArr(formula) {
  var arr = [];
  while (formula) {
    var cur = "";
    do {
      cur += formula[0];
      formula = formula.slice(1);
    } while ((!isNaN(cur[0]) && !isNaN(formula[0])) || formula[0] == ".");
    if (!isNaN(cur)) {
      cur = parseFloat(cur);
    }
    arr.push(cur);
  }
  return arr;
}
// 中缀转后缀
function midToBack(arr) {
  console.log(arr);
  var stack = [];
  var back = [];
  for (var i = 0; i < arr.length; i++) {
    var cur = arr[i];
    console.log(cur);
    if (!isNaN(cur)) {
      //数字
      back.push(cur);
    } else {
      if (stack.length == 0) {
        stack.push(cur);
      } else if (cur == ")") {
        while (stack.length != 0 && stack[stack.length - 1] != "(") {
          back.push(stack.pop());
        }
        if (stack.length == 0) {
          //栈空 说明表达式()个数不匹配表达式错误
          throw new calc_error("表达式错误");
          return;
        } else {
          stack.pop(); //弹出(
        }
      } else if (
        cur == "(" ||
        symPrior[cur] < symPrior[stack[stack.length - 1]]
      ) {
        stack.push(cur);
      } else {
        while (
          stack.length != 0 &&
          stack[stack.length - 1] != "(" &&
          symPrior[cur] >= symPrior[stack[stack.length - 1]]
        ) {
          back.push(stack.pop());
        }
        stack.push(cur);
      }
    }
  }
  while (stack.length != 0) {
    back.push(stack.pop());
  }
  console.log(back);
  return back;
}
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// 移动函数 move
// obj 移动对象,distance移动距离,time移动总耗时,direction移动方向[当前位置向 left\right\top\bottom],moving[liner\])
function move (obj,distance,time,direction){

  var body = document.body;//用于居中的情况 不是所有的body都是默认占满全屏 那么下面赋值top一定会偏移需要减去body的偏移
  var bodyLeft = body.getBoundingClientRect().left;
  distance = Math.abs(distance);
  time = Math.abs(time);
  time = time==0?1:time;//time是0就运动1s
  
  //获取当前元素的left top
  var posArr = obj.getBoundingClientRect();
  obj.style.top = posArr.top+"px";
  obj.style.left = posArr.left-bodyLeft+"px";

  //将时间分为100份
  var aveSpeed = distance/time/100;
  var curTop = parseInt(obj.style.top);
  var curLeft = parseInt(obj.style.left);
  var old_Distance = distance;
  var oldCurTop = curTop;//最初元素top
  var oldCurLeft = curLeft;//最初元素left

  //对不同移动方向设置定时器
  if(direction=="right"){
    var timer = setInterval(function () {
      if(distance<=0){
        obj.style.left = (oldCurLeft+old_Distance+"px");
        clearInterval(timer);
      }else{
        curLeft = parseInt(obj.style.left);
        obj.style.left = (curLeft+aveSpeed+"px");
        distance-=aveSpeed;
      }
    },10);
  }else if(direction=="top"){//向上
    var timer = setInterval(function () {
     
      if(distance<=0){
        obj.style.top = (oldCurTop-old_Distance+"px");
        clearInterval(timer);
      }else{
        curTop = parseInt(obj.style.top);
        obj.style.top = (curTop-aveSpeed+"px");
        distance-=aveSpeed;
      }
    },10);
  }else if(direction=="bottom"){//向下
    var timer = setInterval(function () {
      if(distance<=0){
        obj.style.top = (oldCurTop+old_Distance+"px");
        clearInterval(timer);
      }else{
        curTop = parseInt(obj.style.top);
        obj.style.top = (curTop+aveSpeed+"px");
        distance-=aveSpeed;
      }
    },10);
  }else{//默认向左
    var timer = setInterval(function () {
      if(distance<=0){
        obj.style.left = (oldCurLeft-old_Distance+"px");
        clearInterval(timer);
      }else{
        curLeft = parseInt(obj.style.left);
        obj.style.left = (curLeft-aveSpeed+"px");
        distance-=aveSpeed;
      }
    },10);
  }
}