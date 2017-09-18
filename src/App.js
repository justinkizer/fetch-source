import React from 'react';
import codeIcon from './code-outline.png';
import loadingIcon from './aperture_science_logo.png';
import './App.css';
import SubHeader from './sub_header.jsx';
import pretty from 'pretty';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlInput: 'news.ycombinator.com',
      rawSource: '',
      formattedSource: '',
      selectedSource: '',
      tagsData: '',
      loadingStatus: null
    };
    this.updateUrlInput = this.updateUrlInput.bind(this);
    this.fetchSource = this.fetchSource.bind(this);
    this.selectFormattedSource = this.selectFormattedSource.bind(this);
    this.selectRawSource = this.selectRawSource.bind(this);
    this.timers = [];
  }

  componentDidUpdate() {
    if (this.successfullyFetched) {
      this.successfullyFetched = false;
      this.fade('in');
      this.setState({ loadingStatus: null });
    }
  }

  componentWillUnmount() {
    this.timers.forEach(timer => clearInterval(timer));
  }

  updateUrlInput(e) {
    e.preventDefault();
    this.setState({ urlInput: e.target.value });
    if (document.body.scrollTop > 140) {
      const header = document.getElementById('app-header');
      header.style.position = 'fixed';
      this.timers.push(setTimeout(() => {
        header.style.position = 'sticky';
        document.body.scrollTop = 140;
      }, 0));
    }
  }

  selectFormattedSource(e) {
    e.preventDefault();
    e.target.blur();
    this.setState({ selectedSource: this.state.formattedSource });
  }

  selectRawSource(e) {
    e.preventDefault();
    e.target.blur();
    this.setState({ selectedSource: this.state.rawSource });
  }

  fetchSource(e) {
    e.preventDefault();
    this.setLoadingStatus();
    if (this.state.selectedSource) {
      this.fade('out');
      if (document.body.scrollTop > 140) { document.body.scrollTop = 140; }
    }
    fetch('api/fetch?url=' + this.state.urlInput)
      .then(response => {
        response.json()
          .then(data => {
            if (data.error) {
              this.setLoadingStatus(data.error);
              return;
            }
            this.successfullyFetched = true;
            const tagsData = this.prepareTagData(data.tags);
            const formattedSource = pretty(data.html);
            this.setState({
              rawSource: data.html,
              selectedSource: formattedSource,
              formattedSource,
              tagsData
            });
          })
          .catch(error => {
            this.setLoadingStatus(error);
            console.log(error);
          });
      });
  }

  setLoadingStatus(error) {
    const loadingMessage = (
      <strong className='loading-status'>
        Loading...
        <img src={ loadingIcon } className='loading-icon' alt='loading' />
      </strong>
    );
    const errorMessage = (
      <p className='loading-status'>
        An error occured - please review the URL and try again.
      </p>
    );
    const status = error ? errorMessage : loadingMessage;
    const source = error ? '' : this.state.selectedSource;
    this.setState({ loadingStatus: status, selectedSource: source });
  }

  prepareTagData(tags) {
    const tagsData = Object.keys(tags).sort();
    return tagsData.map((name, index) => {
      let comma = ',';
      if (index === tagsData.length - 1) { comma = ''; }
      return (
        <li key={ name }>
          <strong>{ name + ':' }</strong>
          <p>{ tags[name] }{ comma }</p>
        </li>
      );
    });
  }

  fade(direction) {
    const removeOrToggle = direction === 'in' ? 'remove' : 'toggle';
    const subHeader = document.getElementById('sub-header');
    const sourceView = document.getElementById('source-view');
    [subHeader, sourceView].forEach(element => {
      element.classList.toggle('fade-in');
      element.classList[removeOrToggle]('fade-out');
    });
  }

  render() {
    let subHeader;
    let sourceView;
    if (this.state.selectedSource) {
      subHeader =
        <SubHeader
          formattedSource={ this.state.formattedSource }
          rawSource={ this.state.rawSource }
          selectedSource={ this.state.selectedSource }
          selectFormattedSource={ this.selectFormattedSource }
          selectRawSource={ this.selectRawSource }
          tagsData={ this.state.tagsData }
        />;
      sourceView = (
        <ul className='source-view' id='source-view'>
          { this.state.selectedSource }
        </ul>
      );
    }

    return (
      <div className='app'>
        <div className='app-header' id='app-header'>
          <img src={ codeIcon } className='app-logo' alt='logo' />
          <h2>Fetch the Source!</h2>
        </div>
        <p className='app-intro'>
          To view a webpage's source, submit its url below:
        </p>
        <div className='fetch-form'>
          <p>{ 'http(s)://' }</p>
          <form onSubmit={ this.fetchSource }>
            <input onChange={ this.updateUrlInput }
                   value={ this.state.urlInput }
                   placeholder={ 'www.google.com' }
            >
            </input>
            <button type='submit'>Go Fetch!</button>
          </form>
        </div>
        { this.state.loadingStatus }
        { subHeader }
        { sourceView }
      </div>
    );
  }
}

export default App;
