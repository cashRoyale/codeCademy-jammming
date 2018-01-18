import React from 'react';
import './SearchResults.css';
import Tracklist from '../Tracklist/Tracklist';

class SearchResults extends React.Component {
  render(){
    return(
      <div className="SearchResults">
        <div className="Track-information">
          <h3>Songs</h3>
          <p>Artist | Album</p>
        </div>
        <Tracklist tracks={this.props.searchResults} onAdd={this.props.onAdd}/>
      </div>
    );
  }
}

export default SearchResults;
