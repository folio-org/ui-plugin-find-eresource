import {
  interactor,
  scoped,
  collection,
  clickable,
  fillable,
  is,
  isPresent,
} from '@bigtest/interactor';

import css from '../../src/EresourceSearch/EresourceSearch.css';

@interactor class SearchField {
  static defaultScope = '[data-test-eresource-search-input]';
  fill = fillable();
}

@interactor class PluginModalInteractor {
  isPackageFilterPresent = isPresent('#accordion-toggle-button-filter-accordion-is-package')
  isTypeFilterPresent = isPresent('#accordion-toggle-button-filter-accordion-type')
  isRemoteKbFilterPresent = isPresent('#accordion-toggle-button-filter-accordion-remoteKb');

  clickPackagesFilter = clickable('#clickable-filter-class-package');
  clickNonPackagesFilter = clickable('#clickable-filter-class-nopackage');
  clickJournalFilter = clickable('#clickable-filter-type-journal');
  clickBookFilter = clickable('#clickable-filter-type-book');

  instances = collection('[role="rowgroup"] [role="row"]', {
    click: clickable('[role=gridcell]'),
  });

  resetButton = scoped('#clickable-reset-all', {
    isEnabled: is(':not([disabled])'),
    click: clickable()
  });

  searchField = scoped('[data-test-eresource-search-input]', SearchField);
  searchButton = scoped('#clickable-search-eresources', {
    click: clickable(),
    isEnabled: is(':not([disabled])'),
  });
}

@interactor class FindEresourceInteractor {
  button = scoped('[data-test-plugin-eresource-button]', {
    click: clickable(),
  });

  closeButton = scoped('#plugin-find-eresource-modal-close-button', {
    click: clickable(),
  });

  modal = new PluginModalInteractor(`.${css.modalContent}`);
}

export default FindEresourceInteractor;
