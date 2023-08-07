import { MemoryRouter } from 'react-router-dom';

import { Button, renderWithIntl } from '@folio/stripes-erm-testing';
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

  test('renders the expected heading name', () => {
    const { getByText } = renderComponent;
    expect(getByText('Select e-resource')).toBeInTheDocument();
  });

  test('renders the dexpected button', async () => {
    await Button('SelectEresource,Container').exists();
  });
});
