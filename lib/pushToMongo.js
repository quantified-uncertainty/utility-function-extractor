import axios from "axios"

export async function pushToMongo(data){
<<<<<<< HEAD
    let response = await axios.post('https://metaforecast-twitter-bot.herokuapp.com/utility-function-extractor', {
=======
    let response = await axios.post('http://metaforecast-twitter-bot.herokuapp.com/utility-function-extractor', {
>>>>>>> withRequestToHeroku
        data: data
    })
    console.log(response)
}