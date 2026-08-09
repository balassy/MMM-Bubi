/* global Module, Log */

/*
 * Magic Mirror Module: MMM-Bubi (https://github.com/balassy/MMM-Bubi)
 * By György Balássy (https://www.linkedin.com/in/balassy)
 * MIT Licensed.
 */

Module.register('MMM-Bubi', {
  defaults: {
    updateInterval: 600000,
    showBikes: true,
    showEbikes: true,
    showDocks: true,
    showPlaceName: true,
    align: 'left',
    places: [
      { id: '7438', name: 'MOMKult' },
      { id: '7437', name: 'MOM Park' },
      { id: '7436' }       
    ]
  },

  viewModel: {
    places: []
  },

  requiresVersion: '2.1.0',

  getStyles() {
    return [
      'MMM-Bubi.css',
      'font-awesome.css'
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

        if (this.config.showBikes) {
          const symbolBikeEl = document.createElement('td');
          symbolBikeEl.classList = 'dimmed symbol-cell';

          const svgBikeEl = this._getSvgElement('bike');
          symbolBikeEl.appendChild(svgBikeEl);
          rowEl.appendChild(symbolBikeEl);

          const countEl = document.createElement('td');
          countEl.classList = 'count-cell';
          countEl.innerText = place.numberOfBikes;
          rowEl.appendChild(countEl);
          
          const spaceEl = document.createElement('td');
          spaceEl.classList = 'space-cell';
          rowEl.appendChild(spaceEl);
        }

        if (this.config.showEbikes) {
          const symbolEbikeEl = document.createElement('td');
          symbolEbikeEl.classList = 'dimmed symbol-cell';

          const svgEbikeEl = this._getSvgElement('ebike');
          symbolEbikeEl.appendChild(svgEbikeEl);
          rowEl.appendChild(symbolEbikeEl);

          const countElEbike = document.createElement('td');
          countElEbike.classList = 'count-cell';
          countElEbike.innerText = place.numberOfEbikes;
          rowEl.appendChild(countElEbike);

          const spaceEl2 = document.createElement('td');
          spaceEl2.classList = 'space-cell';
          rowEl.appendChild(spaceEl2);
        }

        if (this.config.showDocks) {
          const symbolDocksEl = document.createElement('td');
          symbolDocksEl.classList = 'dimmed symbol-cell symbol-dock-cell';

          const svgDocksEl = this._getSvgElement('docks');
          symbolDocksEl.appendChild(svgDocksEl);
          rowEl.appendChild(symbolDocksEl);

          const countElDocks = document.createElement('td');
          countElDocks.classList = 'count-cell';
          countElDocks.innerText = place.numberOfDocks;
          rowEl.appendChild(countElDocks);
        }

        const titleEl = document.createElement('td');
        titleEl.classList = 'dimmed small name-cell';
        titleEl.innerText = place.title;
        rowEl.appendChild(titleEl);

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

  _getSvgElement(iconName) {
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('viewBox', '0 0  24 24');
    svgEl.setAttribute('width', '1em');
    svgEl.setAttribute('height', '1em');
    svgEl.setAttribute('fill', 'currentColor');

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', this._getSvgPath(iconName));
    svgEl.appendChild(pathEl);

    return svgEl;
  },

  _getSvgPath(iconName) {
    switch (iconName) {
      case 'bike':
        return 'M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2M5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5m0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5m5.8-10 2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5m0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5';
      case 'ebike':
        return 'M19 7h-.82l-1.7-4.68C16.19 1.53 15.44 1 14.6 1H12v2h2.6l1.46 4h-4.81l-.36-1H12V4H7v2h1.75l1.82 5H9.9c-.44-2.23-2.31-3.88-4.65-3.99C2.45 6.87 0 9.2 0 12s2.2 5 5 5c2.46 0 4.45-1.69 4.9-4h4.2c.44 2.23 2.31 3.88 4.65 3.99 2.8.13 5.25-2.19 5.25-5C24 9.2 21.8 7 19 7M7.82 13c-.4 1.17-1.49 2-2.82 2-1.68 0-3-1.32-3-3s1.32-3 3-3c1.33 0 2.42.83 2.82 2H5v2zm6.28-2h-1.4l-.73-2H15c-.44.58-.76 1.25-.9 2m4.9 4c-1.68 0-3-1.32-3-3 0-.93.41-1.73 1.05-2.28l.96 2.64 1.88-.68-.97-2.67c.02 0 .05-.01.08-.01 1.68 0 3 1.32 3 3s-1.32 3-3 3m-8 5H7l6 3v-2h4l-6-3z';
      case 'docks':
        return 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6m.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2';
    };
  },

  _getData(onCompleteCallback) {
    const self = this;

    const url = 'https://core.urbansharing.com/public/api/v1/graphql?operationName=dockGroupsExtended&variables=%7B%22systemId%22%3A%22inurba-budapest%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%221ef5051c2702f0fa61818c67d38125034b5ab99e483ccf36580461070705359d%22%7D%7D';

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

    /*
    The structure of `response` is as follows:
    {
      "data": {
        "dockGroups": [
          {
            "id": "7468",
            "name": "110038",
            "title": "Kelenföld vasútállomás M (Etele tér)",
            "state": "active",
            "subTitle": "Kelenföld vasútállomás M (Etele tér)",
            "enabled": true,
            "availabilityInfo": {
                "availableVehicles": 25,
                "availableDocks": 16,
                "availableVirtualDocks": 16,
                "availablePhysicalDocks": 0,
                "availableVehicleCategories": [
                    {
                        "category": "bike",
                        "count": 5,
                        "__typename": "VehicleCategoryAvailability"
                    },
                    {
                        "category": "ebike",
                        "count": 20,
                        "__typename": "VehicleCategoryAvailability"
                    }
                ],
                "__typename": "DockGroupAvailability"
            },
            "coord": {
                "lat": 47.464501,
                "lng": 19.023039,
                "__typename": "Coord"
            },
            "__typename": "DockGroup"
          },
          { ... }
        ]
      }
    }
    */
  

    const docks = response.data.dockGroups.map(dockGroup => ({
      id: dockGroup.id,
      name: dockGroup.name,
      title: dockGroup.title,
      availableDocks: dockGroup.availabilityInfo.availableDocks,
      availableBikes: dockGroup.availabilityInfo.availableVehicleCategories
    }));

    this.viewModel.places = [];

    for (let i = 0; i < this.config.places.length; i++) {
      const dock = docks.find(d => d.id === this.config.places[i].id);

      if (!dock) {
        Log.error(this.name, `MMM-Bubi: Dock with ID ${this.config.places[i].id} not found in the response.`);
        continue;
      }

      this.viewModel.places.push({
        title: this.config.showPlaceName
          ? this.config.places[i].name || dock.title
          : null,
        numberOfBikes: dock.availableBikes.find(b => b.category === 'bike').count,
        numberOfEbikes: dock.availableBikes.find(b => b.category === 'ebike').count,
        numberOfDocks: dock.availableDocks
      });
    }

    if (!this.hasData) {
      this.updateDom();
    }

    this.hasData = true;
  }
});
