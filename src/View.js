import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  SearchField,
  Pane,
  Icon,
  Button,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes/core';

import {
  SearchAndSortNoResultsMessage,
  SearchAndSortQuery,
  SearchAndSortSearchButton as FilterPaneToggle,
} from '@folio/stripes/smart-components';

import Filters from './Filters';

import {
  EResourceType,
  getResourceIdentifier,
  getSiblingIdentifier
} from './utilities';

import css from './View.css';

const propTypes = {
  children: PropTypes.object,
  data: PropTypes.shape({
    eresources: PropTypes.array.isRequired,
  }),
  onNeedMoreData: PropTypes.func.isRequired,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  selectedRecordId: PropTypes.string,
  source: PropTypes.shape({
    loaded: PropTypes.func,
    totalCount: PropTypes.func,
  }),
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

const EResources = ({
  children,
  data = {},
  onNeedMoreData,
  queryGetter,
  querySetter,
  selectedRecordId,
  source,
  visibleColumns
}) => {
  const count = source?.totalCount() ?? 0;
  const query = queryGetter() ?? {};
  const sortOrder = query.sort ?? '';

  const searchField = useRef(null);

  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);
  const toggleFilterPane = () => setFilterPaneIsVisible(!filterPaneIsVisible);

  return (
    <div data-test-eresources>
      <SearchAndSortQuery
        initialFilterState={{
          class: ['package']
        }}
        initialSearchState={{ query: '' }}
        initialSortState={{ sort: 'name' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
        sortableColumns={['name', 'type']}
      >
        {
          ({
            searchValue,
            getSearchHandlers,
            onSubmitSearch,
            onSort,
            getFilterHandlers,
            activeFilters,
            filterChanged,
            searchChanged,
            resetAll,
          }) => {
            const disableReset = () => (!filterChanged && !searchChanged);

            return (
              <Paneset id="eresources-paneset">
                {filterPaneIsVisible &&
                  <Pane
                    defaultWidth="20%"
                    id="pane-eresources-search"
                    paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
                  >
                    <form onSubmit={onSubmitSearch}>
                      <div className={css.searchGroupWrap}>
                        <FormattedMessage id="ui-plugin-find-eresource.searchInputLabel">
                          {ariaLabel => (
                            <SearchField
                              aria-label={ariaLabel}
                              autoFocus
                              className={css.searchField}
                              data-test-eresource-search-input
                              id="input-eresource-search"
                              inputRef={searchField}
                              marginBottom0
                              name="query"
                              onChange={getSearchHandlers().query}
                              onClear={getSearchHandlers().reset}
                              value={searchValue.query}
                            />
                          )}
                        </FormattedMessage>
                        <Button
                          buttonStyle="primary"
                          disabled={!searchValue.query || searchValue.query === ''}
                          fullWidth
                          id="clickable-search-eresources"
                          marginBottom0
                          type="submit"
                        >
                          <FormattedMessage id="stripes-smart-components.search" />
                        </Button>
                      </div>
                      <div className={css.resetButtonWrap}>
                        <Button
                          buttonStyle="none"
                          disabled={disableReset()}
                          id="clickable-reset-all"
                          onClick={resetAll}
                        >
                          <Icon icon="times-circle-solid">
                            <FormattedMessage id="stripes-smart-components.resetAll" />
                          </Icon>
                        </Button>
                      </div>
                      <Filters
                        activeFilters={activeFilters.state}
                        data={data}
                        filterHandlers={getFilterHandlers()}
                      />
                    </form>
                  </Pane>
                }
                <Pane
                  appIcon={<AppIcon app="agreements" />}
                  defaultWidth="fill"
                  firstMenu={(filters) => {
                    const filterCount = filters.string !== '' ? filters.string.split(',').length : 0;
                    const hideOrShowMessageId = filterPaneIsVisible ?
                      'stripes-smart-components.hideSearchPane' : 'stripes-smart-components.showSearchPane';

                    return (
                      <PaneMenu>
                        <FormattedMessage id="stripes-smart-components.numberOfFilters" values={{ count: filterCount }}>
                          {appliedFiltersMessage => (
                            <FormattedMessage id={hideOrShowMessageId}>
                              {hideOrShowMessage => (
                                <FilterPaneToggle
                                  aria-label={`${hideOrShowMessage}...s${appliedFiltersMessage}`}
                                  badge={!filterPaneIsVisible && filterCount ? filterCount : undefined}
                                  onClick={toggleFilterPane}
                                  visible={filterPaneIsVisible}
                                />
                              )}
                            </FormattedMessage>
                          )}
                        </FormattedMessage>
                      </PaneMenu>
                    );
                  }}
                  id="pane-eresources-list"
                  padContent={false}
                  paneSub={() => {
                    if (source && source.loaded()) {
                      return <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} />;
                    }
                    return <FormattedMessage id="stripes-smart-components.searchCriteria" />;
                  }
                  }
                  paneTitle={<FormattedMessage id="ui-plugin-find-eresource.eresources" />}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={{
                      name: <FormattedMessage id="ui-plugin-find-eresource.prop.name" />,
                      type: <FormattedMessage id="ui-plugin-find-eresource.prop.type" />,
                      isbn: <FormattedMessage id="ui-plugin-find-eresource.prop.isbn" />,
                      eissn: <FormattedMessage id="ui-plugin-find-eresource.prop.eissn" />,
                      pissn: <FormattedMessage id="ui-plugin-find-eresource.prop.pissn" />,
                    }}
                    columnWidths={{
                      name: 300,
                      type: 100,
                      isbn: 150,
                      eissn: 150,
                      pissn: 150,
                    }}
                    contentData={data.eresources}
                    formatter={{
                      name: e => e._object?.longName ?? e.name,
                      type: e => <EResourceType resource={e} />,
                      isbn: e => getResourceIdentifier(e._object, 'isbn'),
                      eissn: e => getResourceIdentifier(e._object, 'eissn'),
                      pissn: e => getResourceIdentifier(e._object, 'pissn') ?? getSiblingIdentifier(e._object, 'issn'),
                    }}
                    id="list-eresources"
                    isEmptyMessage={
                      source ? (
                        <div data-test-eresources-no-results-message>
                          <SearchAndSortNoResultsMessage
                            filterPaneIsVisible
                            searchTerm={query.query ?? ''}
                            source={source}
                            toggleFilterPane={toggleFilterPane}
                          />
                        </div>
                      ) : '...'
                    }
                    isSelected={({ item }) => item.id === selectedRecordId}
                    onHeaderClick={onSort}
                    onNeedMoreData={onNeedMoreData}
                    pageAmount={100}
                    pagingType="click"
                    sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    virtualize
                    visibleColumns={visibleColumns}
                  />
                </Pane>
                {children}
              </Paneset>
            );
          }
        }
      </SearchAndSortQuery>
    </div>
  );
};

EResources.propTypes = propTypes;
EResources.defaultProps = {
  visibleColumns: ['name', 'type', 'isbn', 'eissn', 'pissn']
};
export default EResources;
