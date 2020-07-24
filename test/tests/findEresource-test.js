import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import chai from 'chai';
import faker from 'faker';
import spies from 'chai-spies';

import setupApplication, { mount } from '../helpers/helpers';
import PluginHarness from '../helpers/PluginHarness';
import FindEresourceInteractor from '../interactors/findEresource';

chai.use(spies);
const { expect, spy } = chai;

const onEresourceSelected = spy();

const journal = {
  'class': 'org.olf.kb.TitleInstance',
  'type': {
    id: '1',
    value: 'journal',
    label: 'Journal'
  }
};

const book = {
  'class': 'org.olf.kb.TitleInstance',
  'type': {
    id: faker.random.uuid(),
    value: 'book',
    label: 'Book'
  }
};

const eresourcePackage = {
  'class': 'org.olf.kb.Pkg',
};

const eresourcePackagesCount = 7;
const journalsCount = 8;
const booksCount = 9;

describe('UI-plugin-find-eresource', function () {
  const findEresource = new FindEresourceInteractor();
  setupApplication();

  beforeEach(async function () {
    await this.server.createList('eresource', eresourcePackagesCount, eresourcePackage);
    await this.server.createList('eresource', journalsCount, journal);
    await this.server.createList('eresource', booksCount, book);
  });

  describe('plugin', function () {
    beforeEach(async function () {
      await mount(
        <PluginHarness
          onEresourceSelected={onEresourceSelected}
        />
      );
    });

    it('renders trigger button', function () {
      expect(findEresource.button.isPresent).to.be.true;
    });

    describe('clicking the trigger button', function () {
      beforeEach(async function () {
        await findEresource.button.click();
      });

      it('opens a modal', function () {
        expect(findEresource.modal.isPresent).to.be.true;
      });

      it('displays eresources list', function () {
        expect(findEresource.modal.instances().length).to.equal(eresourcePackagesCount + journalsCount + booksCount);
      });

      it('should render the isPackage filter', function () {
        expect(findEresource.modal.isPackageFilterPresent).to.be.true;
      });

      it('should render the type filter', function () {
        expect(findEresource.modal.isTypeFilterPresent).to.be.true;
      });

      it('should render the external data source filter', function () {
        expect(findEresource.modal.isRemoteKbFilterPresent).to.be.true;
      });
    });

    describe('selecting an eresource', function () {
      beforeEach(async function () {
        await findEresource.button.click();
        await findEresource.modal.instances(1).click();
      });

      it('hides the modal', function () {
        expect(findEresource.modal.isPresent).to.be.false;
      });

      it('calls the onEresourceSelected callback', function () {
        expect(onEresourceSelected).to.have.been.called();
      });
    });

    describe('clicking the close button', function () {
      beforeEach(async function () {
        await findEresource.button.click();
        await findEresource.closeButton.click();
      });

      it('hides the modal', function () {
        expect(findEresource.modal.isPresent).to.be.false;
      });
    });

    describe('checking show packages filter', function () {
      beforeEach(async function () {
        await findEresource.button.click();
        await findEresource.modal.clickPackagesFilter();
      });

      it('displays expected number of packages', function () {
        expect(findEresource.modal.instances().length).to.equal(eresourcePackagesCount);
      });
    });

    describe('checking no packages filter', function () {
      beforeEach(async function () {
        await findEresource.button.click();
        await findEresource.modal.clickNonPackagesFilter();
      });

      it('displays expected number of titles', function () {
        expect(findEresource.modal.instances().length).to.equal(journalsCount + booksCount);
      });
    });

    describe('checking book filter', function () {
      beforeEach(async function () {
        await findEresource.button.click();
        await findEresource.modal.clickBookFilter();
      });

      it('displays expected number of books', function () {
        expect(findEresource.modal.instances().length).to.equal(booksCount);
      });
    });

    describe('checking journal filter', function () {
      beforeEach(async function () {
        await findEresource.button.click();
        await findEresource.modal.clickJournalFilter();
      });

      it('displays expected number of journals', function () {
        expect(findEresource.modal.instances().length).to.equal(journalsCount);
      });
    });
  });

  describe('render plugin with only packages', function () {
    beforeEach(async function () {
      await mount(
        <PluginHarness showTitles={false} />
      );
    });

    describe('clicking the trigger button', function () {
      beforeEach(async function () {
        await findEresource.button.click();
      });

      it('opens a modal', function () {
        expect(findEresource.modal.isPresent).to.be.true;
      });

      it('displays expected number of packages', function () {
        expect(findEresource.modal.instances().length).to.equal(eresourcePackagesCount);
      });

      it('should not render the type filter', function () {
        expect(findEresource.modal.isPackageFilterPresent).to.be.false;
      });

      it('should not render the isPackage filter', function () {
        expect(findEresource.modal.isTypeFilterPresent).to.be.false;
      });

      it('should render the external data source filter', function () {
        expect(findEresource.modal.isRemoteKbFilterPresent).to.be.true;
      });
    });
  });

  describe('render plugin with only titles', function () {
    beforeEach(async function () {
      await mount(
        <PluginHarness showPackages={false} />
      );
    });

    describe('clicking the trigger button', function () {
      beforeEach(async function () {
        await findEresource.button.click();
      });

      it('opens a modal', function () {
        expect(findEresource.modal.isPresent).to.be.true;
      });

      it('displays expected number of titles', function () {
        expect(findEresource.modal.instances().length).to.equal(booksCount + journalsCount);
      });

      it('should not render the isPackage filter', function () {
        expect(findEresource.modal.isPackageFilterPresent).to.be.false;
      });

      it('should render the type filter', function () {
        expect(findEresource.modal.isTypeFilterPresent).to.be.true;
      });

      it('should not render the external data source filter', function () {
        expect(findEresource.modal.isRemoteKbFilterPresent).to.be.false;
      });
    });
  });

  describe('filling in the searchField', function () {
    beforeEach(async function () {
      await findEresource.button.click();
      await findEresource.modal.searchField.fill('a');
    });

    it('enables the reset button', function () {
      expect(findEresource.modal.resetButton.isEnabled).to.be.true;
    });

    it('enables the search button', function () {
      expect(findEresource.modal.searchButton.isEnabled).to.be.true;
    });

    describe('submitting the search', function () {
      beforeEach(async function () {
        await findEresource.modal.searchButton.click();
      });

      it('returns a set of results', function () {
        expect(findEresource.modal.instances().length).to.be.greaterThan(0);
      });
    });
  });
});
