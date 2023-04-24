/* This Container will handle the use case for Title plugin */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { useQuery } from 'react-query';

import { generateKiwtQueryParams, useRefdata } from '@k-int/stripes-kint-components';

import { AppIcon, useOkapiKy } from '@folio/stripes/core';
import { getRefdataValuesByDesc, useInfiniteFetch } from '@folio/stripes-erm-components';

import View from '../../View';
import {
  CONTENT_TYPE,
  FETCH_INCREMENT,
  KBS_ENDPOINT,
  LIFECYCLE_STATUS,
  TITLES_ENDPOINT,
  PUB_TYPE,
  REFDATA_ENDPOINT,
  SCOPE,
  TYPE
} from '../../constants';
import { FormattedMessage } from 'react-intl';

const TitleContainer = ({
  onSelectRow,
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

  const refdata = useRefdata({
    desc: [
      CONTENT_TYPE,
      LIFECYCLE_STATUS,
      PUB_TYPE,
      SCOPE,
      TYPE
    ],
    endpoint: REFDATA_ENDPOINT
  });

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
    ['ERM', 'Titles', eresourcesQueryParams, TITLES_ENDPOINT],
    ({ pageParam = 0 }) => {
      const params = [...eresourcesQueryParams, `offset=${pageParam}`];
      return ky.get(`${TITLES_ENDPOINT}?${params?.join('&')}`).json();
    }
  );

  const { data: kbs = [] } = useQuery(
    ['ERM', 'KnowledgeBases', KBS_ENDPOINT],
    () => ky.get(KBS_ENDPOINT).json()
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
      appIcon={<AppIcon app="agreements" iconKey="title" />}
      data={{
        eresources,
        sourceValues: kbs,
        typeValues: getRefdataValuesByDesc(refdata, TYPE),
      }}
      initialFilterState={{}}
      initialSearchState={{ query: '' }}
      initialSortState={{ sort: 'name' }}
      onNeedMoreData={(_askAmount, index) => fetchNextEresourcesPage({ pageParam: index })}
      onSelectRow={onSelectRow}
      paneTitle={<FormattedMessage id="ui-plugin-find-eresource.titles" />}
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

TitleContainer.propTypes = {
  onSelectRow: PropTypes.func.isRequired,
  showPackages(props) {
    if (props.showTitles === false && props.showPackages === false) {
      return new Error('Both showTitles and showPackages props cannot be false');
    }
    return null;
  },
  showTitles: PropTypes.bool,
};

export default TitleContainer;
