import { React } from 'react';
import { waitFor } from '@testing-library/dom';


import { renderWithIntl } from '@folio/stripes-erm-testing';
import { Accordion, Checkbox, Selection, SelectionList as SelectListInteractor } from '@folio/stripes-testing';
import { MemoryRouter } from 'react-router-dom';

import { activeFilters, data } from './testResources';
import translationsProperties from '../../test/helpers';
import Filters from './Filters';

const stateMock = jest.fn();

const filterHandlers = {
  checkbox: () => {},
  clear: () => {},
  clearGroup: () => {},
  reset: () => {},
  state: stateMock
};

describe('Filters', () => {
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <Filters
          activeFilters={activeFilters}
          data={data}
          filterHandlers={filterHandlers}
          showPackages
          showTitles
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the Type Accordion', async () => {
    await Accordion('Type').is({ open: true });
  });

  test('renders Type Checkboxs', async () => {
    await Checkbox({ id: 'clickable-filter-type-monograph' }).exists();
    await Checkbox({ id: 'clickable-filter-type-serial' }).exists();
  });

  test('renders Is package Checkboxs', async () => {
    await Checkbox({ id: 'clickable-filter-class-package' }).exists();
    await Checkbox({ id: 'clickable-filter-class-nopackage' }).exists();
  });

  let index = 1;
  const testFilterCheckbox = (field, value) => (
    test(`clicking the ${value} checkbox`, async () => {
      await waitFor(async () => {
        await Checkbox({ id: `clickable-filter-${field}-${value}` }).click();
      });

      await waitFor(() => {
        expect(stateMock.mock.calls.length).toEqual(index);
      });

      index++;
    })
  );

  testFilterCheckbox('type', 'monograph');
  testFilterCheckbox('type', 'serial');

  test('renders the Is package Accordion', async () => {
    await Accordion('Is package').exists();
  });

  test('renders the External data source Accordion', async () => {
    await Accordion('External data source').exists();
  });

  it('choosing an external data source option', async () => {
    await Selection({ id: 'remoteKb-filter' }).exists();
    await Selection().open();
    await SelectListInteractor({ optionCount: 1 }).exists();
  });
});

