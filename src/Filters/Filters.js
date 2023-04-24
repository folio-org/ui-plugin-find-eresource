import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader, Selection } from '@folio/stripes/components';
import { CheckboxFilter, MultiSelectionFilter } from '@folio/stripes/smart-components';

const FILTERS = [
  'availability',
  'contentType',
  'publicationType',
  'scope',
  'status',
  'type'
];

const Filters = ({
  data,
  activeFilters = {
    class: [],
    type: [],
  },
  filterHandlers,
  showPackages = true,
  showTitles = true,
}) => {
  const [filterState, setFilterState] = useState({
    availability: [],
    contentType: [],
    publicationType: [],
    scope: [],
    status: [],
    type: []
  });

  useEffect(() => {
    const newState = {};
    FILTERS.forEach(filter => {
      const values = data[`${filter}Values`];
      if (values.length !== filterState[filter]?.length) {
        newState[filter] = values;
      }
    });

    if (Object.keys(newState).length) {
      setFilterState(prevState => ({ ...prevState, ...newState }));
    }
  }, [data, filterState]);


  const renderIsPackageFilter = () => {
    const groupFilters = activeFilters.class || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-is-package"
        label={<FormattedMessage id="ui-plugin-find-eresource.prop.isPackage" />}
        onClearFilter={() => { filterHandlers.clearGroup('class'); }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={[
            { value: 'package', label: <FormattedMessage id="ui-plugin-find-eresource.yes" /> },
            { value: 'nopackage', label: <FormattedMessage id="ui-plugin-find-eresource.no" /> },
          ]}
          name="class"
          onChange={group => {
            filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  const renderCheckboxFilter = (name) => {
    const groupFilters = activeFilters[name] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={<FormattedMessage id={`ui-plugin-find-eresource.prop.${name}`} />}
        onClearFilter={() => { filterHandlers.clearGroup(name); }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={filterState[name]}
          name={name}
          onChange={group => {
            filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  const renderRemoteKbFilter = () => {
    const dataOptions = data.sourceValues.map(remoteKb => ({
      label: remoteKb.name,
      value: remoteKb.id,
    }));

    const remoteKbFilters = activeFilters.remoteKb || [];

    return (
      <Accordion
        displayClearButton={remoteKbFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-remoteKb"
        label={<FormattedMessage id="ui-plugin-find-eresource.prop.sourceKb" />}
        onClearFilter={() => { filterHandlers.clearGroup('remoteKb'); }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          id="remoteKb-filter"
          onChange={value => filterHandlers.state({ ...activeFilters, remoteKb: [value] })}
          value={remoteKbFilters[0] || ''}
        />
      </Accordion>
    );
  };

  const renderAvailabilityFilter = () => {
    const availabilityFilters = activeFilters.availability || [];

    return (
      <Accordion
        displayClearButton={availabilityFilters.length > 0}
        header={FilterAccordionHeader}
        id="clickable-availability-filter"
        label={<FormattedMessage id="ui-agreements.eresources.availability" />}
        onClearFilter={() => { filterHandlers.clearGroup('availability'); }}
        separator={false}
      >
        <MultiSelectionFilter
          dataOptions={filterState.availability || []}
          id="availability-filter"
          name="availability"
          onChange={e => filterHandlers.state({ ...activeFilters, availability: e.values })}
          selectedValues={availabilityFilters}
        />
      </Accordion>
    );
  };

  const renderTitleFilters = () => ([
    renderCheckboxFilter('type')
  ]);

  const renderPackageFilters = () => ([
    renderCheckboxFilter('status'),
    renderCheckboxFilter('scope'),
    renderAvailabilityFilter(),
    renderCheckboxFilter('contentType'),
    renderRemoteKbFilter()
  ]);

  return (
    <AccordionSet>
      {showTitles && showPackages && renderIsPackageFilter()}
      {showTitles && renderTitleFilters()}
      {showPackages && renderPackageFilters()}
    </AccordionSet>
  );
};

Filters.propTypes = {
  activeFilters: PropTypes.object,
  data: PropTypes.object.isRequired,
  filterHandlers: PropTypes.object,
  showPackages: PropTypes.bool,
  showTitles: PropTypes.bool,
};

export default Filters;
