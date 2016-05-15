import express                   from 'express';
import React                     from 'react';
import { renderToString }        from 'react-dom/server'
import { RoutingContext, match } from 'react-router';
import createLocation            from 'history/lib/createLocation';
import routes                    from 'routes';
import { Provider }              from 'react-redux';
import * as reducers             from 'reducers';
import promiseMiddleware         from 'lib/promiseMiddleware';
import fetchComponentData        from 'lib/fetchComponentData';
import { createStore,
    combineReducers,
    applyMiddleware }            from 'redux';
import path                      from 'path';

import config from "nconf";
import http from "http";
import passport from 'passport';
import AuthVKStrategy from 'passport-vkontakte';
import flash from 'connect-flash';
import json from 'express-json';
import cookieParser from 'cookie-parser';
import session from 'express-session';

config.argv()
    .env()
    .file({file: 'config.json'});

const app = express();

var sessionOptions = config.get("session");
app.use(json());
//app.use(express.urlencoded());
//app.use(express.methodOverride());
app.use(cookieParser());
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'dist')));

passport.use('vk', new AuthVKStrategy.Strategy({
        clientID: config.get("auth:vk:app_id"),
        clientSecret: config.get("auth:vk:secret"),
        callbackURL: config.get("app:url") + "/auth/vk/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        //console.log("facebook auth: ", profile);

        console.log('111!!!');

        //return done(null, {
        //    username: profile.displayName,
        //    photoUrl: profile.photos[0].value,
        //    profileUrl: profile.profileUrl
        //});
    }
));

passport.serializeUser(function (user, done) {
    console.log('222!!!');
    //done(null, JSON.stringify(user));
});


passport.deserializeUser(function (data, done) {
    console.log('333!!!');
    //try {
    //    done(null, JSON.parse(data));
    //} catch (e) {
    //    done(err)
    //}
});

if (process.env.NODE_ENV !== 'production') {
    require('./webpack.dev').default(app);
}

app.get('/sign-out', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/auth/vk',
    passport.authenticate('vk', {
        scope: ['friends']
    }),
    function (req, res) {
    }
);

app.get('/auth/vk/callback',
    passport.authenticate('vk', {
        failureRedirect: '/auth'
    }),
    function (req, res) {
        res.redirect('/');
    });

app.use((req, res) => {
    const location = createLocation(req.url);
    const reducer = combineReducers(reducers);
    const store = applyMiddleware(promiseMiddleware)(createStore)(reducer);

    match({routes, location}, (err, redirectLocation, renderProps) => {
        if (err) {
            console.error(err);
            return res.status(500).end('Internal server error');
        }

        if (!renderProps)
            return res.status(404).end('Not found');

        function renderView() {
            const InitialView = (
                <Provider store={store}>
                    <RoutingContext {...renderProps} />
                </Provider>
            );

            const componentHTML = renderToString(InitialView);
            const initialState = store.getState();

            const HTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Redux Demo</title>

          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          </script>
        </head>
        <body>
          <div id="react-view">${componentHTML}</div>
          <script type="application/javascript" src="/bundle.js"></script>
        </body>
      </html>
      `;
            return HTML;
        }

        fetchComponentData(store.dispatch, renderProps.components, renderProps.params)
            .then(renderView)
            .then(html => res.end(html))
            .catch(err => res.end(err.message));
    });
});

export default app;
