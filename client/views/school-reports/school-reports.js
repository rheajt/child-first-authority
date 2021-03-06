import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as repAct from '../../modules/reports';

import Dimensions from 'react-dimensions-cjs';
import {Tabs, Tab} from 'material-ui/Tabs';

import AtRiskTab from './tabs/at-risk';
import ChronicallyAbsentTab from './tabs/chronically-absent';
import InterventionsTab from './tabs/interventions';
import OutreachesTab from './tabs/outreaches';
import TableModel from '../../models/table';

const table = new TableModel();

class SchoolReportsPage extends React.Component {
  constructor(props) {
    super(props);

    // Register Initial Component State
    let nextTable = table.setSelectedTab(table, 'atRisk');
    this.state = {
      currentTab : 'atRisk',
      table      : nextTable,
      loaded     : false
    };
  }

  componentDidMount() {
    this.retrieveData('atRisk');
  }

  componentWillReceiveProps(nextProps) {
    let nextTable = this.state.table;
    let dataLoaded = false;
    switch (nextTable.get('selectedTab')) {
    case 'atRisk':
      if(nextProps.reports.atRisk.size && !this.state.loaded) {
        //console.log('Got It!!! ', nextProps.reports.atRisk.size);
        dataLoaded = true;
        nextTable = table.updateSortCol(nextTable, '');
        nextTable = table.buildIndexMap(nextTable, nextProps.reports.atRisk);
      }
      break;
    case 'chronicAbsent':
      if(nextProps.reports.chronicAbsent.size && !this.state.loaded) {
        //console.log('Got It!!! ', nextProps.reports.chronicAbsent.size);
        dataLoaded = true;
        nextTable = table.updateSortCol(nextTable, '');
        nextTable = table.buildIndexMap(nextTable, nextProps.reports.chronicAbsent);
      }
      break;
    case 'outreachSummary':
      if(nextProps.reports.outreachSummary.size && !this.state.loaded) {
        //console.log('Got It!!! ', nextProps.reports.outreachSummary.size);
        dataLoaded = true;
        nextTable = table.updateSortCol(nextTable, '');
        nextTable = table.buildIndexMap(nextTable, nextProps.reports.outreachSummary);
      }
      break;
    case 'interventionSummary':
      if(nextProps.reports.interventionSummary.size && !this.state.loaded) {
        //console.log('Got It!!!', nextProps.reports.interventionSummary.size);
        dataLoaded = true;
        nextTable = table.updateSortCol(nextTable, '');
        nextTable = table.buildIndexMap(nextTable, nextProps.reports.interventionSummary);
      }
      break;
    }
    if(dataLoaded) {
      this.setState({table: nextTable, loaded: true});
    }
    // nextTable = table.enableFiltering(nextTable);
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log('did update: ', prevState);
    let selectedTab = this.state.table.get('selectedTab');
    if(prevState.table.get('selectedTab') != selectedTab) {
      this.retrieveData(selectedTab);
    }
  }

  /**
   * Perform API call to Retrieve Data
   *   - Retrieve and configure data for table
   *   - Set default state for 'action' variables
   */
  retrieveData = currentTab => {
    let loadingPromise;
    // Clear previously loaded reports from the store
    this.props.repAct.resetReports();
    // Call the API for new reports
    switch (currentTab) {
    case 'atRisk':
      loadingPromise = this.props.repAct.getCurrentAtRisk();
      break;
    case 'chronicAbsent':
      loadingPromise = this.props.repAct.getChronicallyAbsent();
      break;
    case 'outreachSummary':
      loadingPromise = this.props.repAct.getOutreachSummary();
      break;
    case 'interventionSummary':
      loadingPromise = this.props.repAct.getInterventionSummary();
      break;
    }
    loadingPromise.then(() => this.updateData());
  }

  updateData = () => {
    let nextTable = table.updateSortCol(this.state.table, '');
    // nextTable = table.buildIndexMap(nextTable, this.props.reports[this.state.currentTab]);
    // nextTable = table.enableFiltering(nextTable);
    this.setState({table: nextTable, loaded: true});
  }

  clickHandler = (action, data, event) => {
    let nextTable;
    switch (action) {

    // Clicked a main tab
    case 'changeTabs':
      this.props.repAct.resetReports();
      nextTable = table.setSelectedTab(this.state.table, data.props.value);
      this.setState({table: nextTable, loaded: false});
      break;

    /**
     * DataTable Click Handler
     *   - Select / de-select a table row
     *   - Sort by a column
     *   - Apply a filter
     */
    case 'toggleSelected':
      nextTable = table.toggleSelectedRowIndex(this.state.table, data);
      this.setState({table: nextTable});
      break;
    case 'toggleSortCol':
      nextTable = table.updateSortCol(this.state.table, data);
      nextTable = table.sortDataByCol(nextTable, this.props.absenceRecords);
      this.setState({table: nextTable});
      break;
    case 'changeFilterCol':
      //console.log(data.substr(7), event);
      let tabData = this.state.table.get('selectedTab') == 'users'
          ? this.props.absenceRecords : this.props.absenceRecords;
      nextTable = table.updateFilterBy(this.state.table, tabData, data.substr(7), event);
      nextTable = table.sortDataByCol(nextTable, tabData);
      this.setState({table: nextTable});
      break;
    case 'buttonClick':
      console.log(action, data, event);
      break;
    }
  }

  // Handle user changing main tabs
  tabHandler = data => {
    this.setState({ currentTab: data });
    this.clickHandler('changeTabs', data);
  }

  render() {
    let view = {
      width  : this.props.containerWidth - 20,
      height : this.props.containerHeight - 48 - 80
    };

    return (
      <Tabs
        style={{width: this.props.containerWidth}}
        value={this.state.table.get('selectedTab')}
      >
        <Tab
          label="At Risk"
          onActive={this.tabHandler}
          value='atRisk'
        >
          <AtRiskTab
            view={view}
            atRisk={this.props.reports.atRisk}
            table = {this.state.table}
            loaded = {this.state.loaded}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab
          label="Chronically Absent"
          onActive={this.tabHandler}
          value='chronicAbsent'
        >
          <ChronicallyAbsentTab
            view={view}
            chronicAbsent={this.props.reports.chronicAbsent}
            table = {this.state.table}
            loaded = {this.state.loaded}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab
          label="Outreaches"
          onActive={this.tabHandler}
          value='outreachSummary'
        >
          <OutreachesTab
            view = {view}
            outreaches = {this.props.reports.outreachSummary}
            table = {this.state.table}
            loaded = {this.state.loaded}
            clickHandler = {this.clickHandler}
          />
        </Tab>
        <Tab
          label="Interventions"
          onActive={this.tabHandler}
          value='interventionSummary'
        >
          <InterventionsTab
            view={view}
            interventions = {this.props.reports.interventionSummary}
            table = {this.state.table}
            loaded = {this.state.loaded}
            clickHandler = {this.clickHandler}
          />
        </Tab>
      </Tabs>
    );
  }
}

SchoolReportsPage.propTypes = {
  repAct          : PropTypes.object.isRequired,
  absenceRecords  : PropTypes.object.isRequired,
  reports         : PropTypes.object.isRequired,
  containerWidth  : PropTypes.number.isRequired,
  containerHeight : PropTypes.number.isRequired
};

function mapStateToProps(state) {
  return {
    absenceRecords : state.absenceRecords,
    reports        : state.reports
  };
}

function mapDispatchToProps(dispatch) {
  return {
    repAct : bindActionCreators(repAct, dispatch)
  };
}

//https://github.com/digidem/react-dimensions-cjs/issues/44
export default connect(mapStateToProps, mapDispatchToProps)(
  Dimensions({elementResize: true})(SchoolReportsPage));
