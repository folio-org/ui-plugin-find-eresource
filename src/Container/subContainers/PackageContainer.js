/* This Container will handle the use case for Package plugin */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { generateKiwtQueryParams } from '@k-int/stripes-kint-components';

import { AppIcon, useOkapiKy } from '@folio/stripes/core';
import { useInfiniteFetch } from '@folio/stripes-erm-components';

import View from '../../View';
import {
  FETCH_INCREMENT,
  PACKAGES_ENDPOINT,
} from '../../constants';

const PackageContainer = ({
  onSelectRow,
  sharedData = {},
  showPackages = true,
  showTitles = false,
}) => {
  const ky = useOkapiKy();
  const searchField = useRef();

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []); // This isn't particularly great, but in the interests of saving time migrating, it will have to do

  // We only need local session query here, use state
  const [query, setQuery] = useState({});
  const querySetter = ({ nsValues }) => {
    setQuery({ ...query, ...nsValues });
  };
  const queryGetter = () => query;

  const eresourcesQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      searchKey: 'name,identifiers.identifier.value,alternateResourceNames.name,description',
      filterKeys: {
        contentType: 'contentTypes.contentType.value',
        remoteKb: 'remoteKb.id',
        scope: 'availabilityScope.value',
        status: 'lifecycleStatus.value',
        tags: 'tags.value',
        publicationType: 'publicationType.value',
        type: 'type.value'
      },
      perPage: FETCH_INCREMENT,
    }, (query ?? {}))
  ), [query]);

  const {
    infiniteQueryObject: {
      error: eresourcesError,
      fetchNextPage: fetchNextEresourcesPage,
      isLoading: areEresourcesLoading,
      isError: isEresourcesError
    },
    results: eresources = [],
    total: eresourcesCount = 0
  } = useInfiniteFetch(
    ['ERM', 'Packages', eresourcesQueryParams, PACKAGES_ENDPOINT],
    ({ pageParam = 0 }) => {
      const params = [...eresourcesQueryParams, `offset=${pageParam}`];
      return ky.get(`${PACKAGES_ENDPOINT}?${params?.join('&')}`).json();
    }
  );

  /*
   * We are splitting the Joint/Package/Title sections,
   * so any specific SASQ props live at this level now, eg
   * "initialFilterState" or "sortableColumns"
   *
   * Also make use of this for any other props that may change at the view level,
   * such as the app icon and label
   */
  return (
    <View
      appIcon={<AppIcon app="agreements" iconKey="package" />}
      data={{
        eresources,
        ...sharedData
      }}
      initialFilterState={{}}
      initialSearchState={{ query: '' }}
      initialSortState={{ sort: 'name' }}
      onNeedMoreData={(_askAmount, index) => fetchNextEresourcesPage({ pageParam: index })}
      onSelectRow={onSelectRow}
      paneTitle={<FormattedMessage id="ui-plugin-find-eresource.packages" />}
      queryGetter={queryGetter}
      querySetter={querySetter}
      /*
       * Technically we don't need to pass these two props,
       * since we know what combination led to this Container,
       * but for consistency we'll leave it for all 3.
       */
      showPackages={showPackages}
      showTitles={showTitles}
      sortableColumns={['name']}
      source={{ // Fake source from useQuery return values;
        totalCount: () => eresourcesCount,
        loaded: () => !areEresourcesLoading,
        pending: () => areEresourcesLoading,
        failure: () => isEresourcesError,
        failureMessage: () => eresourcesError.message
      }}
      syncToLocationSearch={false}
    />
  );
};

PackageContainer.propTypes = {
  onSelectRow: PropTypes.func.isRequired,
  sharedData: PropTypes.object,
  showPackages(props) {
    if (props.showTitles === false && props.showPackages === false) {
      return new Error('Both showTitles and showPackages props cannot be false');
    }
    return null;
  },
  showTitles: PropTypes.bool,
};

export default PackageContainer;
