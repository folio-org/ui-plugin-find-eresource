import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { AppIcon } from '@folio/stripes/core';

import {
  MultiColumnList,
  SearchField,
  Pane,
  Icon,
  Button,
  PaneMenu,
  Paneset,
} from '@folio/stripes/components';

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
import Filters from '../Filters';

import css from './View.css';

/*
 * Bear in mind that we have split the plugin into 3,
 * but from the View down all options are managed by
 * the same components, so need to cater for Packages AND Titles
 * (and all combinations thereof)
 */
const EResources = ({
  appIcon,
  data = {},
  iconKey = 'eresource',
  initialFilterState = {},
  initialSearchState = { query: '' },
  initialSortState = { sort: 'name' },
  onNeedMoreData,
  onSelectRow,
  paneTitle,
  queryGetter,
  querySetter,
  selectedRecordId,
  sortableColumns = ['name'],
  source,
  showPackages,
  showTitles,
  syncToLocationSearch,
  visibleColumns = ['name', 'type', 'isbn', 'eissn', 'pissn']
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
        initialFilterState={initialFilterState}
        initialSearchState={initialSearchState}
        initialSortState={initialSortState}
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
                  appIcon={appIcon}
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
                  paneSub={
                    source && source.loaded() ?
                      <FormattedMessage id="stripes-smart-components.searchResultsCountHeader" values={{ count }} /> :
                      <FormattedMessage id="stripes-smart-components.searchCriteria" />
                  }
                  paneTitle={paneTitle}
                >
                  <MultiColumnList
                    autosize
                    columnMapping={{
                      name: <FormattedMessage id="ui-plugin-find-eresource.prop.name" />,
                      type: <FormattedMessage id="ui-plugin-find-eresource.prop.type" />,
                      publicationType: <FormattedMessage id="ui-plugin-find-eresource.prop.publicationType" />,
                      isbn: <FormattedMessage id="ui-plugin-find-eresource.prop.isbn" />,
                      eissn: <FormattedMessage id="ui-plugin-find-eresource.prop.eissn" />,
                      pissn: <FormattedMessage id="ui-plugin-find-eresource.prop.pissn" />,
                      source: <FormattedMessage id="ui-plugin-find-eresource.prop.source" />,
                      status: <FormattedMessage id="ui-plugin-find-eresource.prop.status" />,
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
                      name: e => {
                        return (
                          <AppIcon
                            app="agreements"
                            iconAlignment="baseline"
                            iconKey={iconKey}
                            size="small"
                          >
                            {e._object?.longName ?? e.name}
                          </AppIcon>
                        );
                      },
                      type: e => <EResourceType resource={e} />,
                      publicationType: e => <EResourceType resource={e} />,
                      isbn: e => getResourceIdentifier(e._object, 'isbn'),
                      eissn: e => getResourceIdentifier(e._object, 'eissn'),
                      pissn: e => getResourceIdentifier(e._object, 'pissn') ?? getSiblingIdentifier(e._object, 'issn'),
                      source: e => (e.source),
                      status: e => (e.lifecycleStatus?.label),
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
                    onRowClick={onSelectRow}
                    pageAmount={100}
                    pagingType="click"
                    sortDirection={sortOrder.startsWith('-') ? 'descending' : 'ascending'}
                    sortOrder={sortOrder.replace(/^-/, '').replace(/,.*/, '')}
                    totalCount={count}
                    virtualize
                    visibleColumns={visibleColumns}
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

EResources.propTypes = {
  appIcon: PropTypes.node,
  data: PropTypes.shape({
    eresources: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  iconKey: PropTypes.string,
  initialFilterState: PropTypes.object,
  initialSearchState: PropTypes.object,
  initialSortState: PropTypes.object,
  onNeedMoreData: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  paneTitle: PropTypes.node,
  queryGetter: PropTypes.func.isRequired,
  querySetter: PropTypes.func.isRequired,
  selectedRecordId: PropTypes.string,
  showPackages: PropTypes.bool,
  showTitles: PropTypes.bool,
  sortableColumns: PropTypes.arrayOf(PropTypes.string),
  source: PropTypes.shape({
    loaded: PropTypes.func,
    totalCount: PropTypes.func,
  }),
  syncToLocationSearch: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string)
};

export default EResources;
