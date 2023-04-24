import PropTypes from 'prop-types';
import { useQuery } from 'react-query';

import { useRefdata } from '@k-int/stripes-kint-components';

import { useOkapiKy } from '@folio/stripes/core';
import { getRefdataValuesByDesc } from '@folio/stripes-erm-components';

import {
  AVAILABILITY_CONSTRAINT,
  CONTENT_TYPE,
  KBS_ENDPOINT,
  LIFECYCLE_STATUS,
  PUB_TYPE,
  REFDATA_ENDPOINT,
  SCOPE,
  TYPE
} from '../constants';

import {
  JointContainer,
  PackageContainer,
  TitleContainer
} from './subContainers';

/* This single plugin is going to handle:
 *   Package/Title,
 *   Package
 *   Title
 * plugin duties. Work out which is which here
 * and split to 3 separate subContainers
 */
const Container = ({
  onSelectRow,
  showPackages = true,
  showTitles = true,
}) => {
  const ky = useOkapiKy();

  const refdata = useRefdata({
    desc: [
      AVAILABILITY_CONSTRAINT,
      CONTENT_TYPE,
      LIFECYCLE_STATUS,
      PUB_TYPE,
      SCOPE,
      TYPE
    ],
    endpoint: REFDATA_ENDPOINT
  });

  const { data: kbs = [] } = useQuery(
    ['ERM', 'KnowledgeBases', KBS_ENDPOINT],
    () => ky.get(KBS_ENDPOINT).json()
  );

  const sharedData = {
    availabilityValues: getRefdataValuesByDesc(refdata, AVAILABILITY_CONSTRAINT),
    contentTypeValues: getRefdataValuesByDesc(refdata, CONTENT_TYPE),
    publicationTypeValues: getRefdataValuesByDesc(refdata, PUB_TYPE),
    scopeValues: getRefdataValuesByDesc(refdata, SCOPE),
    sourceValues: kbs,
    statusValues: getRefdataValuesByDesc(refdata, LIFECYCLE_STATUS),
    typeValues: getRefdataValuesByDesc(refdata, TYPE),
  };

  if (showPackages && showTitles) {
    return (
      <JointContainer
        onSelectRow={onSelectRow}
        sharedData={sharedData}
        showPackages={showPackages}
        showTitles={showTitles}
      />
    );
  }

  if (showPackages) {
    return (
      <PackageContainer
        onSelectRow={onSelectRow}
        sharedData={sharedData}
        showPackages={showPackages}
        showTitles={showTitles}
      />
    );
  }

  if (showTitles) {
    return (
      <TitleContainer
        onSelectRow={onSelectRow}
        sharedData={sharedData}
        showPackages={showPackages}
        showTitles={showTitles}
      />
    );
  }

  return (
    <div>At least one of showTitles or showPackages must be true</div>
  );
};

Container.propTypes = {
  onSelectRow: PropTypes.func.isRequired,
  showPackages(props) {
    if (props.showTitles === false && props.showPackages === false) {
      return new Error('Both showTitles and showPackages props cannot be false');
    }
    return null;
  },
  showTitles: PropTypes.bool,
};

export default Container;
