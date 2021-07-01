import React from 'react';
import PropTypes from 'prop-types';
import EresourceSearch from './src/EresourceSearch';
import EresourceSearchModal from './src/Modal';

function PluginFindEresource(props) {
  return (props.justDisplayModal ?
    <EresourceSearchModal {...props} /> :
    <EresourceSearch {...props} />);
}

PluginFindEresource.propTypes = {
  justDisplayModal: PropTypes.bool,
};

export default PluginFindEresource;
