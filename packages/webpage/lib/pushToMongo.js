import axios from "axios";

const CONNECTION_IS_ACTIVE = true;

export async function pushToMongo(data) {
  if (CONNECTION_IS_ACTIVE) {
    let response = await axios.post(
      "https://server.loki.red/utility-function-extractor",
      {
        data: data,
      }
    );
    console.log(response);
  }
}
// pushToMongo()

