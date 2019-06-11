Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

// var userObject = { userId: 24, name: 'Jack Bauer' }; 
// And to set it 
// localStorage.setObject('user', userObject); 
// Then get it back from storage 
// userObject = localStorage.getObject('user');


function Goal(what,whatDetails,why,plansArray,accomplishments){
    this.what=what;
    this.whatDetails=whatDetails;
    this.why = why;
    this.plansArray= plansArray;
    this.accomplishments= accomplishments;
}
//goal has array of  plans 
// plans have array of tasks

var goalsArray;
if(localStorage.getObject("goals")){
    goalsArray=localStorage.getObject("goals");
}else goalsArray=[];



window.onbeforeunload = function(event) {
    // do stuff here
    localStorage.setObject('goals', goalsArray); 

    //return "you have unsaved changes. Are you sure you want to navigate away?";
};

$('#GoalsInputField').val("");

updateGoalsList();



//either press enter or click add goal - same functionality

function checkGoalAlready(goalWhat){
    for(i=0;i<goalsArray.length;i++){
        if(goalsArray[i].what==goalWhat){
            return true;
        }
    }
    return false;
    
}


function makeNewGoal(){
    if($('#GoalsInputField').val()!=""&&!checkGoalAlready($('#GoalsInputField').val())){
        var what =  $('#GoalsInputField').val();
        goalsArray.push(new Goal(what,"","",[],[]));
        
        $('#GoalsListDisplayer').html(WhatElementsFromGoalsArray());
        
        if(goalsArray.length>1){$('#nextStepBtn1').show();}else{$('#nextStepBtn1').hide();}
        

    }
    $('#GoalsInputField').val("");
}

$('#GoalsInputField').on('keypress',function(e){
    if(e.which==13){
        makeNewGoal();
    }
});



$('#AddGoalBtn').click(function(){
    makeNewGoal();
});


//necessary function for generating dynamic html elements
function WhatElementsFromGoalsArray(){
    var html="";
    for(var i=0;i<goalsArray.length;i++){
        html+='<div class="goalWhat"><span>'+(i+1)+'. '+goalsArray[i].what+'</span><button class="btnStartWorkOnGoal">Start</button><button class="goalWhatEditBtn">edit</button><button class="goalWhatDeleteBtn">delete</button></div>'
    }
    return html;
}


/// end of click or enter 

// Next step on start screen hider
$(document).ready(function(){
    if(goalsArray.length==0){
        $('#nextStepBtn1').hide();
    }
    $("#plansScreen").hide();
    $("#newPlanCreationScreen").hide();
});


// functionality for start work 

var selectedGoalIndex= 0;
function returnSelectedGoalIndix(selectedGoal){
    var t = selectedGoal.parent().text().indexOf(".");

    var i = selectedGoal.parent().text().slice(0,t)-1;
    
    selectedGoalIndex= i;
    return i;
}

$('#GoalsListDisplayer').on('click','.btnStartWorkOnGoal',function(){
    $("#firstScreen").hide();
    $("#plansScreen").show();
    var i = returnSelectedGoalIndix($(this));
    //fill goalwhatonplansscreen
    $('.goalWhatOnPlansScreen').html("<h1>Goal: "+goalsArray[i].what+"</h1>")
    $('#GoalsListDisplayer').html(WhatElementsFromGoalsArray());
    //fill previous plans
    updateGoalsList();
    updatePlansList();
    //
});


$('#GoalsListDisplayer').on('click','.goalWhatEditBtn',function(){
    var i =returnSelectedGoalIndix($(this));
     var newGoalName= prompt("please enter the Edited goal name");
    if(newGoalName!=""&&newGoalName!=null&&!checkGoalAlready(newGoalName)){
        goalsArray[i].what = newGoalName;
    }else{
        alert("there was a problem updating the name");
    }

    updateGoalsList();
});
$('#GoalsListDisplayer').on('click','.goalWhatDeleteBtn',function(){
    var i= returnSelectedGoalIndix($(this));
    if(confirm("Are you sure you want to delete this goal?")){
        if(confirm("are you sure you want to delete goal: "+ goalsArray[selectedGoalIndex].what)){
            goalsArray.splice(selectedGoalIndex,1);

        }
    }
    updateGoalsList();
});

function updateGoalsList(){

    $('#GoalsListDisplayer').html(WhatElementsFromGoalsArray());

        if(goalsArray.length>1){$('#nextStepBtn1').show();}else{$('#nextStepBtn1').hide();}
}



$('#selectDifferentGoalBtn').click(function(){
    $("#firstScreen").show();
    $("#plansScreen").hide();
});

$("#newPlanBtn").click(function(){
    
    makeNewPlan();
    $("#newPlanCreationScreen").show();
    $("#plansScreen").hide();
    showSelectedPlan();

});

$('#btnChooseOtherPlan').click(function(){
    $("#newPlanCreationScreen").hide();
    $("#plansScreen").show();
    updatePlansList();
});


function Plan(tasksArray,name){
    this.tasksArray= tasksArray;
    this.name=name;
    
}

function Task(name,subTaskArray,note) {
    this.name= name;
    this.subTaskArray= subTaskArray;
    this.note= note;
}



var selectedPlanTaskArray;
var selectedPlan;

function makeNewPlan(){
    var i= goalsArray[selectedGoalIndex].plansArray.length+1;
    selectedPlanTaskArray=[];
    selectedPlan = new Plan(selectedPlanTaskArray,"Plan "+i);
    goalsArray[selectedGoalIndex].plansArray.push(selectedPlan);
}
function updateSelectedPlan(i){
    
    selectedPlan = goalsArray[selectedGoalIndex].plansArray[i];
}
function showSelectedPlan(){
    $(".selectedPlan").html(selectedPlan.name);
    $("#newPlanCreationScreen").show();
    $("#plansScreen").hide();
    updateTaskList();
    
}
//merge goal

function updatePlansList(){
    var html="";
    for(i=0;i<goalsArray[selectedGoalIndex].plansArray.length;i++){
        html+="<div class ='plan'>"+goalsArray[selectedGoalIndex].plansArray[i].name+"<button>start</button></div><br>";
    }
    $("#plansHolder").html(html);
}

$("#plansHolder").on("click",".plan button",function(){
    var i = parseInt($(this).parent().html().slice(5,6))-1;
    updateSelectedPlan(i);
    showSelectedPlan();
});

function updateTaskList(){
    var html = "";
    for(i=0;i<selectedPlan.tasksArray.length;i++){
        
        html+="<div class='task'>"+i+". "+selectedPlan.tasksArray[i].name+ "<button class='TB startTaskBtn'>start</button><button class='TB delTaskBtn'>delete</button><button class='TB makeGoalBtn'>Make Goal</button></div><br><br>";
    }
    $("#TaskListDisplayer").html(html);
}

$('#tasksInputField').val("");


function makeNewTask(){
    if($('#tasksInputField').val()!=""){
        selectedPlan.tasksArray.push(new Task($('#tasksInputField').val(),[],""));
    }
    $('#tasksInputField').val("");
    updateTaskList();
}

$('#tasksInputField').on('keypress',function(e){
    if(e.which==13){
        makeNewTask();
    }
});



$('#addTaskBtn').click(function(){
    makeNewTask();
});
var selectedTask;
var selectedTaskIndex;
function updateSelectedTask(a){
    var i = a.parent().html().slice(0,1);
    selectedTask= selectedPlan.tasksArray[i];
    selectedTaskIndex= i;
}
$(".workOnTaskScreen").hide();
$("#TaskListDisplayer").on("click",".task .startTaskBtn",function(){
    updateSelectedTask($(this));
    $(".taskName").html("Start working on: "+selectedTask.name);
    $(".workOnTaskScreen").show();
    updateAccomps(3);
    updateSubTaskList();
    $("#newPlanCreationScreen").hide();
});


$(".otherTaskBtn").click(function(){
    $(".workOnTaskScreen").hide();

    $("#newPlanCreationScreen").show();
});
$("#TaskListDisplayer").on("click",".task .makeGoalBtn",function(){
    updateSelectedTask($(this));
    if(!checkGoalAlready(selectedTask.name)){
        goalsArray.push(new Goal(selectedTask.name,"","",[],[]));
        $("#firstScreen").show();
        $("#newPlanCreationScreen").hide();
        $(".workOnTaskScreen").hide();
        updateGoalsList();
    }else{
        alert("you already have a goal named: "+selectedTask.name)
    }

});
$(".makeGoalBtn").click(function(){
    if(!checkGoalAlready(selectedTask)){
        goalsArray.push(new Goal(selectedTask,"","",[],[]));
        $("#firstScreen").show();
        $("#newPlanCreationScreen").hide();
        $(".workOnTaskScreen").hide();
        updateGoalsList();
    }else{
        alert("you already have a goal named: "+selectedTask)
    }
});
var interval="10 minutes";
function updateAccomps(i){
    if(i==1){goalsArray[selectedGoalIndex].accomplishments.push("finished: "+selectedTask.name);}
    else if(i==2){goalsArray[selectedGoalIndex].accomplishments.push("worked on"+selectedTask.name+" for "+ interval);}
    var html="";
    for(i=0;i<goalsArray[selectedGoalIndex].accomplishments.length;i++){
        html+="<div class'achievement'>"+i+" "+goalsArray[selectedGoalIndex].accomplishments[i]+"<button>delete</button></div><br>";
    }
    $(".accompPara").html(html);
}
$(".accompPara").on("click","button",function(){
    var i=$(this).parent().html().slice(0,1);
    goalsArray[selectedGoalIndex].accomplishments.splice(i,1);
    updateAccomps(3);
})
$(".doneBtn").click(function(){
        
    updateAccomps(1);
});


$("#TaskListDisplayer").on("click",".task .delTaskBtn",function(){
    updateSelectedTask($(this));
    selectedPlan.tasksArray.splice(selectedTaskIndex,1);
    updateTaskList();
});






$('#subTasksInputField').val("");
function updateSubTaskList(){
    var html="";
    for(i=0;i<selectedTask.subTaskArray.length;i++){
        html+="<div class='task'>"+i+". "+selectedTask.subTaskArray[i].name+ "<button class='TB startTaskBtn'>start</button><button class='TB delTaskBtn'>delete</button><button class='TB makeGoalBtn'>Make Goal</button></div><br></br>";
    }
    
    $(".subTasks").html(html);
}

function makeNewSubTask(){
    if($('#subTasksInputField').val()!=""){
        selectedTask.subTaskArray.push(new Task($('#subTasksInputField').val(),[],""));
    }
    $('#subTasksInputField').val("");
    updateSubTaskList();
}
$("#addSubTaskBtn").click(function(){makeNewSubTask();});
$('#subTasksInputField').on('keypress',function(e){
    if(e.which==13){
        makeNewSubTask();
    }
});



$(".addSubTaskButton").click(function(){
    makeNewSubTask();
});



$(".subTasks").on("click",".task .startTaskBtn",function(){
    updateSelectedSubTask($(this));
    $(".taskName").html("Start working on: "+selectedTask.name);
    $(".workOnTaskScreen").show();
    updateAccomps(3);
    updateSubTaskList();
    $("#newPlanCreationScreen").hide();
});
function updateSelectedSubTask(a){
    var i = a.parent().html().slice(0,1);
    selectedTask= selectedTask.subTaskArray[i];
    selectedTaskIndex= i;
}

$(".subTasks").on("click",".task .delTaskBtn",function(){
    var i = $(this).parent().html().slice(0,1);//know the index of the bad task
    selectedTask.subTaskArray.splice(i,1);//knowthe array //splice from array
    updateSubTaskList();
    // updateSelectedTask($(this));
    // selectedPlan.tasksArray.splice(selectedTaskIndex,1);
    // updateTaskList();
});

$(".subTasks").on("click",".task .makeGoalBtn",function(){
    updateSelectedSubTask($(this));
    if(!checkGoalAlready(selectedTask.name)){
        goalsArray.push(new Goal(selectedTask.name,"","",[],[]));
        $("#firstScreen").show();
        $("#newPlanCreationScreen").hide();
        $(".workOnTaskScreen").hide();
        updateGoalsList();
    }else{
        alert("you already have a goal named: "+selectedTask.name)
    }
});