# Angular Timeline with the new Timeline JS 3

A quick directive project for making AngularJS use TimelineJS3.

[![Build Status](https://secure.travis-ci.org/fmaturel/angular-timelinejs3.svg)](http:/travis-ci.org/fmaturel/angular-timelinejs3)

## Demo

Run the demo @home with few steps (prerequisite git & node V0.10+ & npm installed):

```
 git clone https://github.com/fmaturel/angular-timelinejs3.git && cd angular-timelinejs3
 npm install
 sudo npm install -g grunt-cli
 sudo npm install -g bower
 bower install
```

Then run 

`grunt serve:dist`

## Install

> bower install angular-timelinejs3 --save

Add the new Timeline JS3 css and javascript to your index.html.

```
 &lt;link rel="stylesheet" href="bower_components/TimelineJS3/compiled/css/timeline.css" /&gt;
 &lt;script src="bower_components/TimelineJS3/compiled/js/timeline.js" /&gt; 
```

Add dependency to timeline your angular module: `ngTimeline`.

Use the directive:

`<timeline class="timeline" data="timelineData" height="600"></timeline>`

## License

Released under the MIT License. See the [LICENSE][license] file for further details.

[license]: https://github.com/fmaturel/angular-timelinejs3/blob/master/LICENSE