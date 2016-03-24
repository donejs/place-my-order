import platform from "steal-platform";

let baseUrl = '';

if(platform.isCordova || platform.isNW) {
  baseUrl = 'http://www.place-my-order.com';
}

export default baseUrl;
