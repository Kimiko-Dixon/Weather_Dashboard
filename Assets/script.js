
const searchBar = $('#search-bar');
const submitButton = $('#submit-button');
const currentForecast = $('#current-forecast');
const fiveDayForecast = $('#display-5-day-forecast')
const searchHistory = $('#search-history')

const searchArray = JSON.parse(localStorage.getItem('history')) || []


function setCoordinates(event)
{
    event.preventDefault();
    console.log(event)
    let search;
    currentForecast.empty()
    fiveDayForecast.empty() 

    if (event.target.id === 'submit-button')
    {
        search = searchBar.val()  
    }
    else
    {
        search = event.target.innerText
    }
    // finish url from search in search bar and call getForecast(url)
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${search}&units=imperial&appid=7121d6ca09d4658288ef53c29a232677`;
    getForcast(url)
    
}


function displayTodaysForcast(today, cityName)
{
    
    const iconCode = today.weather[0].icon;
    const icon =`https://openweathermap.org/img/wn/${iconCode}@2x.png`

    const todaysForecast = $('<div>')
    const nameDateIcon = $('<p>')
    const weather = $('<img>')
    const temperature = $('<p>')
    const windSpeed = $('<p>')
    const humidity = $('<p>')

    weather.attr('src', icon)
    weather.attr('style', 'max-width: 10%; height: auto;')
    nameDateIcon.text(`${cityName} ${dayjs().format('MM/DD/YYYY')}`)
    temperature.text(`Temp: ${today.main.temp}°F`)
    windSpeed.text(`Wind: ${today.wind.speed} MPH`)
    humidity.text(`Humidity: ${today.main.humidity} %`)

    nameDateIcon.attr('style', 'font-weight: bold; font-size: 1.5em; margin-bottom: 0')

    nameDateIcon.append(weather)
    todaysForecast.append(nameDateIcon)
    todaysForecast.append(temperature)
    todaysForecast.append(windSpeed)
    todaysForecast.append(humidity)

    currentForecast.append(todaysForecast)

}

function display5DayForcast(fiveDay, cityName)
{
    for(let day of fiveDay)
    {
        const dateOfDay = day.dt_txt.split(' ')
        const iconCode = day.weather[0].icon;
        const icon = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

        const dayForecast = $('<div>')
        const date = $('<p>')
        const weather = $('<img>')
        const temperature = $('<p>')
        const windSpeed = $('<p>')
        const humidity = $('<p>')

        dayForecast.attr('class', 'col')
        // dayForecast.attr('style', 'background-color: blue; margin-right: 1em; padding-right: 4em')
        weather.attr('src', icon)
        weather.attr('style', 'max-width: 30%; height: auto;')
        date.text(`${dayjs(dateOfDay[0]).format('MM/DD/YYYY')}`)
        temperature.text(`Temp: ${day.main.temp}°F`)
        windSpeed.text(`Wind: ${day.wind.speed} MPH`)
        humidity.text(`Humidity: ${day.main.humidity} %`)

        // date.attr('style', 'font-weight: bold; font-size: 1.5em; margin-bottom: 0')

        
        dayForecast.append(date)
        dayForecast.append(weather)
        dayForecast.append(temperature)
        dayForecast.append(windSpeed)
        dayForecast.append(humidity)

        fiveDayForecast.append(dayForecast) 

       
    }

    let inArray = false;
    for (let search of searchArray) {
        if (cityName.toUpperCase() === search.toUpperCase()) {
            inArray = true
        }
    }
    


    if (inArray === false || searchArray.length === 0) {
        setSearchHistory(cityName)
    }
}

function displaySearchHistory()
{
    searchHistory.empty()

    for (let search of searchArray)
    {
    const historyButton = $('<button>')
    historyButton.text(search)
    historyButton.attr('style', 'margin-top: 1em;')
    historyButton.attr('data-history', 'true')

    historyButton.on('click', setCoordinates)

    searchHistory.append(historyButton)
    }
       
}

function setSearchHistory(cityName)
{

    //create object for search results or re search in api
    searchArray.push(cityName)
    localStorage.setItem('history', JSON.stringify(searchArray))
    displaySearchHistory()
    
}

function getForcast(completeURL)
{
    
    //get todays and 5 day forecast call displayForecasts(today, fiveDay)
    fetch(completeURL).then(function(response)
    {
        if (response.status != 200)
        {
            const errorMessage = $('<div>')
            const exitButton = $('<button>')

            errorMessage.attr('class', "alert alert-warning alert-dismissible fade show")
            exitButton.attr('class', 'btn-close')
            exitButton.attr('data-bs-dismiss', 'alert')
            exitButton.attr('aria-label', 'Close')
            
            errorMessage.text(`there was an error in loading the weather information.`)
            
            errorMessage.append(exitButton)
            $('#error').append(errorMessage)

        }
        else
        {
            response.json().then(function(data)
            {
               console.log(data)

               let dayCounter = 0
               const  cityName = data.city.name;
               const today = data.list[0]
               let baseDate = dayjs().startOf('day');
               
               const dates = [];
               const fiveDay = [];

                
                while (dayCounter < 5) {
                    baseDate = baseDate.add(1, 'day')
                    const formattedDate = baseDate.format("YYYY-MM-DD HH:mm:ss")
                    dates.push(formattedDate)

                    dayCounter++
                }
                    
                
                for (let date of dates)
                {
                        
                    console.log(date)
                    

                    for(let d of data.list) 
                    {
                        console.log(d.dt_txt)
                        if (d.dt_txt.match(date))
                        {
                            fiveDay.push(d)
                        }
                    }
                }
                

                console.log(fiveDay);
                console.log(today);
                displayTodaysForcast(today, cityName)
                display5DayForcast(fiveDay,cityName)
            })
        }

    })
}

// read history from local storage, display last seached forcast for coordinates, and display both, click event
    $(document).ready(function()
    {
        displaySearchHistory()
        submitButton.on('click', setCoordinates)
    })
    

