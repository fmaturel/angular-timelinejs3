# Angular Timeline with the new Timeline JS 3

A quick directive project for making AngularJS use TimelineJS3.

[![Build Status](https://secure.travis-ci.org/fmaturel/angular-timelinejs3.svg)](http:/travis-ci.org/fmaturel/angular-timelinejs3)

## Demo

Run the demo @home with few steps (prerequisite git & node V0.10+ & npm installed):

```
 git clone https://github.com/fmaturel/angular-timelinejs3.git && cd angular-timelinejs3
 npm install
 npm install -g grunt-cli
```

Then run 

`grunt serve:dist`

## Install

> bower install --save angular-timelinejs3

or 

> npm install --save angular-timelinejs3

Add the new Timeline JS3 css and javascript to your index.html.

```
  <link rel="stylesheet" href="https://cdn.knightlab.com/libs/timeline3/latest/css/timeline.css">
  <script src="https://cdn.knightlab.com/libs/timeline3/latest/js/timeline.js"></script>
```

Add dependency to timeline your angular module: `ngTimeline`.

Use the directive:

`<timeline control="timeline" height="80vh" options="options"></timeline>`

## License

Released under the MIT License. See the [LICENSE][license] file for further details.

[license]: https://github.com/fmaturel/angular-timelinejs3/blob/master/LICENSE