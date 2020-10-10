const testJSON = json => {

  try {

    JSON.parse(json);

    return true;

  } catch(error) {

    console.log({JSONParseError: error}); //eslint-disable-line

    return false;

  }

};

export default testJSON;