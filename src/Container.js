import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { StripesConnectedSource } from '@folio/stripes/smart-components';
import { getSASParams } from '@folio/stripes-erm-components';

import View from './View';

const RESULT_COUNT_INCREMENT = 100;

export default class Container extends React.Component {
  static manifest = Object.freeze({
    eresources: {
      type: 'okapi',
      path: 'erm/resource/electronic',
      records: 'results',
      resultOffset: '%{resultOffset}',
      perRequest: RESULT_COUNT_INCREMENT,
      limitParam: 'perPage',
      params: getSASParams({
        searchKey: 'name,identifiers.identifier.value',
        filterConfig: [{
          name: 'class',
          values: [
            { name: 'package', value: 'org.olf.kb.Pkg' },
            { name: 'nopackage', value: 'org.olf.kb.TitleInstance' },
          ]
        }],
        filterKeys: {
          remoteKb: 'remoteKb.id',
          package: 'org.olf.kb.Pkg'
        },
        queryGetter: r => r.eresourceSearchParams,
      }),
    },
    sourceValues: {
      type: 'okapi',
      path: 'erm/kbs',
      shouldRefresh: () => false,
    },
    typeValues: {
      type: 'okapi',
      path: 'erm/refdata/TitleInstance/type',
      perRequest: 100,
      limitParam: 'perPage',
    },
    eresourceSearchParams: {
      initialValue: {
        filters: 'class.package',
        sort: 'name',
      }
    },
    resultOffset: { initialValue: 0 },
  });

  static propTypes = {
    mutator: PropTypes.object,
    onSelectRow: PropTypes.func.isRequired,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      logger: PropTypes.object,
    }),
  }

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();
  }

  componentDidMount() {
    this.source = new StripesConnectedSource(this.props, this.logger, 'eresources');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }

    this.props.mutator.eresourceSearchParams.update({
      filters: 'class.package'
    });
  }

  handleNeedMoreData = (_askAmount, index) => {
    if (this.source && index > 0) {
      this.source.fetchOffset(index);
    } else {
      this.source.fetchMore(RESULT_COUNT_INCREMENT);
    }
  }

  querySetter = ({ nsValues, state }) => {
    if (/reset/.test(state.changeType)) {
      this.props.mutator.eresourceSearchParams.replace(nsValues);
    } else {
      this.props.mutator.eresourceSearchParams.update(nsValues);
    }
  }

  queryGetter = () => {
    return get(this.props.resources, 'eresourceSearchParams', {});
  }

  render() {
    const { onSelectRow, resources } = this.props;

    if (this.source) {
      this.source.update(this.props, 'eresources');
    }

    return (
      <View
        data={{
          eresources: get(resources, 'eresources.records', []),
          sourceValues: get(resources, 'sourceValues.records', []),
          typeValues: get(resources, 'typeValues.records', []),
        }}
        onNeedMoreData={this.handleNeedMoreData}
        onSelectRow={onSelectRow}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        source={this.source}
        syncToLocationSearch={false}
      />
    );
  }
}
