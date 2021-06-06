/* global Module, Log */

/*
 * Magic Mirror Module: MMM-Bubi (https://github.com/balassy/MMM-Bubi)
 * By György Balássy (https://www.linkedin.com/in/balassy)
 * MIT Licensed.
 */

Module.register('MMM-Bubi', {
  defaults: {
    updateInterval: 600000,
    showPlaceName: true,
    align: 'left',
    places: [
      { id: 42990755, name: 'MOMKult' },
      { id: 42990754, name: 'MOM Park' },
      { id: 42990729,  name: 'BAH csomópont' }      
    ]
  },

  viewModel: {
    places: []
  },

  requiresVersion: '2.1.0',

  getStyles() {
    return [
      'MMM-Bubi.css'
    ];
  },

  start() {
    const self = this;
    this.hasData = false;

    this._getData(() => self.updateDom());

    setInterval(() => {
      self._getData(() => self.updateDom());
    }, this.config.updateInterval);
  },

  getDom() {
    const wrapper = document.createElement('div');

    if (this.viewModel) {
      const tableEl = document.createElement('table');
      tableEl.classList = 'small';

      if (this.config.align === 'left') {
        tableEl.classList += ' align-left';
      }

      if (this.config.align === 'right') {
        tableEl.classList += ' align-right';
      }

      this.viewModel.places.forEach((place) => {
        const rowEl = document.createElement('tr');

        const symbolEl = document.createElement('td');
        symbolEl.classList = 'fa fa-bicycle dimmed symbol-cell';
        rowEl.appendChild(symbolEl);

        const countEl = document.createElement('td');
        countEl.classList = 'count-cell';
        countEl.innerText = place.numberOfBikes;
        rowEl.appendChild(countEl);

        const nameEl = document.createElement('td');
        nameEl.classList = 'dimmed small name-cell';
        nameEl.innerText = place.name;
        rowEl.appendChild(nameEl);

        tableEl.appendChild(rowEl);
      });

      wrapper.appendChild(tableEl);

      const clearfixEl = document.createElement('div');
      clearfixEl.classList = 'clearfix';
      wrapper.appendChild(clearfixEl);
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

    const url = 'https://maps.nextbike.net/maps/nextbike-live.json?domains=bh';

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

    this.viewModel.places = [];

    for (let i = 0; i < this.config.places.length; i++) {
      const place = places.find(p => p.uid === this.config.places[i].id);
      this.viewModel.places.push({
        name: this.config.showPlaceName
          ? this.config.places[i].name || place.name
          : null,
        numberOfBikes: place.bikes
      });
    }

    if (!this.hasData) {
      this.updateDom();
    }

    this.hasData = true;
  }
});
