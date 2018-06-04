import React from 'react';
import 'react-week-calendar';
import 'react-week-calendar/dist/style.css';
import WeekCalendar from 'react-week-calendar/dist/WeekCalendar';
import moment from 'moment';
const Calendar = (props) => {
    console.log(props.schedule);
    let selectedIntervals = [];
    if(props.schedule != null && props.schedule.constructor === Array ) {
         props.schedule.forEach(section => {
            let startTimeHr = null;
            let startTimeMin = null;
            let endTimeHr = null;
            let endTimeMin = null;
            if(section.startingTime < 1000) {
                startTimeHr=parseInt(section.startingTime.toString().substring(0,1));
                startTimeMin=parseInt(section.startingTime.toString().substring(1,3));

            } else {
                startTimeHr=section.startingTime.toString().substring(0,2);
                startTimeMin=parseInt(section.startingTime.toString().substring(2,4));
            }
            if(section.endingTime < 1000) {
                endTimeHr=parseInt(section.endingTime.toString().substring(0,1));
                endTimeMin=parseInt(section.endingTime.toString().substring(1,3));
            } else {
                endTimeHr=parseInt(section.endingTime.toString().substring(0,2));
                endTimeMin=parseInt(section.endingTime.toString().substring(2,4));
            }
            let value = section.courseID;
            
            /*
            
            console.log("========================")
            console.log(section.startingTime);
            console.log(section.endingTime);
            console.log(startTimeHr);
            console.log(startTimeMin);
            console.log(endTimeHr)
            console.log(endTimeMin)
            */
            section.day.forEach(day =>{
                let interval = {
                    start: moment({h: startTimeHr, m: startTimeMin}),
                    end: moment({h: endTimeHr, m: endTimeMin}),
                    value: value,
                }
                interval.start.add(day, 'd');
                interval.end.add(day, 'd');
                selectedIntervals.push(interval);
            });
            

    })}
    let calendar = null;
        calendar = <div  style={{width: '78vw', height: '42vh', backgroundColor: '#789'}}>
                        <button onClick={props.displayCalendarHandler} style={{marginLeft:'-39vw', position:'absolute', float:'left', height:'4vh', width:'4vw', marginTop:'-4vh', backgroundColor: '#49B', color: 'lightgrey', borderColor: '#49B', fontSize:'.7vw'}}>Calendar</button>
                        <WeekCalendar numberOfDays={7} startTime={moment({h:8, m:0})} endTime={moment({h:23, m:0})} scaleUnit={15} cellHeight={15} selectedIntervals={selectedIntervals}/>        
                    </div>
    
    return calendar;   

}

export default Calendar;



