import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';

import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { getRefdataValuesByDesc, useInfiniteFetch } from '@folio/stripes-erm-components';
import { generateKiwtQueryParams, useKiwtSASQuery, useRefdata } from '@k-int/stripes-kint-components';

import View from './View';

const [
  CONTENT_TYPE,
  LIFECYCLE_STATUS,
  PUB_TYPE,
  SCOPE,
  TYPE
] = [
  'ContentType.ContentType',
  'Pkg.LifecycleStatus',
  'TitleInstance.PublicationType',
  'Pkg.AvailabilityScope',
  'TitleInstance.Type',
];

const RESULT_COUNT_INCREMENT = 100;
const ERESOURCES_ELECTRONIC_ENDPOINT = 'erm/resource/electronic';

const Container = ({
  onSelectRow,
  showPackages = true,
  showTitles = true,
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
    endpoint: 'erm/refdata'
  });

  const { query, querySetter, queryGetter } = useKiwtSASQuery();

  const filters = useMemo(() => {
    const filterArray = [];

    if (!showTitles) {
      filterArray.push({ path: 'class', value: 'org.olf.kb.Pkg' });
    }

    if (!showPackages) {
      filterArray.push({ path: 'class', value: 'org.olf.kb.TitleInstance' });
    }

    return (filterArray);
  }, [showTitles, showPackages]);

  const eresourcesQueryParams = useMemo(() => (
    generateKiwtQueryParams({
      searchKey: 'name,identifiers.identifier.value,alternateResourceNames.name,description',
      filterConfig: [{
        name: 'class',
        values: [
          { name: 'package', value: 'org.olf.kb.Pkg' },
          { name: 'nopackage', value: 'org.olf.kb.TitleInstance' },
        ]
      }],
      filterKeys: {
        contentType: 'contentTypes.contentType.value',
        remoteKb: 'remoteKb.id',
        scope: 'availabilityScope.value',
        status: 'lifecycleStatus.value',
        tags: 'tags.value',
        publicationType: 'publicationType.value',
        type: 'type.value'
      },
      filters,
      perPage: RESULT_COUNT_INCREMENT
    }, (query ?? {}))
  ), [filters, query]);

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
    [ERESOURCES_ELECTRONIC_ENDPOINT, eresourcesQueryParams, 'ui-agreements', 'EresourcesRoute', 'getEresources'],
    ({ pageParam = 0 }) => {
      const params = [...eresourcesQueryParams, `offset=${pageParam}`];
      return ky.get(encodeURI(`${ERESOURCES_ELECTRONIC_ENDPOINT}?${params?.join('&')}`)).json();
    }
  );

  const kbsPath = 'erm/kbs';
  const { data: kbs = [] } = useQuery(
    [kbsPath, 'ui-agreements', 'EresourcesRoute', 'getKbs'],
    () => ky.get(kbsPath).json()
  );

  return (
    <View
      data={{
        eresources,
        sourceValues: kbs,
        typeValues: getRefdataValuesByDesc(refdata, TYPE),
      }}
      onNeedMoreData={(_askAmount, index) => fetchNextEresourcesPage({ pageParam: index })}
      onSelectRow={onSelectRow}
      queryGetter={queryGetter}
      querySetter={querySetter}
      showPackages={showPackages}
      showTitles={showTitles}
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

Container.propTypes = {
  onSelectRow: PropTypes.func.isRequired,
  showPackages(props, propName) {
    if (!props.showTitles && !props[propName]) {
      return new Error(`Both showTitles and ${propName} props cannot be false`);
    }
    return null;
  },
  showTitles: PropTypes.bool,
};

export default Container;
