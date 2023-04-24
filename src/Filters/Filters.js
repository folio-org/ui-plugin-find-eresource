import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader, Selection } from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

const FILTERS = [
  'availability',
  'contentType',
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

  return (
    <AccordionSet>
      {showTitles && renderCheckboxFilter('type')}
      {showTitles && showPackages && renderIsPackageFilter()}
      {showPackages && renderRemoteKbFilter()}
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
