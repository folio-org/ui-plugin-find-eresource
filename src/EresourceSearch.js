import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from '@folio/stripes/components';
import contains from 'dom-helpers/query/contains';
import Modal from './Modal';

const triggerId = 'find-eresource-trigger';

export default class EresourceSearch extends React.Component {
  static propTypes = {
    renderTrigger: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.modalRef = React.createRef();
    this.modalTrigger = React.createRef();
    this.state = {
      open: false,
    };
  }

  openModal = () => {
    this.setState({ open: true });
  }

  closeModal = () => {
    this.setState({ open: false }, () => {
      if (this.modalRef.current && this.modalTrigger.current) {
        if (contains(this.modalRef.current, document.activeElement)) {
          this.modalTrigger.current.focus();
        }
      }
    });
  }

  renderDefaultTrigger() {
    return (
      <Button
        buttonRef={this.modalTrigger}
        buttonStyle="primary noRightRadius"
        id={triggerId}
        onClick={this.openModal}
      >
        <Icon color="#fff" icon="search" />
      </Button>
    );
  }

  renderTriggerButton() {
    const {
      renderTrigger,
    } = this.props;

    return renderTrigger
      ? renderTrigger({
        buttonRef: this.modalTrigger,
        id: triggerId,
        onClick: this.openModal,
      })
      : this.renderDefaultTrigger();
  }

  render() {
    return (
      <>
        {this.renderTriggerButton()}
        <Modal
          modalRef={this.modalRef}
          onClose={this.closeModal}
          open={this.state.open}
          {...this.props}
        />
      </>

    );
  }
}
