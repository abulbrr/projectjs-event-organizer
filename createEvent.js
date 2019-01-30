var IS_DEBUG_ON;
var APPLICATION_MODE;

IS_DEBUG_ON         = true;
APPLICATION_MODE    = 'Development';
var EventsList = [];


var EventOrganiser = {
    createEvent: function (event) {
        event.preventDefault()
        var form = document.querySelector("#createEventForm");
        if(form.elements['eventName'].value === "") {
            alert("empty event name! Please try again")
            return;
        }
        
        let innerEvent =  {
            uuid      : Math.random().toString(36).substr(2, 16),
            name      : form.elements['eventName'].value,
            isNsfw    : form.elements['isNsfw'].checked,
            atendees: []
        }
        LocalStorage.addEvent( innerEvent , 
           sucess = () => { alert("You have sucessfully created an event"), 
           err    =  () => { alert("failed")}}
        )
        var retrievedObject = localStorage.getItem('EventsList');
        
    },
}

EventsList = LocalStorage.getEvents()