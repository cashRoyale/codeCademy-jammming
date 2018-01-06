import React from 'react';
import './Playlist.css'
import Tracklist from '../Tracklist/Tracklist';

class Playlist extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      playlistName: '',
      placeholder: 'New Playlist'
    }

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }
  handleNameChange(event){
    this.setState({
      playlistName: event.target.value
    })
  }
  handleSave(event){
    this.props.onSave(this.state.playlistName);
    this.setState({
      playlistName: ''
    });
  }
  render(){
    return(
      <div className="Playlist">
        <input onChange={this.handleNameChange} value={this.state.playlistName} placeholder={this.state.placeholder}/>
        <Tracklist tracks={this.props.playlistTracks} onRemove={this.props.onRemove}/>
        <a className="Playlist-save" onClick={this.handleSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default Playlist;
