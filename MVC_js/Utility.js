/* Functions to retrieve data from database */
var firebase = require("firebase");
var generator = require("./ScheduleGenerator")
let Section = require("./Section")
let ScheduledCourse = require("./ScheduledCourse")
let processSchedule = require("./ProcessSchedule");

var TO = "/";
var data;
var QUARTER = "F18"
var sections = ['0', '1', '2', '3', '4', '5', '6'];

// db setup
var config = {
    apiKey: "AIzaSyDHND3EVIe-S8r0k_3DLf_GClaM2qazGMI",
    authDomain: "trytonsplan.firebaseapp.com",
    databaseURL: "https://trytonsplan.firebaseio.com",
    projectId: "trytonsplan",
    storageBucket: "trytonsplan.appspot.com",
    messagingSenderId: "242589223564"
};

firebase.initializeApp(config);

function getData (CourseID, cb) {
    let reference = QUARTER + TO + CourseID;  //Get the reference of the data
    firebaseRef = firebase.database().ref(reference);
    retrieve(cb);
    /*firebaseRef.on("value", function(snapshot) {
        data = snapshot.val();
        end();
        cb (data);
    });*/
}

function getScheduleData (path, cb){
    firebaseRef = firebase.database().ref(path);
    retrieve(cb);
}


function retrieve(end) {
    firebaseRef.on("value", function(snapshot) {
        data = snapshot.val();
        end(data);
    });
}

/* End of database functions */



/* Get schedule function */
function getSchedule (courseIDList, dataSet) {
    let courseList = [];

    //Build the array of ScheduledCourse
    for (let j = 0; j < dataSet.length; j++){
        let courseData = dataSet[j];
        let k = 0;
        let sectionArr = [];
        while (courseData.hasOwnProperty(sections[k])){
            let secID = sections[k];
            let currSec = courseData[k];
            //console.log (currSec);
            sectionArr[k] = new Section(currSec.id, courseIDList[j], currSec.LE[0].start_time, currSec.LE[0].end_time, currSec.LE[0].day,
                                        currSec.LE[0].building, currSec.LE[0].professor, currSec.FI.start_time,
                                        currSec.FI.end_time, currSec.FI.date, currSec.DI);
            k++;
        }

        if (sectionArr.length > 0){
            courseList[j] = new ScheduledCourse(courseIDList[j], sectionArr);
        }
    }

    var scheduleList = generator(courseList);
    //console.log (scheduleList);

    for (let i = 0; i < 1; i++){
        processSchedule (scheduleList[i]);
    }
    return scheduleList;
}




/* Rank functions*/
/* All the ranking functions to rank a schedule list based on different criterion.*/

// rank by professor score
var rankByProfScore = function(scheduleList) {

    var len = scheduleList.length;
    return quickSortProfScore(scheduleList,0,len-1);
}

// rank by distance
var rankByDistance = function(scheduleList) {

    var len = scheduleList.length;
    return quickSortDistance(scheduleList,0,len-1);
}

// rank by time commitment
var rankByTimeCommitment = function(scheduleList) {

    var len = scheduleList.length;
    return quickSortTimeCommitment(scheduleList,0,len-1);
}

// rank by time in school
var rankByTimeUsage = function(scheduleList) {

    var len = scheduleList.length;
    return quickSortTimeUsage(scheduleList,0,len-1);
}

// rank by GPA
var rankByGPA = function(scheduleList) {

    var len = scheduleList.length;
    return quickSortGPA(scheduleList,0,len-1);
}

// quick sort function for professor score
function quickSortProfScore(list, left, right) {

    var pivot, partitionIndex;

    if(left < right) {
        pivot = right;
        partitionIndex = partitionProfScore(list, pivot, left, right);

        quickSortProfScore(list, left, partitionIndex - 1);
        quickSortProfScore(list, partitionIndex + 1, right);
    }

    return list;
}

// helper function for quick sort for professor score
function partitionProfScore(list, pivot, left, right) {
    var pivotValue = list[pivot].getProfScore,
        partitionIndex = left;

    for(var i = left; i < right; i++) {
        if(list[i].getProfScore > pivotValue) {
            swap(list, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(list,right,partitionIndex);
    return partitionIndex;
}

// quick sort function for distance
function quickSortDistance(list, left, right) {

    var pivot, partitionIndex;

    if(left < right) {
        pivot = right;
        partitionIndex = partitionDistance(list, pivot, left, right);

        quickSortDistance(list, left, partitionIndex - 1);
        quickSortDistance(list, partitionIndex + 1, right);
    }

    return list;
}

// helper function for quick sort for distance
function partitionDistance(list, pivot, left, right) {
    var pivotValue = list[pivot].getDistance,
        partitionIndex = left;

    for(var i = left; i < right; i++) {
        if(list[i].getDistance > pivotValue) {
            swap(list, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(list,right,partitionIndex);
    return partitionIndex;
}
// quick sort function for time commitment
function quickSortTimeCommitment(list, left, right) {

    var pivot, partitionIndex;

    if(left < right) {
        pivot = right;
        partitionIndex = partitionTimeCommitment(list, pivot, left, right);

        quickSortTimeCommitment(list, left, partitionIndex - 1);
        quickSortTimeCommitment(list, partitionIndex + 1, right);
    }

    return list;
}

// helper function for quick sort for time commitment
function partitionTimeCommitment(list, pivot, left, right) {
    var pivotValue = list[pivot].getTimeCommitment,
        partitionIndex = left;

    for(var i = left; i < right; i++) {
        if(list[i].getTimeCommitment > pivotValue) {
            swap(list, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(list,right,partitionIndex);
    return partitionIndex;
}

// quick sort function for time in school
function quickSortTimeUsage(list, left, right) {

    var pivot, partitionIndex;

    if(left < right) {
        pivot = right;
        partitionIndex = partitionTimeUsage(list, pivot, left, right);

        quickSortTimeUsage(list, left, partitionIndex - 1);
        quickSortTimeUsage(list, partitionIndex + 1, right);
    }

    return list;
}

// helper function for quick sort for time in school
function partitionTimeUsage(list, pivot, left, right) {
    var pivotValue = list[pivot].getTimeUsage,
        partitionIndex = left;

    for(var i = left; i < right; i++) {
        if(list[i].getTimeUsage > pivotValue) {
            swap(list, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(list,right,partitionIndex);
    return partitionIndex;
}

// quick sort function for GPA
function quickSortGPA(list, left, right) {

    var pivot, partitionIndex;

    if(left < right) {
        pivot = right;
        partitionIndex = partitionGPA(list, pivot, left, right);

        quickSortGPA(list, left, partitionIndex - 1);
        quickSortGPA(list, partitionIndex + 1, right);
    }

    return list;
}

// helper function for quick sort for GPA
function partitionGPA(list, pivot, left, right) {
    var pivotValue = list[pivot].getGPA,
        partitionIndex = left;

    for(var i = left; i < right; i++) {
        if(list[i].getGPA > pivotValue) {
            swap(list, i, partitionIndex);
            partitionIndex++;
        }
    }
    swap(list,right,partitionIndex);
    return partitionIndex;
}


// helper function for swap
function swap(list, i, j) {
    var temp = list[i];
    list[i] = list[j];
    list[j] = temp;
}

module.exports = {
    getData: getData,
    rankByProfScore: rankByProfScore,
    rankByDistance: rankByDistance,
    rankByTimeCommitment: rankByTimeCommitment,
    rankByTimeUsage: rankByTimeUsage,
    rankByGPA: rankByGPA,
    getSchedule: getSchedule,
    getScheduleData: getScheduleData
};

//module.exports = getData;