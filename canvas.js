const canvas = document.querySelector('#canvas');

let can = (arr, date, wind) => {

// Configurations
let leftGap = 50;
let rightGap = 50;
let bottomGap = -100;
let space = 50;  // space between horizontal lines
let y_Number = 8; // Number of horizontal lines
//let arr = arr; // arr with weather data
let font_numbers = "1rem Arial"


// Calculations
let x_Number = arr.length; // number of vertical lines
let x_spaces = x_Number - 1;
let y_spaces = y_Number - 1;
let horLinesWidth = canvas.width - (leftGap + rightGap);
let verLinesHeight = y_Number*space + space;
let intervals = () => (canvas.width - (leftGap + rightGap) * 2) / x_spaces; // intervals between rightmost and leftmost lines
let closestNumber = (goal, rangeArr) => rangeArr.reduce((prev, curr) => (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev));

const rangeOfDegrees = () => { // Returns a range of degrees which are placed on the left of the horizontal lines
    let min = Math.min(...arr)
    let max = Math.max(...arr)
    let range = Math.abs(max - min) / y_spaces

    let rangeArr = [];
    for (let i = 0; i < y_Number; i++) {
        let rg = min + range * i
        rangeArr.push(parseInt(rg.toFixed(0)))
    }

    return rangeArr
}

const points_position = (el) => { // get Y position of degrees on canvas
    let rangeArr = rangeOfDegrees();
    let _closestNumber = closestNumber(el, rangeArr);
    let indexOfClosest = rangeArr.indexOf(_closestNumber)
    let yPx = rangeArr.indexOf(_closestNumber) * space

    let increment = (nextValue) => {
        let shortInterval = Math.abs(el - _closestNumber) // interval between closest numbers and element
        let longInterval = rangeArr[nextValue] - _closestNumber; // closest value minus next value
        let percentInLongInterval = shortInterval / longInterval;
        console.log(shortInterval, longInterval)
        return space * percentInLongInterval
    }

    if (_closestNumber == el) return (Math.abs(bottomGap)+yPx) * -1
    
    else if (el > _closestNumber) return -(Math.abs(bottomGap)+yPx+ increment(indexOfClosest+1)  )
    else if (el < _closestNumber) return -(Math.abs(bottomGap)+yPx+  increment(indexOfClosest-1)  )

}




// CANVAS -------------------------------------------------

let ctx = canvas.getContext('2d');
ctx.translate(0, canvas.height);

ctx.beginPath(); // Horizontal lines (Y)
ctx.strokeStyle = "#E9DADA";

rangeOfDegrees().forEach((x, i) => { // Drawing horizontal lines (Y) and numbers
    ctx.moveTo(leftGap, bottomGap - i * space );
    ctx.lineTo(horLinesWidth + leftGap, bottomGap - i * space )
    ctx.stroke()

    ctx.font = font_numbers;
    ctx.fillText(x, leftGap - 30, bottomGap - i * space  + 4);
});


ctx.beginPath();  // vertical lines (X)
ctx.strokeStyle = "#A27E7E"

ctx.moveTo(leftGap * 2, bottomGap); // first left vertical line (X)
ctx.lineTo(leftGap * 2, -verLinesHeight)
ctx.stroke()
ctx.fillText(date[0], leftGap * 2 - 20, bottomGap + 30); //.slice(0,-5)

for (let i = 1; i < x_spaces; i++) {
    ctx.moveTo(100 + i * intervals() , bottomGap);
    ctx.lineTo(100 + i * intervals(), -verLinesHeight)
    ctx.stroke()

    ctx.fillText(date[i], 100 + i * intervals(), bottomGap + 30); // .slice(0,-5)
}

ctx.moveTo(canvas.width - rightGap  * 2, bottomGap); // last right vertical line (X)
ctx.lineTo(canvas.width - rightGap * 2, -verLinesHeight)
ctx.stroke()
ctx.fillText(date.slice(-1)[0], canvas.width - rightGap  * 2 - 20, bottomGap + 30); // .slice(0, -5)


ctx.strokeStyle = "rgba(53, 53, 53, 0.8)"
arr.forEach((x, i)=> {
    ctx.beginPath()  // Points
    ctx.fillStyle = "rgba(53, 53, 53, 1)"
    ctx.lineWidth = "1"
    if(arr[i] == -10){
        ctx.fillStyle = "red";
        ctx.fillText('N/D', leftGap*2 + intervals() * i - 10, bottomGap - space*(y_Number / 2));
    }else{
        ctx.arc(leftGap*2 + intervals() * i, points_position(arr[i]), 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        ctx.beginPath()  // Points
        ctx.fillStyle = "rgba(53, 53, 53, 0.7)"
        ctx.lineWidth = "7"
        ctx.moveTo(leftGap*2 + intervals() * i, points_position(arr[i]));
        if(arr[i+1] !== -10){
            ctx.lineTo(leftGap*2 + intervals() * (i+1), points_position(arr[i+1]))
        } else{
            //ctx.lineTo(leftGap*2 + intervals() * (i+2), points_position(arr[i+2]))
        }
        ctx.stroke();
    }
})


}


// let arr = [1,2,3,4,5]
let data = {
    degrees: [1,2,3,4,5],
    dateDays:[]
}

let data2 = [
    {
        degree: -1,
        wind: 2,
        date: {
            year: 2020,
            month: 3,
            day: 30,
            week: 4
        }
    },
    {
        degree: 1,
        wind: 2,
        date: {
            year: 2020,
            month: 4,
            day: 1,
            week: 5
        }
    },
    // {
    //     degree: 2,
    //     wind: 2,
    //     date: {
    //         year: 2020,
    //         month: 4,
    //         day: 2,
    //         week: 6
    //     }
    // },
    {
        degree: 3,
        wind: 2,
        date: {
            year: 2020,
            month: 4,
            day: 3,
            week: 0
        }
    },
    {
        degree: 5,
        wind: 2,
        date: {
            year: 2020,
            month: 4,
            day: 4,
            week: 1
        }
    },
    {
        degree: 10,
        wind: 2,
        date: {
            year: 2020,
            month: 4,
            day: 5,
            week: 2
        }
    }
]



// Canvas resizing  ------------------------------------
const canvasRender = (degrees, date, wind) => {
    canvas.width = window.innerWidth - window.innerWidth * 0.2;
    
    can(degrees, date, wind);
}

document.querySelector('#updateBtn').addEventListener('click', e => {
    e.preventDefault();
    data.degrees.push(7);
    console.log(data.degrees)
    canvasRender()
})

 document.querySelector('#submitDate').addEventListener('submit', e=> {
    e.preventDefault();
    let startDate = new Date(document.querySelector('#startDate').value)
    let endDate = new Date(document.querySelector('#endDate').value)
    let stDate = {
        year: startDate.getFullYear(),
        month: startDate.getMonth(),
        day: startDate.getDate()
    }
    let enDate = {
        year: endDate.getFullYear(),
        month: endDate.getMonth(),
        day: endDate.getDate()
    }
    let startDateFull = (stDate.year  * 12 * 30) + (stDate.month * 30) + stDate.day;
    let enDateFull = (enDate.year  * 12 * 30 ) + (enDate.month * 30 ) + enDate.day;

    let diff = enDateFull - startDateFull + 1

    console.log( diff)

    let insertedDataArr = [{
        year: startDate.getFullYear(),
        month: startDate.getMonth(),
        day: startDate.getDate(),
        week: startDate.getDay()
    }]

    console.log('incersted date ', insertedDataArr)

    if (diff <= 15) {
        //[startDate.toLocaleDateString("en-US")]

        //data.dateDays = []
        //data.dateDays.push(("0" + startDate.getDate()).slice(-2))
        let nextDay = startDate;
        
        for (let i = 1; i < diff; i++) {
            nextDay = new Date(nextDay.getTime() + (24 * 60 * 60 * 1000))
            //data.dateDays.push( ("0" + nextDay.getDate()).slice(-2) )

            insertedDataArr.push({
                year: nextDay.getFullYear(),
                month: nextDay.getMonth(),
                day: nextDay.getDate()
            })  //(nextDay.toLocaleDateString("en-US"));            
        }
        
        let results = []

        insertedDataArr.forEach((el, i) => {
            let foundSmth = false
            data2.forEach((e,i) => {
                if( e.date.year == el.year && e.date.month == el.month && e.date.day == el.day) {
                    results.push(e)
                    foundSmth = true
                }
                //else results.push('no data')
                console.log(el, e)
            })
            if (!foundSmth) results.push({
                degree: -10,
                wind: 0,
                date: el
            })
        })

        let degrees = []
        let wind = []
        let date = []

        results.forEach(e=> degrees.push(e.degree))
        results.forEach(e=> wind.push(e.wind))
        results.forEach(e=> date.push(`${e.date.month}/${e.date.day}/${e.date.year}`))

        if (results.length == 0) return alert('There is no Data or input is incorrect')

        canvasRender(degrees, date, wind)

        //console.log('1 option results >>> ',results)
    }
    else if(diff <= 80){
        // let insertedDataArr = [{
        //     year: startDate.getFullYear(),
        //     week: startDate.getDay(),
        //     month: startDate.getMonth(),
        //     day: startDate.getDate(),
        // }]


        let nextDay = startDate;
        
        for (let i = 1; i < diff; i++) {
            nextDay = new Date(nextDay.getTime() + (24 * 60 * 60 * 1000))
            //data.dateDays.push( ("0" + nextDay.getDate()).slice(-2) )

        insertedDataArr.push({
                year: nextDay.getFullYear(),
                month: nextDay.getMonth(),
                day: nextDay.getDate(),
                week: nextDay.getDay()
            })  //(nextDay.toLocaleDateString("en-US"));            
        }

        let results = []

        insertedDataArr.forEach((el, i) => {
            let foundSmth = false
            data2.forEach((e,index) => {
                if( e.date.year == el.year && e.date.month == el.month && e.date.day == el.day) {
                    results.push(e)
                    foundSmth = true
                }
                //else results.push('no data')
                //console.log(el, e)
            })
            if (!foundSmth) results.push({
                degree: -10,
                wind: 0,
                date: el
            })
        })

        let degrees = []
        let wind = []
        let date = []

        let average_degrees = [];
        results.forEach(e=> {
            // console.log(average_degrees)
            if(e.date.week == 6) {
                //console.log('week = 6')
                if(e.degree !== -10) average_degrees.push( e.degree)
                let av;
                if(average_degrees.length !== 0) {
                    av = average_degrees.reduce( (a,b) => a+b ) / average_degrees.length
                    degrees.push(av)
                } else degrees.push(-10)
                date.push(`${e.date.month}/${e.date.day}/${e.date.year}`)
                average_degrees = [];
            }
            else if(e.degree !== -10) {
                average_degrees.push(e.degree)
            }
            //console.log(average_degrees)
        })

        canvasRender(degrees, date)

        console.log(date)

    }
 // ------------------------------------------------------------------------------- MONTHS -------
    else if(diff <= 400){

        let nextDay = startDate;
        
        for (let i = 1; i < diff; i++) {
            nextDay = new Date(nextDay.getTime() + (24 * 60 * 60 * 1000))
            //data.dateDays.push( ("0" + nextDay.getDate()).slice(-2) )

        insertedDataArr.push({
                year: nextDay.getFullYear(),
                month: nextDay.getMonth(),
                day: nextDay.getDate(),
                week: nextDay.getDay()
            })  //(nextDay.toLocaleDateString("en-US"));            
        }

        let results = []

        insertedDataArr.forEach((el, i) => {
            let foundSmth = false
            data2.forEach((e,index) => {
                if( e.date.year == el.year && e.date.month == el.month && e.date.day == el.day) {
                    results.push(e)
                    foundSmth = true
                }
            })
            if (!foundSmth) results.push({
                degree: -10,
                wind: 0,
                date: el
            })
        })

        let degrees = []
        let wind = []
        let date = []

        let month = new Array();
            month[0] = "January";
            month[1] = "February";
            month[2] = "March";
            month[3] = "April";
            month[4] = "May";
            month[5] = "June";
            month[6] = "July";
            month[7] = "August";
            month[8] = "September";
            month[9] = "October";
            month[10] = "November";
            month[11] = "December";

        let monthNumber = results[0].date.month;
        let average_degrees = [];
        results.forEach(e=> {
            // console.log(average_degrees)
            if(e.date.month !== monthNumber) {
                //console.log('week = 6')
                if(e.degree !== -10) average_degrees.push( e.degree)
                let av;
                if(average_degrees.length !== 0) {
                    av = average_degrees.reduce( (a,b) => a+b ) / average_degrees.length
                    degrees.push(av)
                } else degrees.push(-10)
                date.push(`${month[monthNumber]}`)
                average_degrees = [];
                if(monthNumber == 11) monthNumber = 0
                else monthNumber++
            }
            else if(e.degree !== -10) {
                average_degrees.push(e.degree)
            }
            //console.log(average_degrees)
        })

        canvasRender(degrees, date)

        console.log(date)

    }

// ---------------------------------------------------------------------------------------- YEAR ----------------
    else if(diff > 400){ 

        let nextDay = startDate;
        
        for (let i = 1; i < diff; i++) {
            nextDay = new Date(nextDay.getTime() + (24 * 60 * 60 * 1000))
            //data.dateDays.push( ("0" + nextDay.getDate()).slice(-2) )

        insertedDataArr.push({
                year: nextDay.getFullYear(),
                month: nextDay.getMonth(),
                day: nextDay.getDate(),
                week: nextDay.getDay()
            })  //(nextDay.toLocaleDateString("en-US"));            
        }

        let results = []

        insertedDataArr.forEach((el, i) => {
            let foundSmth = false
            data2.forEach((e,index) => {
                if( e.date.year == el.year && e.date.month == el.month && e.date.day == el.day) {
                    results.push(e)
                    foundSmth = true
                }
            })
            if (!foundSmth) results.push({
                degree: -10,
                wind: 0,
                date: el
            })
        })

        let degrees = []
        let wind = []
        let date = []

        let yearNumber = results[0].date.year;
        let average_degrees = [];
        results.forEach(e=> {
            // console.log(average_degrees)
            if(e.date.year !== yearNumber) {
                //console.log('week = 6')
                if(e.degree !== -10) average_degrees.push( e.degree)
                let av;
                if(average_degrees.length !== 0) {
                    av = average_degrees.reduce( (a,b) => a+b ) / average_degrees.length
                    degrees.push(av)
                } else degrees.push(-10)
                date.push(`${e.date.month}/${e.date.day}/${e.date.year - 1}`)
                average_degrees = [];
                if(yearNumber == 11) yearNumber = 0
                else yearNumber++
            }
            else if(e.degree !== -10) {
                average_degrees.push(e.degree)
            }
            //console.log(average_degrees)
        })

        canvasRender(degrees, date)

        console.log(date)

    }
 })

window.addEventListener('resize', () => canvasRender(degrees = [0,0], date=['05/01/2020', '05/02/2020'] ) )
window.onload = canvasRender(degrees = [0,0], date=['05/01/2020', '05/02/2020']);