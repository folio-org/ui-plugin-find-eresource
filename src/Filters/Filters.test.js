import { MemoryRouter } from 'react-router-dom';
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { Accordion, Checkbox, renderWithIntl } from '@folio/stripes-erm-testing';

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

  /*
   * EXAMPLE This helper function will test existence of checkboxes
   * for each of the values defined in testResources refdata
   * and also whether they are all clickable.
   */
  let index = 1;
  const testNamedFilterCheckboxes = (name) => {
    describe(`${name} filter`, () => {
      const promiseList = [];
      const valuesList = [];
      data?.[`${name}Values`]?.forEach((value) => {
        promiseList.push(Checkbox({ id: `clickable-filter-${name}-${value?.value}` }).exists());
        valuesList.push(value?.value);
      });

      test(`renders all ${name} checkboxes`, () => {
        Promise.all(promiseList);
      });

      valuesList.forEach((value) => {
        test(`clicking the ${value} checkbox within the ${name} filter`, async () => {
          await waitFor(async () => {
            await Checkbox({ id: `clickable-filter-${name}-${value}` }).click();
          });

          await waitFor(() => {
            expect(stateMock.mock.calls.length).toEqual(index);
          });

          index++;
        });
      });
    });
  };

  testNamedFilterCheckboxes('type');
  testNamedFilterCheckboxes('publicationType');
  testNamedFilterCheckboxes('status');
  testNamedFilterCheckboxes('scope');
  testNamedFilterCheckboxes('contentType');

  test('renders IsPackage Checkboxes', async () => {
    await Checkbox({ id: 'clickable-filter-class-package' }).exists();
    await Checkbox({ id: 'clickable-filter-class-nopackage' }).exists();
  });

  test('renders the IsPackage Accordion', async () => {
    await Accordion('Is package').exists();
  });
});

