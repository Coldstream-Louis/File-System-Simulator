/**
 * Created by dushuyang on 17/6/20.
 */

// 结构体定义树的节点
function node(order, type, number, name, father, child, time){
    this.order=order;             // 在树中的序号
    this.type=type;             // 节点的种类是文件还是文件夹
    this.number=number;             // 文件或文件夹的编号(在相应的size数组和content数组中的序号)
    this.name=name;             // 该文件或文件夹的名称
    this.father=father;             // 该节点的父节点在树中的序号
    this.child=child;             // 该节点的孩子节点所组成的数组
    this.time=time;             // 该节点的创建时间
}

// 结构体定义当前选择
function chose(number, type, space, content){
    this.number = number;          // 当前选择的对象是当前目录的第几个子节点
    this.type = type;          // 当前选择的对象的类型是文件还是文件夹
    this.space = space;             // 当前选择的对象的文件显示栏
    this.content = content;             // 当前选择的对象所对应的的树中的节点
}

var path = document.createElement("path_display");           // 显示当前目录
path.innerText = "/System";                           // 初始目录
document.getElementById("path").appendChild(path);
path.style.position="absolute";
path.style.left="20px";
path.style.top="10px";

var chosen = new chose(0, 0, 0, 0);          // 当前选择的对象,初始为空

var fileSize_list = new Array();          // 存储各文件夹大小的数组
fileSize_list[0] = 0;

var txtSize_list = new Array();          // 存储各文件大小的数组
txtSize_list[0] = 0;

var txtContent_list = new Array();         // 存储各文件文本内容的数组
txtContent_list[0] = 0;

var Tree = new Array();                   // 存储文件和文件夹信息的树
var c = new Array();                      // 树的根节点的初始化
c[0] = 0;
Tree[0] = new node(0, "file", 0, "System", "none", c, 0);
var current_file = Tree[0];              // 当前所在目录
var current = 0;                       // 当前树中的节点数

// 右键菜单的显示
var menu = document.getElementById("menu");
document.oncontextmenu = function(e) {
    var e = e || window.event;
    //鼠标点的坐标
    var oX = e.clientX;
    var oY = e.clientY;
    //菜单出现后的位置
    if(oY > 100) {
        menu.style.display = "block";
        menu.style.left = oX + "px";
        menu.style.top = oY + "px";
    }
    //阻止浏览器默认事件
    return false;//一般点击右键会出现浏览器默认的右键菜单，写了这句代码就可以阻止该默认事件。
}
// 单击隐藏右键菜单
document.onclick = function(e) {
    var e = e || window.event;
    menu.style.display = "none";
}
menu.onclick = function(e) {
    var e = e || window.event;
    e.cancelBubble = true;
}
// 结构体定义内存块
function Block(number, occupied, storage){
    this.number = number;             // 占用该内存块的文件或文件夹编号
    this.occupied = occupied;             // 该内存块目前被占用的内存
    this.storage = storage;             // 该内存块的总内存
}

// 初始化整个系统的内存
var Total_space = new Array(1024);      // 该系统内存总大小为1024块,每块有64字节
for(var k = 0; k < Total_space.length; k++)
{
    Total_space[k] = new Block(0, 0, 64);
}

firm();             // 提示是否要读取上次的存储记录,第一次进入应点取消
function firm() {
    //利用对话框返回的值 （true 或者 false）
    if (confirm("要读取上次创立的文件系统吗？(第一次打开或更换新浏览器后请点取消)")) {
        load_before();
        alert("已成功读取上次的文件系统!");
    }
    else {
        alert("已新建文件系统!");
    }
}

// 在当前目录下新建一个文件夹
function file_found() {
    var name = prompt("请输入文件夹的名字", "未命名文件夹");
    if (name)
    {
        for(var i = 0; i<current_file.child.length; i++)
        {
            if(name === current_file.child[i].name && current_file.child[i].type === "file")
            {
                alert("已有相同名称的文件夹,无法创建同名文件夹!");
                return;
            }
            if(name === "System"){
                alert("不得将文件夹命名为System!")
                return
            }
        }
        add_file(name);
        alert("已成功建立文件夹：" + name);
    }
}

// 在当前目录下新建一个文本文件
function txt_found() {
    var name = prompt("请输入文件的名字", "未命名文件");
    if (name)
    {
        for(var i = 0; i<current_file.child.length; i++)
        {
            if(name === current_file.child[i].name && current_file.child[i].type === "txt")
            {
                alert("已有相同名称的文件,无法创建同名文件!");
                return;
            }
            if(name === "System"){
                alert("不得将文件命名为System!")
                return
            }
        }
        add_txt(name);
        alert("已成功建立文件：" + name);
    }
}

// 文件或文件夹在页面上的显示
function display(node, position)
{
    var space = document.getElementById("s_"+position);        // 当前目录已有超过9个子节点,显示更多的文件显示栏
    if(space.style.display === "none")
        space.style.display = "block";
    if(node.type === "file") {
        space.innerHTML = "<img id='icon' src='file.png' width='50' height='50' alt='' " +
            "style='position: relative; left: 20px;'/>";
    }       // 显示文件夹图标
    else{
        space.innerHTML = "<img id='icon' src='txt.png' width='50' height='50' alt='' " +
            "style='position: relative; left: 20px;'/>";
    }       // 显示文件图标
    var n = document.createElement("Name");       // 显示名称
    n.innerText = node.name;
    space.appendChild(n);
    n.style.position = "absolute";
    n.style.left="100px";
    n.style.top="20px";
    var t = document.createElement("Time");       // 显示创建时间
    t.innerText = node.time;
    space.appendChild(t);
    t.style.position = "absolute";
    t.style.left="400px";
    t.style.top="20px";
    var s = document.createElement("Size");       // 显示大小
    if(node.type === "file")
        s.innerText = fileSize_list[node.number]+"B";
    else
        s.innerText = txtSize_list[node.number]+"B";
    space.appendChild(s);
    s.style.position = "absolute";
    s.style.left="1000px";
    s.style.top="20px";
}

// 删除所选的对象
function delete_this()
{
    if(chosen.number === 0){
        alert("没有选中任何文件!");
        return;
    }
    if(chosen.type === "file") {            // 删除一个文件夹及其里面的内容
        size_change(0 - fileSize_list[chosen.content.number]);       // 改变列表内的内存大小
        removeFile_storage();              // 释放存储空间中相应的块
    }
    else {                             // 删除一个文件
        size_change(0 - txtSize_list[chosen.content.number]);       // 改变列表内的内存大小
        removeTxt_storage(chosen.content.number);              // 释放存储空间中相应的块
    }
    chosen.child = 0;                // 选择对象初始化为空
    for(var i = chosen.number; i < (current_file.child.length-1); i++)        // 从目录中删除此孩子节点,后面的节点顺序前移
        current_file.child[i] = current_file.child[i+1];
    current_file.child.pop();             // 排除最后的节点避免重复
    Tree[current_file.order] = current_file;
    chosen.content = current_file;        // 重新显示该目录下的文件列表
    change_file();
    alert("删除成功!");
}

// 在内存中删除一个文件,释放相应的块
function removeTxt_storage(n)
{
    for(var i=0; i<Total_space.length; i++){
        if(Total_space[i].number === n){
            Total_space[i].number = 0;
            Total_space[i].occupied = 0;
        }
    }
}

// 在内存中删除一个文件夹及其里面的内容,释放相应的块
function removeFile_storage()
{
    for(var i=0; i<Tree.length; i++) {
        if(Tree[i].type === "txt") {         // 寻找该文件夹下的所有文件,在内存中一一删除并释放相应的块
            var d = Tree[i];
            while (d !== Tree[0]) {
                if(d === chosen.content){
                    removeTxt_storage(Tree[i].number);
                    break;
                }
                d = Tree[d.father];
            }
        }
    }
}

// 在树和各个list中添加新文件夹
function add_file(name)
{
    var myDate = new Date();            // 获取创建时间
    current++;                        // 树中节点数+1
    var x = fileSize_list.length;      // 初始大小为0
    fileSize_list[x] = 0;
    var ch = new Array();             // 初始化孩子节点数组
    ch[0]=0;
    Tree[current] = new node(current, "file", x, name, current_file.order, ch, myDate);
    var s = current_file.child.length;
    current_file.child[s] = Tree[current];      // 添加到当前目录的孩子数组中
    display(Tree[current], s);        //  显示此文件夹
}

// 在树和各个list中添加新文件
function add_txt(name)
{
    var myDate = new Date();            // 获取创建时间
    current++;                        // 树中节点数+1
    var x = txtSize_list.length;      // 初始大小为1Byte
   txtSize_list[x] = 1;
    txtContent_list[x] = "0";             // 初始化内部文本,有一个字符"0"
    size_change(1);
    for(var i = 0; i < Total_space.length; i++){        // 在内存中添加新文件
        if(Total_space[i].number === 0){
            Total_space[i].number = x;
            Total_space[i].occupied = 1;
            break;
        }
    }
    Tree[current] = new node(current, "txt", x, name, current_file.order, "none", myDate);
    var s = current_file.child.length;
    current_file.child[s] = Tree[current];      // 添加到当前目录的孩子数组中
    display(Tree[current], s);        //  显示此文件
}

//  打开当前选中的对象
function open_this()
{
    if(chosen.space === 0){
        alert(" 没有选中任何文件!");
        return;
    }
    if(chosen.type === "file")               //  如果是文件夹,则更换当前目录,并显示其中的文件
        change_file();
    else if(chosen.type === "txt"){          //  如果是文件,则弹出显示文件内容的窗口
        document.getElementById("TxTWindow").style.display = "block";
        document.getElementById("content").value = txtContent_list[chosen.content.number];
    }
}

// 保存对当前文件内文本所做的修改
function saveTxT()
{
    var temp = document.getElementById('content');
    txtContent_list[chosen.content.number] = temp.value;
    var former = txtSize_list[chosen.content.number];
    txtSize_list[chosen.content.number] = parseInt(txtContent_list[chosen.content.number].length);
    var difference = txtSize_list[chosen.content.number] - former;
    size_change(difference);          // 修改list中的大小
    changeInStorage();             // 修改内存
    quitTxT();
}

// 退出当前文件,关闭文件内容窗口
function quitTxT()
{
    document.getElementById("content").value = "";
    document.getElementById("TxTWindow").style.display = "none";
    display(chosen.content, chosen.number);
}

// 修改当前文件在list中的大小,同时修改其各层目录的大小
function size_change(difference)
{
    var temp = current_file;
    fileSize_list[current_file.number]+=difference;
    while(current_file !== Tree[0]){
        fileSize_list[Tree[current_file.father].number]+=difference;
        current_file = Tree[current_file.father];
    }
    current_file = temp;
}

// 修改当前文件在内存中的大小
function changeInStorage()
{
    for(var i=0; i<Total_space.length; i++){               // 先将该文件所占的块清空
        if(Total_space[i].number === chosen.content.number) {
            Total_space[i].number = 0;
            Total_space[i].occupied = 0;
        }
    }
    if(txtSize_list[chosen.content.number] === 0){         // 如果文件大小等于0
        for(var i = 0; i < Total_space.length; i++){
            if(Total_space[i].number===0){
                Total_space[i].number = chosen.content.number;
            }
        }
    }
    else{
        var count = parseInt(txtSize_list[chosen.content.number] / 64);     // 如果文件大小大于0,计算所需的块数
        var rest = txtSize_list[chosen.content.number] % 64;
        for(var i = 0; i < Total_space.length; i++){
            if(count === 0 && rest !== 0 && Total_space[i].number===0){
                Total_space[i].number = chosen.content.number;
                Total_space[i].occupied = rest;
                break;
            }
            else if(Total_space[i].number===0){
                Total_space[i].number = chosen.content.number;
                Total_space[i].occupied = 64;
                count--;
            }
            else if(count === 0 && rest === 0)
                break;
        }
    }
}

// 改变当前的目录,并显示改变后的目录中的内容
function change_file()
{
    if(chosen.space !== 0) {                // 改变选择对象的块的颜色为初始颜色
        if ((chosen.number % 2) === 0)
            chosen.space.style.background = "#FFFFFF";
        else
            chosen.space.style.background = "#E0E0E0";
    }
    for(var i=1; i<=current_file.child.length; i++) {         // 删除当前显示的目录中的文件
        var x = document.getElementById("s_"+i);
        while(x.hasChildNodes()){
            x.removeChild(x.firstChild);
        }
    }
    for(var i=1; i<chosen.content.child.length; i++) {         // 显示新目录中的文件
        display(chosen.content.child[i], i);
    }
    current_file = chosen.content;
    chosen = new chose(0,0,0,0);               // 选择对象变为空
    path_change();                            // 改变当前目录的路径显示
    if(current_file.child.length <= 10){
        for(var i=10; i<=19; i++)
            document.getElementById("s_"+i).style.display="none";
    }
}

function choose(number)              // 鼠标单击选择对象
{
    if(document.getElementById("TxTWindow").style.display === "block")        // 如果当前正打开某文件,则不能进行选择
        return;
    if(chosen.space !== 0){                   // 改变选择对象的块的颜色为蓝色
        if((chosen.number%2) === 0)
            chosen.space.style.background = "#FFFFFF";
        else
            chosen.space.style.background = "#E0E0E0";
    }
    if(number >= current_file.child.length){           //  将选择对象变为空
        chosen = new chose(0,0,0,0);
    }
    else{                                      // 获取并存储选择对象的一系列属性
        chosen.space = document.getElementById("s_"+number);
        chosen.space.style.background="#6A6AFF";
        chosen.number = number;
        chosen.type = current_file.child[number].type;
        chosen.content = current_file.child[number];
    }
}

// 改变当前的目录路径并显示
function path_change()
{
    path.innerText = "";
    var p = new Array();          // 用数组存储路径中各个文件夹的名字
    var i = 0;
    var temp = current_file;
    while(current_file !== Tree[0]){       // 寻找父节点一直到最上层
        p[i++] = current_file.name;
        current_file = Tree[current_file.father];
    }
    p[i] = current_file.name;
    for(var j = (p.length-1); j >=0; j--){          // 反向输出数组即为路径
        path.innerText = path.innerText + "/" + p[j];
    }
    current_file = temp;
}

// 返回上层目录
function return_father()
{
    if(current_file.name === "System"){
        alert("已经处于系统最外层目录,无法继续后退!");
        return;
    }
    chosen.content = Tree[current_file.father];            // 将显示内容变为上层目录的内容
    change_file();
}

// 重命名
function rename(){
    if(chosen.space === 0){
        alert(" 没有选中任何文件!");
        return;
    }
    var name = prompt("请输入更改后的文件名", chosen.content.name);
    if (name && chosen.type === "file")           // 文件夹的重命名
    {
        for(var i = 0; i<current_file.child.length; i++)
        {
            if(name === chosen.content.name)
                return;
            else if(name === current_file.child[i].name && current_file.child[i].type === "file")
            {
                alert("已有相同名称的文件夹,无法创建同名文件夹!");
                return;
            }
            else if(name === "System"){
                alert("不得将文件夹命名为System!")
                return
            }
        }
        chosen.content.name = name;
        alert("已成功修改该文件夹名称为：" + name);
    }
    else if (name && chosen.type === "txt")           // 文件的重命名
    {
        for(var i = 0; i<current_file.child.length; i++)
        {
            if(name === chosen.content.name)
                return;
            else if(name === current_file.child[i].name && current_file.child[i].type === "txt")
            {
                alert("已有相同名称的文件,无法创建同名文件!");
                return;
            }
            else if(name === "System"){
                alert("不得将文件命名为System!")
                return
            }
        }
        chosen.content.name = name;
        alert("已成功修改该文件名称为：" + name);
    }
    display(chosen.content, chosen.number);           // 重新显示重命名后的该文件
}

// 格式化,删除所有文件
function format()
{
    alert("即将删除系统内全部文件!");
    while(current_file !== Tree[0]){                  // 退回最外层目录
        return_father();
    }
    for(var i=1; i<=current_file.child.length; i++) {        // 删除当前显示的内容
        var x = document.getElementById("s_"+i);
        while(x.hasChildNodes()){
            x.removeChild(x.firstChild);
        }
    }
    chosen = new chose(0,0,0,0);             // 将当期选择内容变为空
    Tree = new Array();
    var ch = new Array();
    ch[0] = 0;
    Tree[0] = new node(0, "file", 0, "System", "none", ch, 0);       // 新建空树,根节点初始化
    current_file = Tree[0];
    Total_space = new Array(1024);                // 内存初始化
    for(var k = 0; k < Total_space.length; k++)
    {
        Total_space[k] = new Block(0, 0, 64);
    }
    fileSize_list = new Array();            // 各个list内容初始化
    fileSize_list[0] = 0;
    txtSize_list = new Array();
    txtSize_list[0] = 0;
    txtContent_list = new Array();
    txtContent_list[0] = 0;
    current=0;                        // 树中节点数初始化
}

function save_all()                    // 将树、各个list和内存表转为JSON格式,存储到本地浏览器
{
    var a = JSON.stringify(Total_space);
    localStorage.setItem("storageSpace", a);
    var b = JSON.stringify(Tree);
    localStorage.setItem("TreeStructure", b);
    var c = JSON.stringify(fileSize_list);
    localStorage.setItem("fileSize", c);
    var d = JSON.stringify(txtSize_list);
    localStorage.setItem("txtSize", d);
    var e = JSON.stringify(txtContent_list);
    localStorage.setItem("txtContent", e);
    localStorage.setItem("count", current);
}

function load_before()              // 从浏览器localstorage中读取之前存储的数据,并显示出系统内的内容
{
    Total_space = JSON.parse(localStorage.getItem("storageSpace"));
    Tree = JSON.parse(localStorage.getItem("TreeStructure"));
    fileSize_list = JSON.parse(localStorage.getItem("fileSize"));
    txtSize_list = JSON.parse(localStorage.getItem("txtSize"));
    txtContent_list = JSON.parse(localStorage.getItem("txtContent"));
    current = parseInt(localStorage.getItem("count"));
    current_file = Tree[0];
    for(var i=1; i<current_file.child.length; i++) {           // 显示出系统中最外层目录的内容
        display(current_file.child[i], i);
    }
}