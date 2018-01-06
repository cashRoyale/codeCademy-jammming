import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {searchResults: [],
                  playlistTracks: [],
                };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    let playlistItems = this.state.playlistTracks;
    let found = false;
    playlistItems.forEach(item => {
      if(item.id === track.id) {
        found = true;
      }
    });
    if(!found){
      playlistItems.push(track);
    }
    this.setState({playlistTracks: playlistItems});
  }

  removeTrack(track){
    let playlistItems = this.state.playlistTracks;
    playlistItems = playlistItems.filter(item => {
      return (item.id !== track.id);
    });
    this.setState({playlistTracks: playlistItems});
  }
  savePlaylist(playlistName){
    let uriIDs = [];
    this.state.playlistTracks.forEach(track => {
      uriIDs.push(track.uri);
    })
    console.log(playlistName);
    console.log(uriIDs);
    Spotify.savePlaylist(playlistName, uriIDs);

    this.setState({
      playlistTracks: [],
      searchResults: []
    });
  }

  search(term) {
    console.log(`This is the term you searched: ${term}`);
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
