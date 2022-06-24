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
  CollapseFilterPaneButton,
  ExpandFilterPaneButton,
  SearchAndSortNoResultsMessage,
  SearchAndSortQuery,
} from '@folio/stripes/smart-components';

import {
  EResourceType,
  getResourceIdentifier,
  getSiblingIdentifier
} from '@folio/stripes-erm-components';
import Filters from './Filters';

import css from './View.css';

const propTypes = {
  data: PropTypes.shape({
    eresources: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  onNeedMoreData: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  selectedRecordId: PropTypes.string,
  showPackages: PropTypes.bool,
  showTitles: PropTypes.bool,
  source: PropTypes.shape({
    loaded: PropTypes.func,
    totalCount: PropTypes.func,
  }),
  syncToLocationSearch: PropTypes.bool
};

const EResources = ({
  data = {},
  onNeedMoreData,
  onSelectRow,
  queryGetter,
  querySetter,
  selectedRecordId,
  source,
  showPackages,
  showTitles,
  syncToLocationSearch
}) => {
  const count = source?.totalCount() ?? 0;
  const query = queryGetter() ?? {};
  const sortOrder = query.sort ?? '';

  const searchField = useRef(null);

  const [filterPaneIsVisible, setFilterPaneIsVisible] = useState(true);
  const toggleFilterPane = () => setFilterPaneIsVisible(!filterPaneIsVisible);
  let initialFilterState = {};
  let sortableColumns = ['name', 'type'];

  if (!showPackages) initialFilterState = { class: ['nopackage'] };
  else if (!showTitles) initialFilterState = { class: ['package'] };

  if (showPackages && !showTitles) sortableColumns = ['name'];

  return (
    <div data-test-eresources>
      <SearchAndSortQuery
        initialFilterState={initialFilterState}
        initialSearchState={{ query: '' }}
        // FIXME WIP the initialSortState does not get set
        initialSortState={{ sort: 'name' }}
        queryGetter={queryGetter}
        querySetter={querySetter}
        setQueryOnMount
        sortableColumns={sortableColumns}
        syncToLocationSearch={syncToLocationSearch}
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
            const filterCount = activeFilters.string ? activeFilters.string.split(',').length : 0;

            return (
              <Paneset id="eresources-paneset">
                {filterPaneIsVisible &&
                  <Pane
                    defaultWidth="20%"
                    id="pane-eresources-search"
                    lastMenu={
                      <PaneMenu>
                        <CollapseFilterPaneButton onClick={toggleFilterPane} />
                      </PaneMenu>
                    }
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
                        showPackages={showPackages}
                        showTitles={showTitles}
                      />
                    </form>
                  </Pane>
                }
                <Pane
                  appIcon={<AppIcon app="agreements" iconKey="eresource" />}
                  defaultWidth="fill"
                  firstMenu={
                    !filterPaneIsVisible ?
                      (
                        <PaneMenu>
                          <ExpandFilterPaneButton
                            filterCount={filterCount}
                            onClick={toggleFilterPane}
                          />
                        </PaneMenu>
                      )
                      :
                      null
                  }
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
                      source || (!showPackages && !showTitles) ? (
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
                    onRowClick={onSelectRow}
                    pageAmount={100}
                    pagingType="click"
                    sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    virtualize
                    visibleColumns={['name', 'type', 'isbn', 'eissn', 'pissn']}
                  />
                </Pane>
              </Paneset>
            );
          }
        }
      </SearchAndSortQuery>
    </div>
  );
};

EResources.propTypes = propTypes;

export default EResources;
