import request from 'axios';

const API_URL = 'https://webtask.it.auth0.com/api/run/wt-milomord-gmail_com-0/redux-tutorial-backend?webtask_no_cache=1';

export function getTopArtists() {
    return {
        type: 'GET_TOP_ARTISTS',
        promise: request.get('http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=da74622860adaa0bb23f66570c600734&format=json')
    }
}