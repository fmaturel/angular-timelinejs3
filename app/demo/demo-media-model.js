/* jshint -W106 */
TL.Media.DemoMedia = TL.Media.Image.extend({

  /*	Load the media
   ================================================== */
  _loadMedia: function () {
    var scope = angular.element(this._el.content).scope();

    // Loading Message
    this.loadingMessage();

    scope.$emit('onMediaLoaded', this);

    this.onLoaded();

    scope.$emit('onCaptionLoaded', this);
  }
});
/* jshint +W106 */