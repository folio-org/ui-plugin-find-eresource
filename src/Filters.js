import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, AccordionSet, FilterAccordionHeader, Selection } from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

const FILTERS = [
  'type',
];

export default class EResourceFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    data: PropTypes.object.isRequired,
    filterHandlers: PropTypes.object,
    showPackages: PropTypes.bool,
  };

  static defaultProps = {
    activeFilters: {
      class: [],
      type: [],
    },
    showPackages: false
  };

  state = {
    type: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};

    FILTERS.forEach(filter => {
      const values = props.data[`${filter}Values`] || [];
      if (values.length !== state[filter].length) {
        newState[filter] = values.map(({ label }) => ({ label, value: label }));
      }
    });

    if (Object.keys(newState).length) return newState;

    return null;
  }

  renderIsPackageFilter = () => {
    const { activeFilters } = this.props;
    const groupFilters = activeFilters.class || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-is-package"
        label={<FormattedMessage id="ui-plugin-find-eresource.prop.isPackage" />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup('class'); }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={[
            { value: 'package', label: <FormattedMessage id="ui-plugin-find-eresource.yes" /> },
            { value: 'nopackage', label: <FormattedMessage id="ui-plugin-find-eresource.no" /> },
          ]}
          name="class"
          onChange={group => {
            this.props.filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  }

  renderCheckboxFilter = (name) => {
    const { activeFilters } = this.props;
    const groupFilters = activeFilters[name] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${name}`}
        label={<FormattedMessage id={`ui-plugin-find-eresource.prop.${name}`} />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup(name); }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={this.state[name]}
          name={name}
          onChange={group => {
            this.props.filterHandlers.state({
              ...activeFilters,
              [group.name]: group.values
            });
          }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  }

  renderRemoteKbFilter = () => {
    const remoteKbValues = this.props.data.sourceValues;
    const dataOptions = remoteKbValues.map(remoteKb => ({
      label: remoteKb.name,
      value: remoteKb.id,
    }));

    const { activeFilters } = this.props;
    const remoteKbFilters = activeFilters.remoteKb || [];

    return (
      <Accordion
        displayClearButton={remoteKbFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-remoteKb"
        label={<FormattedMessage id="ui-plugin-find-eresource.prop.sourceKb" />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup('remoteKb'); }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          id="remoteKb-filter"
          onChange={value => this.props.filterHandlers.state({ ...activeFilters, remoteKb: [value] })}
          value={remoteKbFilters[0] || ''}
        />
      </Accordion>
    );
  }

  render() {
    const { showPackages } = this.props;
    return (
      <AccordionSet>
        {!showPackages && this.renderCheckboxFilter('type')}
        {!showPackages && this.renderIsPackageFilter()}
        {this.renderRemoteKbFilter()}
      </AccordionSet>
    );
  }
}
