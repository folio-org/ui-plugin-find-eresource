import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { useQuery } from 'react-query';

import { generateKiwtQueryParams, useRefdata } from '@k-int/stripes-kint-components';

import { useOkapiKy } from '@folio/stripes/core';
import { getRefdataValuesByDesc, useInfiniteFetch } from '@folio/stripes-erm-components';

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

  // We only need local session query here, use state
  const [query, setQuery] = useState({});
  const querySetter = ({ nsValues }) => {
    setQuery({ ...query, ...nsValues });
  };
  const queryGetter = () => query;

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
      perPage: RESULT_COUNT_INCREMENT,
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
    ['ERM', 'EResources', eresourcesQueryParams, ERESOURCES_ELECTRONIC_ENDPOINT],
    ({ pageParam = 0 }) => {
      const params = [...eresourcesQueryParams, `offset=${pageParam}`];
      return ky.get(encodeURI(`${ERESOURCES_ELECTRONIC_ENDPOINT}?${params?.join('&')}`)).json();
    }
  );

  const kbsPath = 'erm/kbs';
  const { data: kbs = [] } = useQuery(
    ['ERM', 'KnowledgeBases', kbsPath],
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
