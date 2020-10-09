export const wpAjaxHandler = ({
  root, // eslint-disable-line
  nonce, // eslint-disable-line
  requestSlug = '',
  wpLocalizeHandle = 'wpRestApi',
  httpMethod = 'GET',
  data = {}, 
  thenCB = function() {}
} = {}) => {

  try {

    if (!root) {

      root = window[wpLocalizeHandle].root; // eslint-disable-line

    }

    if (!nonce) {

      nonce = window[wpLocalizeHandle].nonce; // eslint-disable-line

    }

  } catch (error) {

    console.log(error); // eslint-disable-line
    
    return;
  }

  const ajaxPromise = new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest();

    /**
     * If the data object has no properties, assign null. Otherwise, format it as JSON.
     */

    const JSONData = Object.entries(data).length > 0 ? JSON.stringify(data) : null;


    xhr.addEventListener('readystatechange', () => {

      switch(xhr.readyState) {

      case 4:
          
        try {

          if (xhr.status === 200 && testJSON(xhr.response)) {

            // if (!testJSON(xhr.response)) return; // If the test fails, bail out.

            resolve(JSON.parse(xhr.response)); // Parse and resolve it.

          } else {

            reject(xhr.response);

          }
          
        } catch (error) {
          console.log({ error }); // eslint-disable-line
        }

      }

    });

    xhr.open(httpMethod, root + requestSlug);

    xhr.setRequestHeader('X-WP-Nonce', nonce); // eslint-disable-line

    xhr.setRequestHeader('Content-Type', 'application/json');


    /**
         * 
         * If the HTTP request method is anything other than GET and JSONData is truthy,
         * then fire off the data.
         * 
         */

    if (httpMethod !== 'GET' && JSONData) { 

      xhr.send(JSONData);

    } else {

      xhr.send();

    } 

  });

  /**
     * 
     * Pass the callback to the then method.
     * 
     */
    
  return ajaxPromise.then(thenCB); 

};