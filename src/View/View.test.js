import { MemoryRouter } from 'react-router-dom';

import {
  MultiColumnList,
  Pane,
  renderWithIntl,
  SearchField,
} from '@folio/stripes-erm-testing';

import translationsProperties from '../../test/helpers';
import View from './View';

jest.mock('../Filters', () => () => <div>Filters</div>);

const onNeedMoreData = jest.fn();
const onSelectRow = jest.fn();
const queryGetter = jest.fn();
const querySetter = jest.fn();

const data = {
  'eresources': [{
    'id': 'c95b7b8a-8f25-4f9e-946c-d9453abaea14',
    'class': 'org.olf.kb.TitleInstance',
    'name': '"Alles ist eins"',
    'suppressFromDiscovery': false,
    'tags': '[]',
    'alternateResourceNames': '[]',
    'type': {
      'id': '2c91809c843894050184389bed480004',
      'value': 'monograph',
      'label': 'Monograph'
    },
    'publicationType': {
      'id': '2c91809c843894050184389dbcad006d',
      'value': 'book',
      'label': 'Book'
    },
    'subType': {
      'id': '2c91809c843894050184389bed3f0002',
      'value': 'electronic',
      'label': 'Electronic'
    },
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
      'platformInstances': [
        '{id: "96a57fbe-9b4e-4bac-9d17-2cd0b3561c4c"}'
      ],
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
        'identifiers': [{
          'dateCreated': '2022-11-02T16:06:30Z',
          'lastUpdated': '2022-11-02T16:06:30Z',
          'status': {
            'id': '2c91809c843894050184389c87630064',
            'value': 'approved',
            'label': 'approved'
          },
          'identifier': {
            'value': '9783770563692',
            'ns': {
              'value': 'isbn'
            }
          }
        }]
      }]
    }
  }]
};

const source = {
  'totalCount': () => {},
  'loaded': () => {},
  'pending': () => {},
  'failure': () => {},
  'failureMessage': () => {},
};

describe('View', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <View
          data={data}
          onNeedMoreData={onNeedMoreData}
          onSelectRow={onSelectRow}
          queryGetter={queryGetter}
          querySetter={querySetter}
          source={source}

        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the Filters component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Filters')).toBeInTheDocument();
  });

  test('renders the expected Search and Filter Pane', async () => {
    await Pane('Search and filter').is({ visible: true });
  });

  test('renders the expected search field', async () => {
    await SearchField().has({ id: 'input-eresource-search' });
  });

  test('renders the expected MCL', async () => {
    await MultiColumnList('list-eresources').exists();
  });

  test('renders expected column count', async () => {
    await MultiColumnList({ columnCount: 5 }).exists();
  });

  test('renders expected columns headings', async () => {
    await MultiColumnList({ columns: ['Name', 'Type', 'ISBN', 'ISSN (Online)', 'ISSN (Print)'] }).exists();
  });
});


