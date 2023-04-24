import {
  mockKintComponents,
  mockErmComponents,
  renderWithIntl
} from '@folio/stripes-erm-testing';

import { MemoryRouter } from 'react-router-dom';

import translationsProperties from '../../test/helpers';

import Container from './Container';

jest.mock('@k-int/stripes-kint-components', () => ({
  ...jest.requireActual('@k-int/stripes-kint-components'),
  ...mockKintComponents
}));

jest.mock('@folio/stripes-erm-components', () => ({
  ...jest.requireActual('@folio/stripes-erm-components'),
  ...mockErmComponents
}));

const onSelectRow = jest.fn();

jest.mock('./subContainers/JointContainer', () => () => <div>JointContainer</div>);
jest.mock('./subContainers/PackageContainer', () => () => <div>PackageContainer</div>);
jest.mock('./subContainers/TitleContainer', () => () => <div>TitleContainer</div>);

describe('Container', () => {
  let renderComponent;
  describe('Container with showPackage and showTitle', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Container
            onSelectRow={onSelectRow}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the JointContainer component', () => {
      const { getByText } = renderComponent;
      expect(getByText('JointContainer')).toBeInTheDocument();
    });
  });

  describe('Container with showPackage', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Container
            onSelectRow={onSelectRow}
            showTitles={false}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the PackageContainer component', () => {
      const { getByText } = renderComponent;
      expect(getByText('PackageContainer')).toBeInTheDocument();
    });
  });

  describe('Container with showTitle', () => {
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <Container
            onSelectRow={onSelectRow}
            showPackages={false}
          />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the TitleContainer component', () => {
      const { getByText } = renderComponent;
      expect(getByText('TitleContainer')).toBeInTheDocument();
    });
  });
});
