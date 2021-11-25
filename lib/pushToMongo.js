import axios from "axios"

export async function pushToMongo(data){
    let response = await axios.post('http://metaforecast-twitter-bot.herokuapp.com/utility-function-extractor', {
        data: data
    })
    console.log(response)
}
// pushToMongo()