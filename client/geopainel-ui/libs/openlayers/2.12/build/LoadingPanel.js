OpenLayers.Control.LoadingPanel = OpenLayers.Class(OpenLayers.Control, {
 
    counter: 0,

    maximized: false,

    visible: true,

    waiting: null,

    initialize: function(options) {
      OpenLayers.Control.prototype.initialize.apply(this, [options]);
    },

    setVisible: function(visible) {
      this.visible = visible;
      if (visible) {
        OpenLayers.Element.show(this.div);
      } else {
        OpenLayers.Element.hide(this.div);
      }
    },

    getVisible: function() {
      return this.visible;
    },

    hide: function() {
      this.setVisible(false);
    },

    show: function() {
      this.setVisible(true);
    },

    toggle: function() {
      this.setVisible(!this.getVisible());
    },

    addLayer: function(evt) {
      if (evt.layer) {
        evt.layer.events.register('loadstart', this, this.increaseCounter);
        evt.layer.events.register('loadend', this, this.decreaseCounter);
      }
    },

    setMap: function(map) {
      OpenLayers.Control.prototype.setMap.apply(this, arguments);
      this.map.events.register('preaddlayer', this, this.addLayer);
      for (var i = 0; i < this.map.layers.length; i++) {
        var layer = this.map.layers[i];

        if (layer instanceof OpenLayers.Layer.UTFGrid) {
          continue;
        }
        layer.events.register('loadstart', this, this.increaseCounter);
        layer.events.register('loadend', this, this.decreaseCounter);
      }
    },

    increaseCounter: function(evt) {
      this.counter++;
      if (this.counter > 0) { 
        if (!this.maximized && this.visible) {
          this.maximizeControl(); 
        }
      }
    },

    decreaseCounter: function() {
      if (this.counter > 0) {
        this.counter--;
      }
      if (this.counter == 0) {
        if (this.maximized && this.visible) {
          this.minimizeControl();
        }
      }
    },

    draw: function () {
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        
        var divImg = OpenLayers.Util.createDiv(this.id+'-img');
        divImg.setAttribute('class','olControlLoadingPanel-img');
        
        this.div.appendChild(divImg);

        return this.div;
    },

    minimizeControl: function(evt) {
      this.div.style.display = "none"; 
      this.maximized = false;
  
      if (evt != null) {
          OpenLayers.Event.stop(evt);
      }
      if (this.waiting) {
        window.clearTimeout(this.waiting);
      }
    },

    maximizeControl: function(evt) {
      var that = this;

    	this.waiting = window.setTimeout(function() {
    		that.minimizeControl(evt);
    	}, 8000);

      this.div.style.display = "block";
      this.maximized = true;
  
      if (evt != null) {
        OpenLayers.Event.stop(evt);
      }
    },

    destroy: function() {
      if (this.map) {
        this.map.events.unregister('preaddlayer', this, this.addLayer);
        if (this.map.layers) {
          for (var i = 0; i < this.map.layers.length; i++) {
            var layer = this.map.layers[i];
            layer.events.unregister('loadstart', this, this.increaseCounter);
            layer.events.unregister('loadend', this, this.decreaseCounter);
          }
        }
      }
      OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    CLASS_NAME: "OpenLayers.Control.LoadingPanel"
});