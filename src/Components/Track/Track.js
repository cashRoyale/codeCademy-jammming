import React from 'react';
import './Track.css';

class Track extends React.Component{
  constructor(props) {
    super(props)

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  renderAction() {
    if (this.props.onRemove) {
      return <a className="Track-action" onClick={this.removeTrack}>-</a>;
    }
    return <a className="Track-action" onClick={this.addTrack}>+</a>;
  }

  addTrack(event){
    this.props.onAdd(this.props.track);
  }

  removeTrack(event){
    this.props.onRemove(this.props.track);
  }
  loadPreviewButton(){
    if(this.props.track.uri !== null){
      //console.log(this.props.track.uri);
      let sourceURL = `https://open.spotify.com/embed?uri=${this.props.track.uri}`;
      return <iframe src={sourceURL} width="300" height="80" frameBorder="1" allowtransparency="true"></iframe>;
    }
  }

  render(){
    return(
      <div className="Track">
      <div className="Track-information">
      <h3>{this.props.track.name}</h3>
      <p>{this.props.track.artist} | {this.props.track.album}</p>
      </div>
      <p>{this.loadPreviewButton()}</p>
      {this.renderAction()}
      </div>
    );
  }
}

export default Track;
