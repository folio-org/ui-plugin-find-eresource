import React from 'react';
import noop from 'lodash/noop';
import { Pluggable } from '@folio/stripes/core';
import { Button } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

class PluginHarness extends React.Component {
  render() {
    return (
      <Pluggable
        aria-haspopup="true"
        dataKey="eresources"
        id="clickable-find-eresource"
        marginTop0
        onEresourceSelected={noop}
        renderTrigger={(props) => {
          const buttonProps = {
            'aria-haspopup': 'true',
            'buttonStyle': 'primary',
            'id': 'find-eresource-btn',
            'name': 'dummy',
            'onClick': props.onClick,
            'marginBottom0': true
          };

          return (
            <Button
              data-test-plugin-eresource-button
              {...buttonProps}
            >
              <FormattedMessage id="ui-plugin-find-eresource.selectEresource" />
            </Button>
          );
        }}
        searchButtonStyle="link"
        searchLabel="Look up eresources"
        type="find-eresource"
        {...this.props}
      />
    );
  }
}

export default PluginHarness;
