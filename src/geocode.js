import { isUndefinedOrNull, isUndefinedOrEmpty } from './helpers';
import buildQueryString from './qs';
import fetch from './fetch';

const OPEN_CAGE_DATA_URL = 'https://api.opencagedata.com/geocode/v1/json';

/**
 * @private
 * build input paraameters with lat,lng,query and optional parameters
 * TODO externalize for gecodeGeoJSON method
 *
 * @param  {Object} input [description]
 * @return {Object}       the OpenCage API parameters
 */
const buildParams = input => input;

/**
 * geocode
 * @param  {Object} input   query parameters
 * @return {Promise}        a promise resolved by the json format API payload
 */
const geocode = input =>
  new Promise((resolve, reject) => {
    if (isUndefinedOrNull(input)) {
      const error = new Error('missing input parameters');
      error.response = {
        status: {
          code: 400,
          message: 'missing input parameters',
        },
      };
      reject(error);
      return;
    }
    const params = buildParams(input);
    let endpoint = OPEN_CAGE_DATA_URL;
    if (isUndefinedOrEmpty(params.proxyURL)) {
      if (isUndefinedOrEmpty(params.key)) {
        params.key = process.env.OCD_API_KEY;
      }
      if (isUndefinedOrEmpty(params.key)) {
        const error = new Error('missing API key');
        error.response = {
          status: {
            code: 403,
            message: 'missing API key',
          },
        };
        reject(error);
        return;
      }
    } else {
      endpoint = params.proxyURL;
      delete params.proxyURL;
    }
    const qs = buildQueryString(params);
    const url = `${endpoint}?${qs}`;
    // console.log(url);
    fetch(url, resolve, reject);
  });

export default geocode;
export { buildParams };
