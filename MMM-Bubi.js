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
      availableDocks: dockGroup.availableDocks,
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
        name: this.config.showPlaceName
          ? this.config.places[i].name || dock.name
          : null,
        numberOfBikes: dock.availableBikes.find(b => b.category === 'bike').count,
        numberOfEBikes: dock.availableBikes.find(b => b.category === 'ebike').count,
        numberOfDocks: dock.availableDocks
      });
    }

    if (!this.hasData) {
      this.updateDom();
    }

    this.hasData = true;
  }
});
