const clientId = '05e6a527b9ab4c1c9b35e43e305fdb1e';
const redirect = 'http://cashroyale.surge.sh/';
const authURL = 'https://accounts.spotify.com/authorize';
const scope = 'playlist-modify-public';
const apiSearchUrl = 'https://api.spotify.com/v1/search';
const apiProfileUrl = 'https://api.spotify.com/v1/me';
const apiPlaylistUrl = 'https://api.spotify.com/v1/users/';

const Spotify = {
  accessToken: false,
  user_id: false,
  expires: false,

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
        Spotify.accessToken = accessTokenCode[1];
        Spotify.expires = expireTimeCode[1];
        console.log(Spotify.accessToken);
        console.log(Spotify.expires);
        window.setTimeout(() => Spotify.accessToken = '',Spotify.expires * 1000);
        window.history.pushState('Access Token',null,'/');
      } else {
        window.location.href = `${authURL}?client_id=${clientId}&redirect_uri=${redirect}&response_type=token&scope=${scope}`
      }
    }
    //return Spotify.accessToken;
  },

  search(term) {
    if(!Spotify.accessToken || !Spotify.user_id){
      Spotify.getAccessToken();
      Spotify.getUserId();
    }
    return fetch(`${apiSearchUrl}?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${Spotify.accessToken}`
      }
    }).then(response => {
      console.log(response);
      return response.json();
    }).then(jsonResponse => {
      console.log(jsonResponse);
      if (!jsonResponse.tracks) {
        return;
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
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
    if(!playlistName || !tracks || !Spotify.user_id){
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
};

export default Spotify;
