/* jshint -W106 */
VCO.Media.DemoMedia = VCO.Media.Image.extend({

  /*	Load the media
   ================================================== */
  _loadMedia: function () {
    var self = this;
    // Loading Message
    this.loadingMessage();

    // Link
    if (this.data.link) {
      this._el.content_link = VCO.Dom.create('a', '', this._el.content);
      this._el.content_link.href = this.data.link;
      this._el.content_link.target = '_blank';
      this._el.content_item = VCO.Dom.create('video', 'vco-media-item vco-media-shadow', this._el.content_link);
    } else {
      this._el.content_item = VCO.Dom.create('video', 'vco-media-item vco-media-shadow', this._el.content);
      this._el.content_item.setAttribute("controls", "");
    }

    // Media Loaded Event
    this._el.content_item.addEventListener('load', function (e) {
      self.onMediaLoaded();
    });

    this._el.content_item.src = this._transformURL(this.data.url);

    this.onLoaded();
  },

  _transformURL: function (url) {
   return 'http://www.w3schools.com/html/' + url.replace(/<\/*demo>/g, '');
  }
});
/* jshint +W106 */