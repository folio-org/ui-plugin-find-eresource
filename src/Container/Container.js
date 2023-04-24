import PropTypes from 'prop-types';
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
  if (showPackages && showTitles) {
    return (
      <JointContainer
        onSelectRow={onSelectRow}
        showPackages={showPackages}
        showTitles={showTitles}
      />
    );
  }

  if (showPackages) {
    return (
      <PackageContainer
        onSelectRow={onSelectRow}
        showPackages={showPackages}
        showTitles={showTitles}
      />
    );
  }

  if (showTitles) {
    return (
      <TitleContainer
        onSelectRow={onSelectRow}
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
