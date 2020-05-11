const canvas = document.querySelector('#canvas');

// get weather Data from local storage
let getData = () => {
    let items = {
        ...localStorage
    }
    let processedData = []
    items = Object.values(items).forEach(e=> {
        processedData.push(JSON.parse(e))
    })
    return processedData
}
let data = getData();

console.log('get Data ',getData())

// Configurations
let leftGap = 80;
let rightGap = 80;
let bottomGap = -100;
let space = 50;  // space between horizontal lines
let y_Number = 9; // Number of horizontal lines
const weatherTypeDOM = [document.querySelector('#sunny'), document.querySelector('#cloudy'), // weather type images
    document.querySelector('#rain'),document.querySelector('#heavy_rain'),
    document.querySelector('#thunderstorm'), document.querySelector('#snow'), document.querySelector('#hail')
]
let month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

// modes
let fahrenheit = false;
let mpers = false; // wind: m/s
// transform data (celsius to fahrenheit and wind km/h to m/s)
const dataTransform = (par, wind, degrees) => {
    let newArr = [];
    if (par == "degrees"){
        degrees.forEach(e=> {
            if(e !== -999) newArr.push( parseInt( ( (e * 9/5) + 32).toFixed(0) ) )
            else newArr.push(-999)
        })
        fahrenheit = true;
        return newArr
    }
    if (par == "wind"){
        wind.forEach(e=> newArr.push( parseInt( (e*1000/3600).toFixed(0) ) ))
        mpers = true;
        return newArr
    }
}


// left and right sidebar numbers
const sideNumbersRange = (rangeArray, y_spaces) => {
    let min = Math.min(...rangeArray) - 1
    let max = Math.max(...rangeArray) + 1
    let positiveRange = parseInt( (Math.abs(max) / (y_spaces/2) ).toFixed(0) )
    let negativeRange = parseInt( (Math.abs(min) / (y_spaces/2) ).toFixed(0) )

    positiveRange = positiveRange == 0 ? 1: positiveRange
    negativeRange = negativeRange == 0 ? 1: negativeRange

    let middle = y_Number / 2 - 0.5;
    let newRangeArr = [];

    let rg = 0;
    newRangeArr.push(0)
    for (let i = 0; i < middle; i++) {
        rg = rg - negativeRange;
        newRangeArr.unshift(parseInt(rg))
    }
    newRangeArr[0] = newRangeArr[0] > min ? min.toFixed(0): newRangeArr[0]
    console.log('newRangeArr[0]', newRangeArr[0])
    rg = 0;
    for (let i = 0; i < middle; i++) {
        rg = rg + positiveRange;
        newRangeArr.push(parseInt(rg))
    }
    newRangeArr[newRangeArr.length-1] = newRangeArr.slice(-1)[0] < max ? max.toFixed(0): newRangeArr.slice(-1)[0]

    return newRangeArr
}

// renders canvas
let can = (degrees, date, wind, scaleChanges, defaultScale, weatherType, scale) => {

// Calculations
let x_Number = degrees.length; // number of vertical lines
let x_spaces = x_Number - 1;
let y_spaces = y_Number - 1;
let horLinesWidth = canvas.width - (leftGap + rightGap);
let verLinesHeight = y_Number*space + space;
let intervals = () => (canvas.width - (leftGap + rightGap) * 1.5) / x_spaces; // intervals between rightmost and leftmost lines
let closestNumber = (goal, rangeArr) => rangeArr.reduce((prev, curr) => (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev));


if (document.querySelector('#fahrenheit').checked == true)  degrees = dataTransform("degrees", wind, degrees) // transform degrees to fahrenheit
if (document.querySelector('#mpers').checked == true)  wind = dataTransform("wind", wind, degrees) // transform km/h to m/s

//console.log('wind, degrees ', wind, degrees)

let get_Y_position = (el, forWhatArr) => {
    let rangeArr = sideNumbersRange(forWhatArr, y_spaces);
    let _closestNumber = closestNumber(el, rangeArr);
    let indexOfClosest = rangeArr.indexOf(_closestNumber)
    let yPx = rangeArr.indexOf(_closestNumber) * space

    let increment = (nextValue) => { // how much should we increment when we get to the closest number
        let shortInterval = Math.abs(el - _closestNumber) // interval between closest numbers and element
        let longInterval = rangeArr[nextValue] - _closestNumber; // closest value minus next value
        let percentInLongInterval = shortInterval / longInterval;
        console.log(shortInterval, longInterval)
        return space * percentInLongInterval
    }

    if (_closestNumber == el) return bottomGap-yPx

    else if (el > _closestNumber) return bottomGap - yPx - increment(indexOfClosest+1)
    else if (el < _closestNumber) return bottomGap - yPx - increment(indexOfClosest-1)

}


// CANVAS -------------------------------------------------
let ctx = canvas.getContext('2d');
ctx.translate(0, canvas.height);

// main titles
ctx.font = '3rem Arial'
ctx.fillText(scale, canvas.width / 2 - 55, -verLinesHeight - 70) // top textline

ctx.rotate(-Math.PI / 2);
ctx.font = '1.5rem Arial'
ctx.fillText(`Degrees ${!fahrenheit ? 'C': 'F'}`, canvas.height / 2 - 100, 30) // left textline
ctx.rotate(Math.PI / 2);

ctx.rotate(Math.PI / 2);
ctx.fillText(`Wind ${!mpers ? 'km/h': 'm/s'}`, -canvas.height / 2 - 50, -canvas.width+30) // right textluine
ctx.rotate(-Math.PI / 2);


// Horizontal lines and numbers (dealing with Y)
ctx.beginPath();
ctx.strokeStyle = "#E9DADA";
ctx.font = '1rem Arial';

sideNumbersRange(degrees, y_spaces).forEach((x, i) => { // Drawing horizontal lines (Y) and numbers on the left
    ctx.moveTo(leftGap, bottomGap - i * space );
    ctx.lineTo(horLinesWidth + leftGap, bottomGap - i * space )
    ctx.stroke()
    ctx.fillText(x, leftGap - 30, bottomGap - i * space  + 4);
});

sideNumbersRange(wind, y_spaces).forEach((x, i) => { // numbers on the right
    ctx.fillStyle = "rgba(193, 103, 27, 0.7)"
    ctx.fillText(x, canvas.width - rightGap + 20, bottomGap - i * space  + 4);
});

ctx.beginPath();
ctx.strokeStyle = "rgb(97, 47, 5)"
ctx.lineWidth = "3"
ctx.moveTo(leftGap, -verLinesHeight / 2 - space ); // bold line for 0 in the center (Y)
ctx.lineTo(horLinesWidth + leftGap, -verLinesHeight / 2 - space )
ctx.stroke()


// Vertical lines (Dealing with X)
ctx.lineWidth = "1"
ctx.beginPath();  // vertical lines (X)
if(degrees[0] !== -999) ctx.strokeStyle = "#A27E7E"
else ctx.strokeStyle = "red"

ctx.moveTo(leftGap +leftGap / 2, bottomGap); // first left vertical line (X)
ctx.lineTo(leftGap +leftGap / 2, -verLinesHeight)
ctx.stroke()
ctx.fillText(date[0], leftGap +leftGap / 2 - 20, bottomGap + 30); //.slice(0,-5)

for (let i = 1; i < x_spaces; i++) {
    ctx.beginPath()
    if(degrees[i] !== -999) ctx.strokeStyle = "#A27E7E"
    else ctx.strokeStyle = "red"
    ctx.moveTo(leftGap +leftGap / 2 + i * intervals() , bottomGap);
    ctx.lineTo(leftGap +leftGap / 2 + i * intervals(), -verLinesHeight)
    ctx.stroke()

    ctx.fillText(date[i], 100 + i * intervals(), bottomGap + 30); // .slice(0,-5)
}

ctx.beginPath()
    if(degrees.slice(-1)[0] !== -999) ctx.strokeStyle = "#A27E7E"
    else ctx.strokeStyle = "red"
ctx.moveTo(canvas.width - rightGap  - rightGap / 2, bottomGap); // last right vertical line (X)
ctx.lineTo(canvas.width - rightGap - rightGap / 2, -verLinesHeight)
ctx.stroke()
ctx.fillText(date.slice(-1)[0], canvas.width - rightGap  - rightGap / 2 - 20, bottomGap + 30); // .slice(0, -5)


// Dealing with cale line on the bottom
ctx.beginPath()
ctx.fillStyle = "rgba(53, 53, 53, 0.7)"
ctx.strokeStyle = "rgba(53, 53, 53, 0.7)"
ctx.lineWidth = "3"
ctx.moveTo(leftGap, bottomGap + 50); // last right vertical line (X)
ctx.lineTo(canvas.width - rightGap, bottomGap + 50)
ctx.stroke()

if (scaleChanges && scaleChanges.length !== 0) {
    scaleChanges.forEach(el => {
        if(el.index !== 0){
            ctx.moveTo(leftGap + leftGap /2 + el.index * intervals() - intervals() / 2, bottomGap + 60);
            ctx.lineTo(leftGap + leftGap /2 + el.index * intervals() - intervals() / 2, bottomGap + 40);
            ctx.fillText(el.prvValue, leftGap + leftGap /2 + el.index * intervals() - intervals() / 2 - 45, bottomGap + 70);
            ctx.fillText(el.Nxtvalue, leftGap + leftGap /2 + el.index * intervals() - intervals() / 2 + 10, bottomGap + 70);
        } else{
            ctx.moveTo(leftGap + leftGap /2 + intervals() / 2, bottomGap + 60);
            ctx.lineTo(leftGap + leftGap /2 + intervals() - intervals() / 2, bottomGap + 40)
            ctx.fillText(el.prvValue, leftGap + leftGap /2 + el.index * intervals() + intervals() / 2 - 45, bottomGap + 70);
            ctx.fillText(el.Nxtvalue, leftGap + leftGap /2 + el.index * intervals() + intervals() / 2 + 10, bottomGap + 70);
        }
        ctx.stroke()
    })
} else if (defaultScale && defaultScale !== "yearMode") {
    ctx.fillText(defaultScale, canvas.width / 2 - 40, bottomGap + 70);
}

// Dealing with degrees and wind point (Y) Rendering Data -----------------
// wind points
degrees.forEach((x, i)=> {  // wind triangles
    ctx.beginPath() 
    ctx.fillStyle = "rgba(193, 103, 27, 0.56)"
    ctx.lineWidth = "1"

    if(degrees[i] !== -999){
        ctx.fillRect(leftGap+leftGap / 2 + intervals() * i - (intervals() / 8 / 2), -verLinesHeight/2 - space, intervals() / 8, (get_Y_position(wind[i], wind) - bottomGap) + verLinesHeight/2 - space )
        if(wind[i] == 0) ctx.fillRect(leftGap+leftGap / 2 + intervals() * i - (intervals() / 8 / 2), -verLinesHeight/2 - space, intervals() / 8, (get_Y_position(wind[i], wind) - bottomGap) + verLinesHeight/2 - space - 10 )
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = "rgba(53, 53, 53, 1)"
        ctx.font="1.2em Arial"
        ctx.fillText(wind[i], leftGap+leftGap / 2 + intervals() * i - (intervals() / 8 / 2), -verLinesHeight/2 - space +25);
    }
})

// Degrees Points
ctx.strokeStyle = "rgba(53, 53, 53, 0.8)"
degrees.forEach((x, i)=> {
    ctx.beginPath() 
    ctx.fillStyle = "rgba(53, 53, 53, 1)"
    ctx.lineWidth = "1"
    if(degrees[i] == -999){
        ctx.fillStyle = "red";
        ctx.font = "1.3rem Arial"
        ctx.fillText('N/D', leftGap+leftGap / 2 + intervals() * i - 15, -verLinesHeight-20);
    }else{
        ctx.arc(leftGap+leftGap / 2 + intervals() * i, get_Y_position(degrees[i], degrees), 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        //ctx.fillStyle = "white"
        ctx.font="1.5em Arial"
        ctx.fillText(degrees[i], leftGap+leftGap / 2 + intervals() * i + 5, get_Y_position(degrees[i], degrees) -15);
        ctx.drawImage(weatherTypeDOM[weatherType[i]], 100 + i * intervals(), -verLinesHeight - 50, 40, 40);

        ctx.beginPath()  // Points
        ctx.fillStyle = "rgba(53, 53, 53, 0.7)"
        ctx.lineWidth = "7"
        ctx.moveTo(leftGap+leftGap / 2 + intervals() * i, get_Y_position(degrees[i], degrees));
        if(degrees[i+1] !== -999){
            ctx.lineTo(leftGap+leftGap / 2 + intervals() * (i+1), get_Y_position(degrees[i+1], degrees))
        } else{
            //ctx.lineTo(leftGap*2 + intervals() * (i+2), points_position(arr[i+2]))
        }
        ctx.stroke();

        // canvas.addEventListener('mousemove', e=>{
        //     //submitDataHandler()
                console.log('mousemove')
        // })
    }
})

}
// END OF CANVAS RENDRING FUNCTION



// Dealing with canvas Rendering
const canvasRender = (degrees, date, wind, scaleChanges, defaultScale, weathertype, scale) => {
    canvas.width = window.innerWidth - window.innerWidth * 0.2;

    can(degrees, date, wind, scaleChanges, defaultScale, weathertype, scale);
}

// returns mode numbers of sent array
const countMode = (numbers) => {
    var modes = [], count = [], i, number, maxIndex = 0;
 
    for (i = 0; i < numbers.length; i += 1) {
        number = numbers[i];
        count[number] = (count[number] || 0) + 1;
        if (count[number] > maxIndex) {
            maxIndex = count[number];
        }
    }
 
    for (i in count)
        if (count.hasOwnProperty(i)) {
            if (count[i] === maxIndex) {
                modes.push(Number(i));
            }
        }
 
    return modes;
}

// Calculating scale
const submitDataHandler = (e) => {
    if(e) e.preventDefault();
    let getDate = {
        start:new Date(document.querySelector('#startDate').value),
        end: new Date(document.querySelector('#endDate').value)
    }
    let startDate = {
        fullValue: getDate.start,
        year: getDate.start.getFullYear(),
        month: getDate.start.getMonth(),
        day: getDate.start.getDate(),
        week: getDate.start.getDay()
    }
    let endDate = {
        fullValue: getDate.end,
        year: getDate.end.getFullYear(),
        month: getDate.end.getMonth(),
        day: getDate.end.getDate(),
        week: getDate.end.getDay()
    }
    data = getData(); // update new values from localStorage? returns object

    document.querySelector('#dateInformation').innerHTML =`<h2>${startDate.fullValue.toLocaleDateString()}
     - ${endDate.fullValue.toLocaleDateString()}</h2>` // shows date range


    let startDateFull_inDays = (startDate.year  * 12 * 30) + (startDate.month * 30) + startDate.day;
    let enDateFull_inDays = (endDate.year  * 12 * 30 ) + (endDate.month * 30 ) + endDate.day;

    let diff = enDateFull_inDays - startDateFull_inDays + 1

    console.log( diff)

    let insertedDataArr = [startDate]

    let degrees = [];
    let wind = [];
    let date = [];
    let scaleChanges = [];
    let defaultScale;
    let nextDay = startDate.fullValue;
    let results = [];
    let counter = 0;
    let average_degrees = [];
    let average_wind = [];
    let arrMode = [];
    let weathertype = [];
    let countedMode = [];

    // get every inserted day
    for (let i = 1; i < diff; i++) {
        nextDay = new Date(nextDay.getTime() + (24 * 60 * 60 * 1000))

        insertedDataArr.push({
            year: nextDay.getFullYear(),
            month: nextDay.getMonth(),
            day: nextDay.getDate(),
            week: nextDay.getDay()
        })
    }

    // check which data we have in database. It will be inserted in results
    insertedDataArr.forEach((el, i) => {
        let foundSmth = false
        data.forEach((e,i) => {
            if( e.date.year == el.year && e.date.month == el.month && e.date.day == el.day) {
                results.push(e)
                foundSmth = true
            }
        })
        if (!foundSmth) results.push({
            degree: -999,
            wind: -999,
            date: el
        })
    })

    let currecntMonth = insertedDataArr[0].month;


// ----------------------------------------------------------------- DAYS --------------

    if (diff <= 15) {

        results.forEach(e=> {
            degrees.push(e.degree)
            wind.push(e.wind)
            date.push(`${e.date.month}/${e.date.day}`)
            weathertype.push(e.type)

            if (e.date.month !== currecntMonth) {
                currecntMonth++
                scaleChanges.push({
                    index: counter,
                    prvValue: month[e.date.month - 1],
                    Nxtvalue: month[e.date.month]
                })
            }
            counter++
        })

        defaultScale = month[currecntMonth]
        console.log('defaultScale', defaultScale)

        canvasRender(degrees, date, wind, scaleChanges, defaultScale, weathertype, scale="Days")
    }

    // --------------------------------------------------------------- WEEKS ----------------------
    else if(diff <= 80) {

        results.forEach((e, idx)=> {

            if(e.date.week == 6 || idx === results.length - 1) {
                if(e.degree !== -999) {
                    average_degrees.push( e.degree)
                    average_wind.push(e.wind)
                    arrMode.push(e.type)
                }
                let av, avW;
                if(average_degrees.length !== 0) {
                    av = average_degrees.reduce( (a,b) => a+b ) / average_degrees.length
                    avW = average_wind.reduce( (a,b) => a+b ) / average_degrees.length
                    console.log('avW ',avW)

                    degrees.push(av.toFixed(1))
                    wind.push(avW.toFixed(1))
                    countedMode.push(countMode(arrMode)[0])
                } else {
                    degrees.push(-999)
                    wind.push(-999)
                    countedMode.push(0)
                }
                date.push(`${e.date.month}/${e.date.day}`)
                average_degrees = [];
                average_wind = [];


                if (e.date.month !== currecntMonth) {
                    currecntMonth++
                    scaleChanges.push({
                        index: counter,
                        prvValue: month[e.date.month == 0 ? 11 : e.date.month - 1],
                        Nxtvalue: month[e.date.month]
                    })
                }
                counter++
            }
            else if(e.degree !== -999) {
                average_degrees.push(e.degree)
                average_wind.push(e.wind)
                arrMode.push(e.type)
            }
        })

        defaultScale = month[currecntMonth]

        canvasRender(degrees, date, wind, scaleChanges, defaultScale, countedMode, scale="Weeks")

    }
 // ------------------------------------------------------------------------------- MONTHS -------
    else if(diff <= 400){

        let currecntYear = results[0].date.year;
        results.forEach((e, idx)=> {
            if(e.date.month !== currecntMonth || idx === results.length - 1) {
                if(e.degree !== -999) {
                    average_degrees.push( e.degree)
                    average_wind.push(e.wind)
                    arrMode.push(e.type)
                }
                let av, avW;
                if(average_degrees.length !== 0) {
                    av = average_degrees.reduce( (a,b) => a+b ) / average_degrees.length
                    avW = average_wind.reduce( (a,b) => a+b ) / average_degrees.length
                    degrees.push(av.toFixed(1))
                    wind.push(avW.toFixed(1))
                    countedMode.push(countMode(arrMode)[0])
                } else {
                    degrees.push(-999)
                    wind.push(-999)
                    countedMode.push(0)
                }
                date.push(`${month[currecntMonth]}`)
                console.log('currecntMonth', currecntMonth)
                average_degrees = [];
                average_wind = [];

                //currecntMonth++
                if(currecntMonth == 11) currecntMonth = 0
                else currecntMonth++


                if (e.date.year !== currecntYear) {
                    currecntYear++
                    scaleChanges.push({
                        index: counter + 1,
                        prvValue: e.date.year - 1,
                        Nxtvalue: e.date.year
                    })
                }
                counter++
            }
            else if(e.degree !== -999) {
                average_degrees.push(e.degree)
                average_wind.push(e.wind)
                arrMode.push(e.type)
            }
        })

        defaultScale = currecntYear

        canvasRender(degrees, date, wind, scaleChanges, defaultScale, countedMode, scale="Months")

        console.log(date)

    }

// ---------------------------------------------------------------------------------------- YEAR ----------------
    else if(diff > 400){

        let yearNumber = results[0].date.year;
        results.forEach((e, idx)=> {
            if(e.date.year !== yearNumber || idx === results.length - 1) { //|| idx === results.length - 1
                if(e.degree !== -999) {
                    average_degrees.push( e.degree)
                    average_wind.push(e.wind)
                    arrMode.push(e.type)
                }
                let av, avW;
                if(average_degrees.length !== 0) {
                    av = average_degrees.reduce( (a,b) => a+b ) / average_degrees.length
                    avW = average_wind.reduce( (a,b) => a+b ) / average_degrees.length
                    degrees.push(av.toFixed(1))
                    wind.push(avW.toFixed(1))
                    countedMode.push(countMode(arrMode)[0])
                } else {
                    degrees.push(-999)
                    wind.push(-999)
                    countedMode.push(0)
                }
                date.push(`${idx === results.length - 1 ? e.date.year : e.date.year - 1}`)
                average_degrees = [];
                average_wind = [];
                //if(yearNumber == 11) yearNumber = 0
                //else yearNumber++
                yearNumber++
            }
            else if(e.degree !== -999) {
                average_degrees.push(e.degree)
                average_wind.push(e.wind)
                arrMode.push(e.type)
            }
        })

        let defaultScale = 'yearMode';

        canvasRender(degrees, date, wind, scaleChanges = [], defaultScale, countedMode, scale="Years")

        console.log(results)

    }
}

 document.querySelector('#submitDate').addEventListener('submit', submitDataHandler)

window.addEventListener('resize', () => submitDataHandler )

window.onload = () => submitDataHandler()