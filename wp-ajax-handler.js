import testJSON from './utilities/test-json';

const wpAjaxHandler = ({
  root,
  nonce,
  requestSlug = '',
  wpLocalizeHandle = 'wpRestApi',
  httpMethod = 'GET',
  data = {},
  thenCB = function () {}
} = {}) => {

  try {

    if (!window[wpLocalizeHandle]) {

      throw new Error(`Please use wp_localize_script to create an object before using wpAjaxHandler like so:
      
      /** 
       * 
       * Note: Please understand that wpLocalizeHandle is a misnomer (whoops! =P) since
       * it actually refers to the object's name and not the handle itself, but this is where
       * you need to enter the object's name so you can grab the root and nonce props to
       * validate your request.
       * 
       * Anyhow, here's an example of how to use wp_localize_script so you can then
       * use wpAjaxHandler to make your life slightly easier. So copy and paste away! =D
       * 
       * 
       * */ 

      // Hint: Place this in the function where you enqueued your JS, and preferably below it like so:

      add_action('wp_enqueue_scripts', 'enqueue_my_js_yo');

      function enqueue_my_js_yo() {
                                                                          
        wp_enqueue_script('my-js-handle', get_template_directory_uri() . '/js/my-badass-script.js', [], date('h:i:s'), true); // Hint: date('h:i:s') is a neat trick for cache-busting! =0 

        // Now enter your script's handle as the first argument for wp_localize_script.

        wp_localize_script('my-js-handle', 'objectName', [

          root: esc_raw_html(rest_url()), // Copy and paste these props and you'll be golden! ;)
          nonce: wp_create_nonce('wp_rest')

        ]

      }
      
      `);

    }

    if (!root) {

      root = window[wpLocalizeHandle].root;

    }

    if (!nonce) {

      nonce = window[wpLocalizeHandle].nonce;

    }

  } catch (error) {

    console.log(error);

    return;
  }

  const ajaxPromise = new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest();

    /**
     * If the data object has no properties, assign null. Otherwise, convert it into JSON.
     */

    const JSONData = Object.entries(data).length > 0 ? JSON.stringify(data) : null;

    xhr.addEventListener('readystatechange', () => {

      switch (xhr.readyState) {

        case 4:

          try {

            if (xhr.status === 200 && testJSON(xhr.response)) {

              resolve(JSON.parse(xhr.response)); // Parse and resolve it.

            } else {

              reject(xhr.response); // If it's rejected, let's find out why.

            }

          } catch (error) {

            console.log({
              error
            });

          }

      }

    });

    // Plop the HTTP request method and URL into the open method.

    xhr.open(httpMethod, root + requestSlug);

    // Give WordPress the secret handshake. 

    xhr.setRequestHeader('X-WP-Nonce', nonce);

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
   * Pass the callback to the then method and
   * do something with the data.
   * 
   */

  return ajaxPromise.then(thenCB);

};

export default wpAjaxHandler;