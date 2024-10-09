# Change history for ui-plugin-find-eresource

## 7.1.0 In progress

## 7.0.1 2024-03-22
* ERM-3129 Remove explicit typescript version
* Bumped folio dependencies
* *BREAKING* Change interface dependency for erm to just 7.0
* FOLIO-4086 Fix GitHub Actions workflow not running for tags

## 6.0.1 2023-11-09
* ERM-3079 Identifiers ISBN, ISSN (Online), ISSN (Print) do not display in e-resource plugin when doing title search

## 6.0.0 2023-10-12
* ERM-3032 *BREAKING* bump `react-intl` to `v6.4.4`.
* ERM-3001 Update Node.js to v18 in GitHub Actions
* ERM-2964 Reinstate defaultOpen and onClose prop in ui-plugin-find-eresource
* ERM-2918 Implement 25 results limit in ui-plugin-find-eresource
* ERM-2917 Implement new title search in ui-plugin-find-eresource
* ERM-2916 Implement new pakcage search in ui-pluging-find-eresource
* ERM-2641 Upgrade to Grails 5 (including Hibernate 5.6.x) for Poppy
  * Added okapi interface dependency on new erm interface 6.0
* STRIPES-870 *BREAKING* upgrade react to v18
  * ERM-2988 upgrade ui-plugin-find-eresource React to v18

## 5.0.2 2023-02-22
* ERM-2615 Drop unneeded `react-redux`.
* ERM-2558 Increment ui-plugin-find-eresource to Stripes v8
* ERM-2532 Remove BigTest/Nightmare dependencies and tests (ui-plugin-find-eresource)
* ERM-2459 Bump ui-plugin-find-eresource erm-components dep
* ERM-2413 Add test coverage for ui-plugin-find-eresource <Container>
* ERM-2412 Add test coverage for ui-plugin-find-eresource <Modal>
* ERM-2411 Add test coverage for ui-plugin-find-eresource <Filters>
* ERM-2410 Add test coverage for ui-plugin-find-eresource <Container>
* ERM-2393 Remove @folio/stripes-testing as direct dependency of ui-plugin-find-eresource
* ERM-1306 Add test coverage for ui-plugin-find-eresource <EresourceSearch>
* Remove karma test options from github release actions

## 4.3.0 2022-10-26
* ERM-2393 Remove @folio/stripes-testing as direct dependency of ui-plugin-find-eresource
* ERM-2381 query-string is incorrectly listed as a peer-dependency
* ERM-2375 Kint components dep not declared in ui-plugin-find-eresource
* ERM-2325 stripes-erm-components should be a peer
* ERM-2227 Karma tests fail on Github Actions CI with Node v14 and v16 LTS
* ERM-2220 ERM Comparisons: e-resources plugin is not filtering by Package when used for first time
  * As part of this, refactor to react-query
* ERM-2152 update outdated dependencies in ui-plugin-find-eresource
* Bump to stripes-erm-components ^7.0.0

## 4.2.0 2022-07-05
* ERM-2135 ui-plugin-find-eresource should use values not labels when apply filters
* ERM-2102 Replace babel-eslint with @babel/eslint-parser
* ERM-1971 Bump eslint-config stripes version
## 4.1.1 2022-03-03
* ERM-1996 Prepare Plugin Find Agreement for RTL development
* Updated stripes dependencies
## 4.0.0 2021-10-06
* Upgrade to stripes v7.
* Extend API to handle defaultOpen and onClose props.
* Included interface dependency for erm 5.0
* Add optional `modalLabel` prop to override default label.

## 2.1.0 2021-06-16
* ERM-1598 Add descriptions to visible permission set in ui-plugin-find-eresource

## 2.0.0 2021-03-18
* Upgrade to Stripes 6.0
* Bumped okapiInterface dep to erm 4.0
* Added devDep to stripes-cli

## 1.0.0 2020-10-15
* New plugin module created.
* Refactor from `bigtest/mirage` to `miragejs`
* Added tests for the plugin.
