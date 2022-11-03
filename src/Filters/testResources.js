const activeFilters = {
  'class': [
    'nopackage'
  ]
};

const data = {
  'eresources': [{
    'id': 'c95b7b8a-8f25-4f9e-946c-d9453abaea14',
    'class': 'org.olf.kb.TitleInstance',
    'name': '"Alles ist eins"',
    'suppressFromDiscovery': false,
    'tags': '[]',
    'alternateResourceNames': '[]',
    'type': '{id: "2c91809c843894050184389bed480004", label: "Mo…}',
    'publicationType': '{id: "2c91809c843894050184389dbcad006d", label: "Bo…}',
    'subType': '{id: "2c91809c843894050184389bed3f0002", label: "El…}',
    'customCoverage': false,
    '_object': {
      'id': 'c95b7b8a-8f25-4f9e-946c-d9453abaea14',
      'subType': {
        'id': '2c91809c843894050184389bed3f0002',
        'value': 'electronic',
        'label': 'Electronic'
      },
      'dateCreated': '2022-11-02T16:06:30Z',
      'tags': [],
      'lastUpdated': '2022-11-02T16:06:30Z',
      'normalizedName': '"alles ist eins"',
      'dateMonographPublished': '2021-02-01',
      'monographEdition': 'monograph',
      'publicationType': {
        'id': '2c91809c843894050184389dbcad006d',
        'value': 'book',
        'label': 'Book'
      },
      'coverage': [],
      'alternateResourceNames': [],
      'name': '"Alles ist eins"',
      'type': {
        'id': '2c91809c843894050184389bed480004',
        'value': 'monograph',
        'label': 'Monograph'
      },
      'suppressFromDiscovery': false,
      'work': {
        'id': '23d7c3de-1a92-4bfb-9016-5ee4af137743'
      },
      'platformInstances': [{
        'id': '96a57fbe-9b4e-4bac-9d17-2cd0b3561c4c'
      }],
      'firstAuthor': 'Börnchen',
      'class': 'org.olf.kb.TitleInstance',
      'longName': '"Alles ist eins".2021-02-01 (monograph)',
      'identifiers': [{
        'dateCreated': '2022-11-02T16:06:30Z',
        'lastUpdated': '2022-11-02T16:06:30Z',
        'status': {
          'id': '2c91809c843894050184389c87630064',
          'value': 'approved',
          'label': 'approved'
        },
        'identifier': {
          'value': '9783846763698',
          'ns': {
            'value': 'isbn'
          }
        }
      }],
      'relatedTitles': [{
        'id': '9b704ae0-c84a-4977-b3ad-0c6ea7559c10',
        'subType': {
          'id': '2c91809c843894050184389bed300001',
          'value': 'print',
          'label': 'Print'
        },
        'publicationType': {
          'id': '2c91809c843894050184389dbcad006d',
          'value': 'book',
          'label': 'Book'
        },
        'name': '"Alles ist eins"',
        'type': {
          'id': '2c91809c843894050184389bed480004',
          'value': 'monograph',
          'label': 'Monograph'
        },
        'longName': '"Alles ist eins".2021-02-01 (monograph)',
        'identifiers': [
          '{dateCreated: "2022-11-02T16:06:30Z", identifier: {…}'
        ]
      }]
    }
  }],
  'sourceValues': [{
    'id': 'a6c320f7-76b8-4db5-abaf-342a7673e997',
    'cursor': '2022-10-31T05:07:25Z',
    'active': true,
    'trustedSourceTI': false,
    'activationEnabled': false,
    'readonly': false,
    'syncStatus': 'idle',
    'lastCheck': 1667472216858,
    'name': 'GOKb_TEST',
    'type': 'org.olf.kb.adapters.GOKbOAIAdapter',
    'fullPrefix': 'gokb',
    'uri': 'https://gokbt.gbv.de/gokb/oai/index',
    'supportsHarvesting': true,
    'rectype': 1
  }],
  'typeValues': [{
    'id': '2c91809c843894050184389bed480004',
    'value': 'monograph',
    'label': 'Monograph'
  },
  {
    'id': '2c91809c843894050184389bed4d0005',
    'value': 'serial',
    'label': 'Serial'
  }
  ]
};

export {
  activeFilters,
  data
};
