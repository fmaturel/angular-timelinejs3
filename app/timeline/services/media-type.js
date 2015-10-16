angular.module('ngTimeline')

  /* jshint -W106 */
  .provider('timelineMediaTypeService', function () {

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
          for (var i = 0; i < mediaTypes.length; i++) {
            if (mediaMatch(m, mediaTypes[i].match_str)) {
              mediaTypes[i].url = m.url;
              return mediaTypes[i];
            }
          }

          return tlMediaType(m);
        }
      };
    };
  });
/* jshint +W106 */