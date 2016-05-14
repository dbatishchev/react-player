import request from 'axios';

const API_URL = 'https://webtask.it.auth0.com/api/run/wt-milomord-gmail_com-0/redux-tutorial-backend?webtask_no_cache=1';

export function getTopArtists() {
    return {
        type: 'GET_TOP_ARTISTS',
        promise: request.get('http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=da74622860adaa0bb23f66570c600734&format=json')
    }
}

export function getTodos() {
    return {
        type: 'GET_TODOS',
        promise: request.get(API_URL)
    }
}

export function createTodo(text) {
    return {
        type: 'CREATE_TODO',
        promise: request.post(API_URL, {time: Date.now(), text})
    };
}

export function editTodo(id, text) {
    return {
        type: 'EDIT_TODO',
        id,
        text,
        date: Date.now()
    };
}

export function deleteTodo(id) {
    return {
        type: 'DELETE_TODO',
        id
    };
}
