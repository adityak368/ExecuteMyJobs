var express = require('express');
var router = express.Router();
var path = require("path");

/* GET home page. */
router.get('*', function (req, res, next) {
    res.sendFile('index.html', {root: path.join(__dirname, '../../client')});
});

//
// module.exports = router;
//
// let express = require('express');
// let router = express.Router();
//
// import React from 'react';
// import NotFound404 from '../../client/components/NotFound404.jsx';
// import { routes } from '../../client/app.jsx';
// import { match, RouterContext } from 'react-router';
// import { renderToString }  from 'react-dom/server';
//
// /* GET home page. */
//
// router.get('/', function (req, res) {
//   match(
//     { routes, location: req.url },
//     function (err, redirectLocation, renderProps) {
//       // in case of error display the error message
//       if (err) {
//         res.status(500).send(err.message);
//       }
//
//       // in case of redirect propagate the redirect to the browser
//       if (redirectLocation) {
//         res.redirect(302, redirectLocation.pathname + redirectLocation.search);
//       }
//
//       // generate the React markup for the current route
//       var markup;
//       if (renderProps) {
//         // if the current route matched we have renderProps
//         markup = renderToString(<RouterContext {...renderProps}/>);
//       } else {
//         // otherwise we can render a 404 page
//         markup = renderToString(<NotFound404 />);
//         res.status(404);
//       }
//
//       // render the index template with the embedded React markup
//       return res.render('index', { data : markup });
//     }
//   );
// });
//
//
//
// router.get('/admin', function (req, res) {
//   match(
//     { routes, location: req.url },
//     function (err, redirectLocation, renderProps) {
//
//       // in case of error display the error message
//       if (err) {
//         res.status(500).send(err.message);
//       }
//
//       // in case of redirect propagate the redirect to the browser
//       if (redirectLocation) {
//         res.redirect(302, redirectLocation.pathname + redirectLocation.search);
//       }
//
//       // generate the React markup for the current route
//       var markup;
//       if (renderProps) {
//         // if the current route matched we have renderProps
//         markup = renderToString(<RouterContext {...renderProps}/>);
//       } else {
//         // otherwise we can render a 404 page
//         markup = renderToString(<NotFound404 />);
//         res.status(404);
//       }
//
//       // render the index template with the embedded React markup
//       return res.render('index', { data : markup });
//     }
//   );
// });

// router.get("/", function(req,res) {
//
//   res.render('index');
//
// });

module.exports = router;
