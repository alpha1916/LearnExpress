var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);

// 设置 handlebars 视图引擎
// var handlebars = require('express3-handlebars')
//     .create({ defaultLayout:'main' });
var handlebars = require('express3-handlebars').create({
    defaultLayout:'main',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            console.log("section:" + name);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


// app.get('/', function(req, res){
//     res.type('text/plain');
//     res.send('Meadowlark Travel');
// });
// app.get('/about', function(req, res){
//     res.type('text/plain');
//     res.send('About Meadowlark Travel');
// });
//
// // 定制 404 页面
// app.use(function(req, res){
//     res.type('text/plain');
//     res.status(404);
//     res.send('404 - Not Found');
// });
// // 定制 500 页面
// app.use(function(err, req, res, next){
//     console.error(err.stack);
//     res.type('text/plain');
//     res.status(500);
//     res.send('500 - Server Error');
// });


app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});

app.use(express.static(__dirname + '/public'));


function getWeatherData(){
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}
app.use(function(req, res, next){
    if(!res.locals.partials) res.locals.partials = {};
    res.locals.partials.weather = getWeatherData();
    next();
});

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/jquerytest', function(req, res) {
    res.render('jquerytest');
});

app.get('/headers', function(req,res){
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});

var tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
];

// app.get('/api/tours', function(req, res){
//     res.json(tours);
// });

app.get('/greeting', function(req, res){
    res.render('about', {
        message: 'welcome',
        style: req.query.style,
        userid: req.cookie.userid,
        username: req.session.username,
    });
});

// app.get('/api/tours', function(req, res){
//     var toursXml = '<?xml version="1.0"?><tours>' +
//         tours.map(function(p){
//             return '<tour price="' + p.price +
//                 '" id="' + p.id + '">' + p.name + '</tour>';
//         }).join('') + '</tours>';
//     var toursText = tours.map(function(p){
//         return p.id + ': ' + p.name + ' (' + p.price + ')';
//     }).join('\n');
//     res.format({
//         'application/json': function(){
//             res.json(tours);
//         },
//         'application/xml': function(){
//             // 请求和响应对象 ｜ 59
//             res.type('application/xml');
//             res.send(toursXml);
//         },
//         'text/xml': function(){
//             res.type('text/xml');
//             res.send(toursXml);
//         },
//         'text/plain': function(){
//             res.type('text/plain');
//             res.send(toursXml);
//         }
//     });
// });

// app.put('/api/tour/:id', function(req, res){
//     var p = tours.some(function(p){ return p.id == req.params.id });
//     if( p ) {
//         if( req.query.name ) p.name = req.query.name;
//         if( req.query.price ) p.price = req.query.price;
//         res.json({success: true});
//     } else {
//         res.json({error: 'No such tour exists.'});
//     }
// });

app.get('/about', function(req, res){
    var fortunes = [
        "Conquer your fears or they will conquer you.",
        "Rivers need springs.",
        "Do not fear what you don't know.",
        "You will have a pleasant surprise.",
        "Whenever possible, keep it simple.",
    ];
    
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', { 
        fortune: randomFortune,
        pageTestScript: '/qa/tests-about.js'
    });
});

app.get('/tours/hood-river', function(req, res){
    res.render('tours/hood-river');
});
app.get('/tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate');
});














// 404 catch-all 处理器（中间件）
app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});
// 500 错误处理器（中间件）
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});