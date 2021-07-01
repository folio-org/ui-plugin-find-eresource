# ui-plugin-find-eresource

Copyright (C) 2020 The Open Library Foundation

This software is distributed under the terms of the Apache License,
Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

This package furnishes a single Stripes plugin of type `find-eresource`,
which can be included in Stripes modules by means of a `<Pluggable
type="find-eresource">` element. See [the *Plugins*
section](https://github.com/folio-org/stripes/blob/master/doc/dev-guide.md#plugins)
of the Module Developer's Guide.

## Props

| Name | Type | Description | Required | default |
--- | --- | --- | --- | --- |
| `onEresourceSelected` | func: (eresource) => {} | Callback fired when a user clicks an eresource | Yes | |
| `dataKey` | string | Optional `dataKey` passed to stripes/connect when creating the connected Eresources component. | | |
| `renderTrigger` | func: ({ triggerId, onClick, buttonRef }) => {} | Optional render function for the button to open the Eresource search modal. The `onClick` prop should be called when the trigger is clicked (assuming it is a Button). The `buttonRef` ensures that the trigger button is brought back into focus once the lookup modal is closed. | | |
| `showPackages` | boolean | Optional prop to only display the packages eresources and its necessary filters | | true |
| `showTitles` | boolean | Optional prop to only display the title eresources and its necessary filters | | true |
| `justDisplayModal` | boolean | Whether to directly display the eresource-choosing modal instead of the trigger | | false

**Note:** Both `showPackages` and `showTitles` props should not be passed as false. One of them needs to be true if at all both the props are being passed.

## Additional information

Other [modules](https://dev.folio.org/source-code/#client-side).

See project [ERM](https://issues.folio.org/browse/ERM)
at the [FOLIO issue tracker](https://dev.folio.org/guidelines/issue-tracker/).

Other FOLIO Developer documentation is at [dev.folio.org](https://dev.folio.org/)
