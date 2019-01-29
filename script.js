var IS_DEBUG_ON;
var APPLICATION_MODE;

IS_DEBUG_ON         = true;
APPLICATION_MODE    = 'Development';
var EventsList = [];

var client = {
    name    : "",
    sex     : "",
    age     : 0
}


var EventOrganiser = {
    createEvent: function (event) {
        event.preventDefault()
        var form = document.querySelector("#createEventForm");
        if(form.elements['eventName'].value === "") {
            console.log("empty event name!")
            return;
        }
        
        let innerEvent =  {
            uuid      : Math.random().toString(36).substr(2, 16),
            name      : form.elements['eventName'].value,
            isNsfw    : form.elements['isNsfw'].checked,
            atendees: []
        }
        EventsList.push(innerEvent)
        localStorage.setItem('EventsList', JSON.stringify(EventsList));
        
        var retrievedObject = localStorage.getItem('EventsList');
        
        console.log('EventsList: ', JSON.parse(retrievedObject));
    },
}




LocalStorage.getEvents()