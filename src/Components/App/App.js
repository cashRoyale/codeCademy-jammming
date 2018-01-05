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
                  playlistName: "Any String"};

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
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
  updatePlaylistName(name){
    this.setState({playlistName: name});
  }
  savePlaylist(){
    //let trackUris = [];
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
                      playlistName={this.state.playlistName}
                      onRemove={this.state.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlayList}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
