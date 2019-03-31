import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import 'terminal.css'
import './style/app.css'
import _ from 'lodash'
import ItemFound from './ItemFound'
import ItemFoundTable from './ItemFoundTable'
import { Provider, connect } from 'react-redux'
import { searchRequest, filterResults } from './store'

class App extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  INITIAL_STATE = {
    findings: [],
    search: '',
    filter: '',
    q: ''
  }

  constructor(props) {
    super(props);

    this.search = React.createRef();
    this.state = this.INITIAL_STATE;
  }

  doSearch(q) {
    this.props.dispatch(searchRequest(q))
  }

  handleOnSubmit(event) {
    event.preventDefault();

    this.doSearch(this.search.current.value);
  }

  handleOnClick(event) {
    // this.doSearch(this.search.current.value);
    // onClick={::this.handleOnClick}
  }

  encodeHTML(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  filterResults = filter => () => {
    this.props.dispatch(filterResults(filter))
  }

  renderAside() {

    const { search } = this.props
    const { q, results, filter } = search

    if (results.length === 0) {
      return <div></div>;
    }

    let summary = _.mapValues(
      _.groupBy(results, 'source'), (value) => value.length)

    if (!_.isEmpty(summary)) {
      summary['all'] = results.length
    }

    return (
      <div>
        <h2>Summary Results</h2>
        <nav>
          <ul>
            {
              _.map(summary, (value, key, collection) => {
                return (
                  <li>
                      <a href="#" onClick={::this.filterResults(key)}>
                        {`${key}...${value}`}
                        {filter === key && <span>&nbsp;&#x2691;</span>}
                      </a>
                  </li>
                )
              })
            }
          </ul>
        </nav>
      </div>
    )
  }

  render() {

    const { search } = this.props
    const { q, results, filter, searching } = search

    const filteredResults = _.findIndex(['all', ''], (o) => o === filter) > -1
      ? results
      : _.filter(results, (o) => o['source'] === filter)

    return (
      <div class="container">
        <div class="terminal-nav">
          <div class="terminal-logo">
            <div class="logo terminal-prompt"><a href="#" class="no-style">Search</a></div>
          </div>
        </div>
        <div class={!_.isEmpty(results) ? "components components-grid" : ""}>
          <aside id="menu">
            {::this.renderAside()}
          </aside>
          <main>
            <section>
              <form class="form-search" action="#" method="post" onSubmit={::this.handleOnSubmit}>
                <div class="search-input">
                  <input id="search" name="search" type="text" ref={this.search} required="" minlength="2" autocomplete="off" autofocus="on"/>
                  <button class="btn btn-default">Go</button>
                </div>
              </form>
            </section>
            <section class="summary-results">
              { searching && <header><p>...</p></header> }
              { !searching && _.isEmpty(results) && !_.isEmpty(q) && <header><p>Nothing found.</p></header> }
              { !searching && !_.isEmpty(results) && !_.isEmpty(q) && <p>{results.length} results for <ins>{q}</ins></p> }
            </section>
            {
              _.map(filteredResults, (value, key, collection) => {
                switch (value.typeItem) {
                  case 'TABLE':
                    return ( <ItemFoundTable finding={value} /> )
                  default:
                    return ( <ItemFound finding={value} /> )
                }
              })
            }
            { !_.isEmpty(results) && <hr/> }
          </main>
        </div>
      </div>
    )
  }
}

export default connect(
  (state, ownProps) => {
    return {
      search: _.get(state, 'search', { q: '', results: [] }),
      bootstrapped: _.get(state, 'bootstrapped')
    }
  },
)(App)
