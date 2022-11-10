import { React } from 'react';
import user from '@testing-library/user-event';

import {
  mockKintComponents,
  renderWithIntl
} from '@folio/stripes-erm-testing';
import translationsProperties from '../../test/helpers';
import EresourceSearch from './EresourceSearch';

jest.mock('../Modal', () => () => <div>Modal</div>);

jest.mock('@k-int/stripes-kint-components', () => ({
  ...jest.requireActual('@k-int/stripes-kint-components'),
  ...mockKintComponents
}));

const renderTrigger = jest.fn();
const onCloseMock = jest.fn();

describe('EresourceSearch', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <EresourceSearch
        onClose={onCloseMock}
        renderTrigger={renderTrigger}
      />,
      translationsProperties
    );
  });

  test('renders the Modal component', () => {
    const { getByText, queryByTestId } = renderComponent;
    user.click(queryByTestId('default-trigger'));
    expect(getByText('Modal')).toBeInTheDocument();
  });

  test('should handle renderTrigger', () => {
    expect(renderTrigger).toHaveBeenCalled();
  });
});
