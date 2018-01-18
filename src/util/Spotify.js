const clientId = '05e6a527b9ab4c1c9b35e43e305fdb1e';
const redirect = 'http://localhost:3000/';
const authURL = 'https://accounts.spotify.com/authorize';
const scope = 'playlist-modify-public';
const apiSearchUrl = 'https://api.spotify.com/v1/search';
const apiProfileUrl = 'https://api.spotify.com/v1/me';
const apiPlaylistUrl = 'https://api.spotify.com/v1/users/';

const Spotify = {
  accessToken: null,
  user_id: null,
  expires: null,

  authenticate (){
    if(Spotify.accessToken === null){
      Spotify.getAccessToken();
    }
    if(Spotify.user_id === null){
      if(Spotify.accessToken === null){
        Spotify.wait(2000)
      }
      Spotify.getUserId()
    }
  },

//in case we need to wait for the accessToken to be returned to find user_id
  wait(ms) {
    let start = new Date().getTime();
    let end = start;
    while(end < start + ms) {
      end = new Date().getTime();
    }
  },

  isLoggedIn(){
    console.log(`Access Token: ${Spotify.accessToken}`);
    console.log(`User Id: ${Spotify.user_id}`);
    console.log(`Expires: ${new Date(Spotify.expires)}`);
    console.log(`What Time is it now: ${new Date()}`);
    console.log(Spotify.expires);
    console.log(Spotify.expires > new Date().getTime());
    if(Spotify.accessToken === null || Spotify.user_id === null){
      return false;
    }
    let time = new Date().getTime();
    if(Spotify.expires > time){
      return true;
    }
    Spotify.accessToken = null;
    return false
  },

  getAccessToken(){
    console.log('Fetching AccessToken...');
    if (!Spotify.accessToken){
      const url = window.location.href;
      const accessTokenCode = url.match(/access_token=([^&]*)/);
      const expireTimeCode = url.match(/expires_in=([^&]*)/);
      console.log(url);
      console.log(accessTokenCode);
      console.log(expireTimeCode);
      if(accessTokenCode && expireTimeCode) {
        this.accessToken = accessTokenCode[1];
        let expireIn = expireTimeCode[1];
        let time = new Date()
        console.log(`Authenticated @: ${time}`);
        this.expires = time.setTime(+time + (+expireIn*1000));
        console.log(`User access_token: ${this.accessToken}`);
        console.log(`Authorization will expire @: ${new Date(time)}`);
        window.setTimeout(() => this.accessToken = '',expireIn*1000);
        window.history.pushState('Access Token',null,'/');
      } else {
        window.location.href = `${authURL}?client_id=${clientId}&redirect_uri=${redirect}&response_type=token&scope=${scope}`
      }
    }
  },

  search(term,type) {
    let typeTF = {
      artist: false,
      track: false,
      album: false
    }
    typeTF[type] = true;

    let searchURL = null;
    if(type !== 'track'){
      searchURL = `${apiSearchUrl}?type=${type}&q=${term}&limit=1`;
    } else {
      searchURL = `${apiSearchUrl}?type=${type}&q=${term}&limit=20`;
    }
    console.log(searchURL);
    console.log(`Looking up tracks that contain ${term} from ${type}...`);
    return fetch(`${searchURL}`, {
      headers: {
        Authorization: `Bearer ${Spotify.accessToken}`
      }
    }).then(response => {
      console.log(response);
      return response.json();
    }).then(jsonResponse => {
      console.log(jsonResponse);
      if(typeTF.artist){
        let artistId = jsonResponse.artists.items[0].id;
        console.log(artistId);
        https://api.spotify.com/v1/artists/{id}/top-tracks
        return fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,{
          headers: {
            Authorization: `Bearer ${Spotify.accessToken}`
          }
        }).then(response => {
          console.log(response);
          return response.json();
        }).then(jsonResponse => {
          console.log(jsonResponse);
          return jsonResponse.tracks.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            preview: track.preview_url
          }));
        })
      }else if(typeTF.album){
        let albumId = jsonResponse.albums.items[0].id;
        let albumName = jsonResponse.albums.items[0].name;
        console.log(albumId);
        return fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`,{
          headers: {
            Authorization: `Bearer ${Spotify.accessToken}`
          }
        }).then(response => {
          console.log(response);
          return response.json();
        }).then(jsonResponse => {
          console.log(jsonResponse);
          return jsonResponse.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: albumName,
            uri: track.uri,
            preview: track.preview_url
          }));
        })
      }else {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          preview: track.preview_url
        }));
      }
    })
  },
  getUserId(){
    console.log('Looking up User Id...');
    return fetch(`${apiProfileUrl}`,{
      headers : {'Authorization': `Bearer ${Spotify.accessToken}`}
    }).then(response => {
      console.log(response);
      return response.json();
    }).then(jsonResponse => {
      console.log(jsonResponse);
      if(!jsonResponse.id){
        return;
      }
      Spotify.user_id = jsonResponse.id;
      console.log(`User Id: ${Spotify.user_id}`);
    })
  },
  savePlaylist(playlistName,tracks){
    if(!playlistName || !tracks){
      return;
    }
    console.log(`name: ${playlistName},
      userid: ${Spotify.user_id},
      tracks: ${tracks},
      accessToken: ${Spotify.accessToken}`
    );
    console.log('Getting PlayList Id');
    return fetch(`${apiPlaylistUrl}${Spotify.user_id}/playlists`,{
      headers: {
        Authorization: `Bearer ${Spotify.accessToken}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({name: playlistName})
    }, error => {
      console.log('Something went wrong: ' + error);
    }).then(response => {
      if(response.ok){
        return response.json();
      }
      console.log(response);
      throw new Error('Error in Request');
    }, networkError => {
      console.log(`Network Error: ${networkError}`);
      throw new Error('Network!Error!');
    }).then(jsonResponse => {
//if playlist is created add tracks
      console.log(jsonResponse);
      if(jsonResponse.id){
        let playlist_id = jsonResponse.id;
        console.log(`Playlist Id: ${playlist_id}`);
        console.log('Write tracks to newly created playlist');
        return fetch(`${apiPlaylistUrl}${Spotify.user_id}/playlists/${playlist_id}/tracks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Spotify.accessToken}`
          },
          body: JSON.stringify(tracks)
        }).then(response => {
          if(response.ok){
            return true;
          }
          console.log(response);
          throw new Error('Error in Request');
        }, networkError => {
          console.log(`Network Error: ${networkError}`);
          throw new Error('Network!Error!');
        });
      }
      console.log('Returned because we did not find Playlist Id');
      return;
      })
  }
  //Get accessToken, user_id, and expiration at launch of website
};

export default Spotify;
