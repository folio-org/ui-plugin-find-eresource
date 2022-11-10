import { React } from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../test/helpers';
import EresourceSearchModal from './Modal';

jest.mock('../Container', () => {
  // eslint-disable-next-line react/prop-types
  return ({ onEresourceSelected }) => (
    <>
      <button
        onClick={() => onEresourceSelected({}, {})}
        type="button"
      >
        <div>SelectEresource</div>,
        <div>Container</div>
      </button>
    </>
  );
});

const onCloseModal = jest.fn();
const onEresourceSelected = jest.fn();
const open = true;

describe('Modal', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <EresourceSearchModal
          onClose={onCloseModal}
          onEresourceSelected={onEresourceSelected}
          open={open}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders the Container component', () => {
    const { getByText } = renderComponent;
    expect(getByText('Container')).toBeInTheDocument();
  });

  test('renders the SelectEresource', () => {
    const { getByText } = renderComponent;
    expect(getByText('SelectEresource')).toBeInTheDocument();
  });

  test('renders the expected heading', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('heading', { name: 'Select e-resource' }));
  });

  test('renders the expected button', () => {
    const { getByRole } = renderComponent;
    expect(getByRole('button', { name: 'stripes-components.dismissModal' }));
  });
});
