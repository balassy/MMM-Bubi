/* global Module, Log */

/*
 * Magic Mirror Module: MMM-Bubi (https://github.com/balassy/MMM-Bubi)
 * By György Balássy (https://www.linkedin.com/in/balassy)
 * MIT Licensed.
 */

Module.register('MMM-Bubi', {
  defaults: {
    updateInterval: 600000,
    placeId: 248398,
    showPlaceName: true,
    placeName: ''
  },

  requiresVersion: '2.1.0',

  getStyles() {
    return [
      'MMM-Bubi.css'
    ];
  },

  start() {
    const self = this;
    this.viewModel = null;
    this.hasData = false;

    this._getData(() => self.updateDom());

    setInterval(() => {
      self._getData(() => self.updateDom());
    }, this.config.updateInterval);
  },

  getDom() {
    const wrapper = document.createElement('div');

    if (this.viewModel) {
      const firstLine = document.createElement('div');

      const symbolEl = document.createElement('span');
      symbolEl.classList = 'fa fa-bicycle dimmed symbol';
      firstLine.appendChild(symbolEl);

      const countEl = document.createElement('span');
      countEl.innerText = this.viewModel.numberOfBikes;
      firstLine.appendChild(countEl);

      wrapper.appendChild(firstLine);

      if (this.config.showPlaceName) {
        const secondLine = document.createElement('div');
        secondLine.classList = 'dimmed small';
        secondLine.innerText = this.config.placeName ? this.config.placeName : this.viewModel.officalPlaceName;
        wrapper.appendChild(secondLine);
      }
    } else {
      const loadingEl = document.createElement('span');
      loadingEl.innerHTML = this.translate('LOADING');
      loadingEl.classList = 'dimmed small';
      wrapper.appendChild(loadingEl);
    }

    return wrapper;
  },

  _getData(onCompleteCallback) {
    const self = this;

    const url = 'https://bubi.nextbike.net/maps/nextbike-live.json?&domains=mb';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function onReadyStateChange() {
      if (this.readyState === 4) {
        if (this.status === 200) {
          self._processResponse(this.response);
          onCompleteCallback();
        } else {
          Log.error(self.name, `MMM-Bubi: Failed to load data. XHR status: ${this.status}`);
        }
      }
    };

    xhr.send();
  },

  _processResponse(responseBody) {
    const response = JSON.parse(responseBody);

    const places = response.countries[0].cities[0].places;
    const place = places.find(p => p.uid === this.config.placeId);

    this.viewModel = {
      officalPlaceName: place.name,
      numberOfBikes: place.bikes
    };

    if (!this.hasData) {
      this.updateDom();
    }

    this.hasData = true;
  }
});
