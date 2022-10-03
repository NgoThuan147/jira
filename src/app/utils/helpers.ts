
export const getCookie = (cname: string | undefined) => {
  if (!cname) {
    return;
  }
  const name = cname + '';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length + 1, c.length);
    }
  }
  return '';
};

/**
 * Set cookie
 **/
 export const saveCookie = (cookieData: { name: string; value: string; exdays: number }): void => {
  if (!cookieData?.name) {
    return;
  }
  const date = new Date();
  date.setTime(date.getTime() + cookieData.exdays * 24 * 60 * 60 * 1000);
  document.cookie = `${cookieData.name}=${cookieData.value}; expires=${date.toUTCString()}`;
};

/**
 * Del Cookie by name
 **/
 export const delCookie = (name: string) => {
  if (!name) {
    return;
  }
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};