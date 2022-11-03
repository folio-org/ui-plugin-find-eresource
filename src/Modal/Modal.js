import { React, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal } from '@folio/stripes/components';

import Container from '../Container';
import css from '../View';

const EresourceSearchModal = (props) => {
  const {
    modalRef,
    onClose,
    onEresourceSelected,
    open,
    modalLabel
  } = props;

  const backupModalRef = useRef();
  const theModalRef = modalRef || backupModalRef;

  const selectEresource = (e, eresource) => {
    onEresourceSelected(eresource);
    onClose(e);
  };

  return (
    <FormattedMessage id="ui-plugin-find-eresource.selectEresource">
      {label => (
        <Modal
          ref={theModalRef}
          contentClass={css.modalContent}
          dismissible
          enforceFocus={false}
          id="plugin-find-eresource-modal"
          label={modalLabel || label}
          onClose={onClose}
          open={open}
          size="large"
        >
          <Container
            {...props}
            onSelectRow={selectEresource}
          />
        </Modal>
      )}
    </FormattedMessage>
  );
};

EresourceSearchModal.propTypes = {
  dataKey: PropTypes.string,
  modalRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onEresourceSelected: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
  }),
  modalLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
};

export default EresourceSearchModal;
