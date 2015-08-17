// https://gist.github.com/jhermsmeier/3bc995d37f3acc0b0364

function $( selector ) {
  return document.querySelector( selector )
}

var SpeechRecognition = window.SpeechRecognition ||
  window.webkitSpeechRecognition

function Recognizer() {
  
  if( !(this instanceof Recognizer) )
    return new Recognizer()
  
  this.recog = new SpeechRecognition()
  this.recog.lang = 'fr'
  this.recog.continuous = true
  this.recog.interimResults = true
  //this.recog.serviceURI = 'wami.csail.mit.edu'
  //window.alert(Object.getOwnPropertyNames(this.recog));
  //this.recog.grammars = new SpeechGrammarList(); .addFromURI('test1.xml');
  
  this.confidence = $( '.speech .confidence' )
  this.transcript = $( '.speech .transcript' )
  
  this.attachEvents()
  
}

Recognizer.prototype = {
  
  constructor: Recognizer,
  
  attachEvents: function() {
    this.recog.addEventListener( 'audiostart', this )
    this.recog.addEventListener( 'soundstart', this )
    this.recog.addEventListener( 'speechstart', this )
    this.recog.addEventListener( 'speechend', this )
    this.recog.addEventListener( 'soundend', this )
    this.recog.addEventListener( 'audioend', this )
    this.recog.addEventListener( 'result', this )
    this.recog.addEventListener( 'nomatch', this )
    this.recog.addEventListener( 'error', this )
    this.recog.addEventListener( 'start', this )
    this.recog.addEventListener( 'end', this )
  },
  
  handleEvent: function( event ) {
    switch( event && event.type ) {
      case 'result': this.displayResult( event ); break
      case 'end': this.listen(); break
      default: console.log( 'Unhandled event:', event )
    }
  },
  
  listen: function() {
    this.recog.start()
  },
  
  displayResult: function( event ) {
    window.requestAnimationFrame( function() {
      
      var result = event.results[ event.resultIndex ]
      var item = result[0]
      
	  
      this.confidence.textContent = parseFloat( item.confidence ).toPrecision( 2 )
      this.transcript.textContent = item.transcript
      
	  
      if (result.isFinal === true) {
        this.transcript.classList.add( 'final' );
		console.log("RECOG: " + this.transcript.textContent);
		var xmlhttp;
		xmlhttp=new XMLHttpRequest();
		var emu = item.transcript;
		emu = emu.replace(/-/g,' ');
		
		//emu = emu.replace(/Soline/ig,'Abracadabra Soline');
		
		emu = 'Abracadabra Soline ' + emu;
		var url = "https://127.0.0.1:4300/sarah?emulate=" + emu;
			
		xmlhttp.open("GET",url,true);
		xmlhttp.send();
		
		//location.reload();
	  } else {
        this.transcript.classList.remove( 'final' );
	  }
      
    }.bind( this ))
  },
  
}

window.addEventListener( 'DOMContentLoaded', function() {
  this.recognizer = new Recognizer()
  this.recognizer.listen()
})