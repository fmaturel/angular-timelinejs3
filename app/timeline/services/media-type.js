angular.module('ngTimeline')

  /* jshint -W106 */
  .provider('TimelineMediaTypeService', function () {

    var tlMediaType = TL.MediaType, mediaTypes = [];

    this.addMediaType = function (mediaType) {
      mediaTypes.push({
        type: mediaType.type,
        name: mediaType.name,
        match_str: mediaType.urlRegex,
        cls: mediaType.cls
      });
    };

    function mediaMatch(m, testUrl) {
      return angular.isObject(m) && angular.isString(m.url) && m.url.match(testUrl);
    }

    this.$get = function () {
      return {
        getMediaType: function (m) {
          var result = tlMediaType(m);
          if (!result || result.name === 'Imageblank') {
            for (var i = 0; i < mediaTypes.length; i++) {
              if (mediaMatch(m, mediaTypes[i].match_str)) {
                mediaTypes[i].url = m.url;
                return mediaTypes[i];
              }
            }
          }
          return result;
        }
      };
    };
  });
/* jshint +W106 */