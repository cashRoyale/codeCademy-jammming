import React from 'react';
import './Playlist.css'
import Tracklist from '../Tracklist/Tracklist';

class Playlist extends React.Component {
  constructor(props){
    super(props)
    this.state = {playlistName: 'New Playlist'};
    this.handleNameChange = this.handleNameChange.bind(this);
  }
  handleNameChange(event){
    this.setState(this.props.onNamechange);
  }
  render(){
    return(
      <div className="Playlist">
        <input onChange={this.handleNameChange} placeholder={this.state.playlistName}/>
        <Tracklist tracks={this.props.playlistTracks} onRemove={this.props.onRemove}/>
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default Playlist;
