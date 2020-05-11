let windValue = (value) => {
    console.log('run')
    document.querySelector('#windValue').innerHTML = `<h2>${value} km/h</h2>`
}

document.querySelector('#saveForm').addEventListener('submit', e=> {
    e.preventDefault()

    let weatherTypes = ['sunny', 'cloudy', 'rain', 'heavy_rain', 'thunderstorm', 'snow', 'hail']

    let newData = {
        degree: parseInt(e.target[0].value),
        wind: parseInt(e.target[1].value),
        type: weatherTypes.indexOf(e.target[3].value),
        date: {
            year: parseInt( e.target[2].value.split('-')[0] ),
            month: parseInt( e.target[2].value.split('-')[1] - 1),
            day: parseInt( e.target[2].value.split('-')[2] ),
            week: new Date(e.target[2].value).getDay()
        }
    }
    
    localStorage.setItem(e.target[2].value, JSON.stringify(newData))

    console.log('e.target[3].value ', e.target[3].value)
})