let convert_seconds = function(time){
	let minutes = Math.floor(time / 60);
	let seconds = time - minutes * 60;

	return minutes+':'+seconds;
}
function findRow(node){
    let i=0;
    while(node.previousSibling){
        node = node.previousSibling;
        if(node.nodeType === 1){
            i++;
        }
    }
    return i;
}

let playlist_widget = document.getElementById('playlist-widget-container'),
song_trigger = document.getElementsByClassName('play_song'),
playPause = document.getElementById('controls-play-btn'),
nextTrackBtn = document.getElementById('controls-next-btn'),
prevTrackBtn = document.getElementById('controls-prev-btn'),
isPlaying = false,
audio_file = new Audio(),
track,
timeelapse,
selectedsong;
audio_file.preload = "none";

const playlist_items = new Array();

class library_track{
	constructor (title,artist,album,albumcover,filepath,duration){
		this.title = title;
		this.artist = artist;
		this.album = album;
		this.filepath = filepath;
		this.albumcover = albumcover;
		this.track = new Audio('./_audio/'+this.filepath+'.mp3');
	}
	addTrack(){
		let track_info = '<a href="#" class="play_song" data-song="'+this.filepath+'"><h4>'+this.title+'<span>'+this.artist+'</span></h4></a>';
		let track_content = document.createElement("li");
		track_content.setAttribute('id',this.filepath);
		track_content.innerHTML = track_info;
		//Build the playlist in the DOM
		playlist_widget.appendChild(track_content);
	}
	playTrack(){
		isPlaying = true;
		this.track.play();
		let track_artist = document.getElementById('player-song-artist');
		let track_title = document.getElementById('player-song-title');
		let album_cover = document.getElementById('player-album-image');
		let track_duration_container = document.getElementById('player-time-duration');
		let prgoress_bar = document.getElementById('player-bar-progress');

		prgoress_bar.style.width = '0%';

		this.track.addEventListener('loadedmetadata',function(){
			this.sduration = this.duration;
			track_duration_container.innerHTML = convert_seconds(Math.floor(this.duration));
		},false);

		this.track.addEventListener('ended',function(){
			selectedsong.nextTrack();
		},false);

		track_artist.innerHTML = this.artist;
		track_title.innerHTML = this.title;
		
		album_cover.innerHTML = '<img src="./_img/albums/'+this.albumcover+'.png">';
		playPause.classList.add('playpause');

		/* =====================================
					EVENT LISTENERS 
		===================================== */
		let track_elapse_container = document.getElementById('player-time-elapsed');
		this.track.addEventListener('timeupdate',function(){
		    let sl = Math.floor(this.currentTime);
		    let trackDuration = Math.floor(this.sduration);
		   
		    /* UPDATE PROGRESS BAR */
			let percentage_played = (sl/trackDuration)*100;
			prgoress_bar.style.width = percentage_played+'%';

		    if (sl < 60) {
		    	if(sl < 10){
		    		timeelapse =  '0:0' + sl;
		    	}else{
		    		timeelapse =  '0:' + sl;
		    	}
		    }
		    else {
		    	let ml = parseInt((this.currentTime / 60) % 60);
		    	let sl = parseInt(this.currentTime % 60);
		    	if(sl < 10){
		    		timeelapse =  ml+':0' + sl;
		    	}else{
		    		timeelapse =  ml+':' + sl;
		    	}
		    }
		    track_elapse_container.innerHTML = timeelapse;
		});
	}
	pauseTrack(){
		isPlaying = false;
		this.track.pause();
		playPause.classList.remove('playpause');
	}
	stopTrack(){
		isPlaying = false;
		this.track.pause();
		playPause.classList.add('playpause');
	}
	queueTrack(playlistNumber){
		console.log(playlistNumber);
		console.log(playlist_items);
	}
	nextTrack(){
		let articleParagraphs = document.querySelectorAll(".now-playling-inlist");
		let numarticleParagraphs = articleParagraphs.length;
		let trackIndex = findRow(articleParagraphs[0]);
		let playNextTrack = trackIndex+2;
		let next_selectedsong = document.querySelector('#playlist-widget-container li:nth-child('+playNextTrack+') a');
		if(playlist_items.length === trackIndex + 1){
			alert('There is no song after that!');
		}else{
			next_selectedsong.click();
		}
	}
	prevTrack(){
		let articleParagraphs = document.querySelectorAll(".now-playling-inlist");
		let numarticleParagraphs = articleParagraphs.length;
		let trackIndex = findRow(articleParagraphs[0]);
		let playPrevTrack = trackIndex;
		let prev_selectedsong = document.querySelector('#playlist-widget-container li:nth-child('+playPrevTrack+') a');
		if(playlist_items.length === trackIndex){
			alert('There is no song before that!');
		}else{
			prev_selectedsong.click();
		}
	}
	listeners(){
		playPause.addEventListener('click',function(event){
			event.stopPropagation();
			var playstate = this.getAttribute('data-control');
			/* LISTEN FOR PLAY PAUSE CLICK, IF PLAYLIST HASN'T STARTED, PLAY FIRST SONG */
			if(playstate === 'play' && isPlaying === false){
				let default_selectedsong = document.querySelector('#playlist-widget-container li:nth-child(1) a');
				default_selectedsong.click();
			}
			if(playstate === 'play'){
				this.setAttribute('data-control','pause');
				playPause.classList.add('playpause');
				isPlaying = false;
				selectedsong.pauseTrack();
			}else{
				this.setAttribute('data-control', 'play');
				playPause.classList.remove('playpause');
				isPlaying = true;
				selectedsong.playTrack();
			}
		});	
	}
}
/* INIT PLAYLIST WIDGET FROM JS LIST OF SONGS */
for (let i in song_library.songs) {
	let song_title = song_library.songs[i].title;
	let song_artist = song_library.songs[i].artist;
	let song_album = song_library.songs[i].album;
	let song_album_cover = song_library.songs[i].albumcover;
	let song_path = song_library.songs[i].songpath;
	let song_duration = song_library.songs[i].duration;

	playlist_item = new library_track(
		song_title,
		song_artist,
		song_album,
		song_album_cover,
		song_path,
		song_duration
	);

	playlist_item.addTrack();
	playlist_items.push(playlist_item); 
}
const nowPlaying = function(parentIndex){
	let bparentEl = parentIndex;	
	let index = findRow(bparentEl);
	let c_song_info = playlist_items[index];
	console.log(c_song_info);
	return c_song_info;
}
/* SET UP LISTENERS FOR EVENTS */
for(let n in song_trigger){
	if(n >=0){
		song_trigger[n].addEventListener("click", function( event ) {
			event.preventDefault();
			event.stopPropagation();
			let articleParagraphs = document.querySelectorAll(".now-playling-inlist");
			let parentEl= this.parentElement;
			song_info = nowPlaying(parentEl);

			if(typeof selectedsong === 'object'){
				selectedsong.stopTrack();
			}
			selectedsong = new library_track(
				song_info.title,
				song_info.artist,
				song_info.album,
				song_info.albumcover,
				song_info.filepath,
				song_info.sduration
			);
			selectedsong.playTrack();	
			//UN-HIGHLIGHT THE PREVIOUS SONG
			if(articleParagraphs[0]){
				articleParagraphs[0].classList.remove("now-playling-inlist");
			}
			// HIGHLIGHT THE CURRENT SONG 
			let att = document.createAttribute("class");
			att.value = "now-playling-inlist";
			parentEl.setAttributeNode(att); 	
				
		});
	}
}
let elisten = new library_track();
nextTrackBtn.addEventListener("click",function(event){
	event.preventDefault();
	elisten.nextTrack();
});
prevTrackBtn.addEventListener("click",function(event){
	event.preventDefault();
	elisten.prevTrack();
});
elisten.listeners();
