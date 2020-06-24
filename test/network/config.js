
import { get, isEmpty } from 'lodash';
import parseQueryString from './util';

const getItems = (schema, request, recordName) => {
  const queryString = request.url.split('?')[1];
  const params = parseQueryString(queryString);
  let { filters } = params;
  // when there is only one filter and its not an array
  if (filters && !isEmpty(filters) && !Array.isArray(filters)) filters = [filters];

  // returns a flattened array of { name, value } pairs of filter name and its value
  const parsed = filters && filters.map((filter) => {
    return filter.split('||').map(f => {
      const [name, value] = f.split('==');
      return { name, value };
    });
  }).flat();

  let results;
  if (parsed) {
    results = schema[recordName].where(record => {
      return parsed.reduce((acc, { name, value }) => {
        return acc || get(record, name) === value;
      }, false);
    }).models;
  } else {
    results = schema[recordName].all().models;
  }

  return { results, totalRecords: results.length };
};

export default function config() {
  this.get('/configurations/entries', {
    configs: []
  });

  this.get('/erm/resource/electronic', (schema, request) => {
    return getItems(schema, request, 'eresources');
  });

  this.get('/erm/resource/:id', (schema, request) => {
    return schema.eresources.find(request.params.id).attrs;
  });

  this.get('/erm/kbs', () => [
    {
      'id':'ac6aa7f8-2417-4061-9098-ad1a19b8b808',
      'active':true,
      'trustedSourceTI':true,
      'activationEnabled':false,
      'readonly':true,
      'name':'LOCAL',
      'supportsHarvesting':false,
      'rectype':1
    },
    { 'id':'f536a7ac-9bcc-4a8f-a022-c35aa2b07a9e',
      'cursor':'2020-06-03T19:00:57Z',
      'active':true,
      'trustedSourceTI':false,
      'activationEnabled':false,
      'readonly':false,
      'syncStatus':'idle',
      'lastCheck':1592793469459,
      'name':'GOKb_TEST',
      'type':'org.olf.kb.adapters.GOKbOAIAdapter',
      'fullPrefix':'gokb',
      'uri':'http://gokbt.gbv.de/gokb/oai/index',
      'supportsHarvesting':true,
      'rectype':1 }
  ]);

  this.get('/erm/refdata/TitleInstance/type', () => {
    return [
      { 'id': '188389636d9ece46016d9ed0184b0027', 'value': 'journal', 'label': 'Journal' },
      { 'id': '188389636d9ece46016d9ed018550028', 'value': 'book', 'label': 'Book' }
    ];
  });
}
