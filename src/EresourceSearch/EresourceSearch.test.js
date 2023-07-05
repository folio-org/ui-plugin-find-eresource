import { waitFor } from '@testing-library/dom';

import { Modal as MockModal } from '@folio/stripes/components';

import { Button } from '@folio/stripes-testing';

import {
  IconButtonInteractor as IconButton,
  mockKintComponents,
  renderWithIntl
} from '@folio/stripes-erm-testing';

import translationsProperties from '../../test/helpers';
import EresourceSearch from './EresourceSearch';

jest.mock('../Modal', () => ({
  defaultOpen: _defaultOpen,
  modalRef,
  ...props
}) => (
  <MockModal
    ref={modalRef}
    dismissible
    {...props}
  >
    Modal
  </MockModal>
));

jest.mock('@k-int/stripes-kint-components', () => ({
  ...jest.requireActual('@k-int/stripes-kint-components'),
  ...mockKintComponents
}));

const onCloseMock = jest.fn();

describe('EresourceSearch', () => {
  describe('without defaultOpen', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <EresourceSearch
          label="Test modal"
          onClose={onCloseMock}
        />,
        translationsProperties
      );
    });


    test('does not render the Modal component', async () => {
      const { queryByText } = renderComponent;

      expect(queryByText('Modal')).not.toBeInTheDocument();
      await Button().click();
      expect(queryByText('Modal')).toBeInTheDocument();
    });

    describe('opening the modal', () => {
      beforeEach(async () => {
        await Button().click();
      });

      test('renders the Modal component', async () => {
        const { queryByText } = renderComponent;
        expect(queryByText('Modal')).toBeInTheDocument();
      });

      describe('closing the modal', () => {
        beforeEach(async () => {
          await IconButton('Dismiss modal').click();
        });

        test('onClose was called', async () => {
          await waitFor(() => {
            expect(onCloseMock).toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe('with defaultOpen', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <EresourceSearch
          defaultOpen
          label="Test modal"
          onClose={onCloseMock}
        />,
        translationsProperties
      );
    });

    test('renders the Modal component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Modal')).toBeInTheDocument();
    });
  });
});
