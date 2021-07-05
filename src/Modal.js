import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from '@folio/stripes/components';

import Container from './Container';
import css from './EresourceSearch.css';

export default class EresourceSearchModal extends React.Component {
  static propTypes = {
    dataKey: PropTypes.string,
    modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    onEresourceSelected: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    open: PropTypes.bool,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }),
  };

  static defaultProps = {
    dataKey: 'find-eresource',
  }

  constructor(props) {
    super(props);

    this.modalRef = props.modalRef || React.createRef();
    this.connectedContainer = props.stripes.connect(Container, { dataKey: props.dataKey });
  }

  selectEresource = (_, eresource) => {
    this.props.onEresourceSelected(eresource);
    this.props.onCloseModal();
  }

  render() {
    return (
      <FormattedMessage id="ui-plugin-find-eresource.selectEresource">
        {label => (
          <Modal
            ref={this.modalRef}
            contentClass={css.modalContent}
            dismissible
            enforceFocus={false}
            id="plugin-find-eresource-modal"
            label={label}
            onClose={this.props.onCloseModal}
            open={this.props.open}
            size="large"
          >
            <this.connectedContainer
              {...this.props}
              onSelectRow={this.selectEresource}
            />
          </Modal>
        )}
      </FormattedMessage>
    );
  }
}
