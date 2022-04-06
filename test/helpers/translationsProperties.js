import translations from '../../translations/ui-plugin-find-eresource/en';

const translationsProperties = [
  {
    prefix: 'ui-plugin-find-eresource',
    translations,
  },
  {
    prefix: 'stripes-core',
    translations: {
      'label.missingRequiredField': 'Please fill this in to continue',
      'button.save': 'Save',
      'stripes-components.saveAndClose': 'Save and close',
      'stripes-components.cancel': 'Cancel',
      'button.delete': 'Delete',
      'button.edit': 'Edit'
    }
  },
  {
    prefix: 'stripes-components',
    translations: {
      'saveAndClose': 'Save and close',
      'cancel': 'Cancel',
      'paneMenuActionsToggleLabel': 'Actions',
      'collapseAll': 'Collapse all',
      'button.edit': 'Edit'
    },
  },
  {
    prefix: 'stripes-smart-components',
    translations: {
      'permissionError': 'Sorry - your permissions do not allow access to this page.',
      'searchAndFilter': 'Search and filter',
      'hideSearchPane': 'Hide search pane',
      'search': 'Search',
      'resetAll': 'Reset all',
      'searchResultsCountHeader': '"{count, number} {count, plural, one {record found} other {records found}}"',
      'new': 'New'
    },
  }
];

export default translationsProperties;
