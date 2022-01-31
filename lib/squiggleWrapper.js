import axios from "axios";

export async function squiggleWrapper(input) {
  let response = await axios.post("https://server.loki.red/squiggle", {
    model: `mean(${input})`,
  });
  if (response.status == 200) {
    try {
      console.log(response.data);
      if (!!response.data && !!response.data.value) {
        // console.log(response.data.value);
        let result = response.data.value.hd.VAL;
        console.log(result);
        return result;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  return null;
}
// squiggle("1 to 4");
