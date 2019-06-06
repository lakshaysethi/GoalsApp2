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


function Goal(what,whatDetails,why,plansArray){
    this.what=what;
    this.whatDetails=whatDetails;
    this.why = why;
    this.plansArray= plansArray;
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
        goalsArray.push(new Goal(what,"","",[]));
        
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

function Task() {

}



var selectedPlanTaskArray;
var selectedPlan;

function makeNewPlan(){
    var i= goalsArray[selectedGoalIndex].plansArray.length+1;
    selectedPlanTaskArray=[];
    selectedPlan = new Plan(selectedPlanTaskArray,goalsArray[selectedGoalIndex].what+" Plan "+i)
    goalsArray[selectedGoalIndex].plansArray.push(selectedPlan);
}

function showSelectedPlan(){
    $(".selectedPlan").html(selectedPlan.name);
    
}
//merge goal

