var IS_DEBUG_ON;
var APPLICATION_MODE;

IS_DEBUG_ON         = true;
APPLICATION_MODE    = 'Development';
var ClientsList = [];



var EventOrganiser = {
    createClient: function (event) {
        event.preventDefault()
        var form = document.querySelector("#createEventForm");
        if(form.elements['username'].value === "") {
            alert("empty event name! Please try again")
            return;
        }
        
        let innerEvent =  {
            uuid      : Math.random().toString(36).substr(2, 16),
            username  : form.elements['username'].value,
            password  : form.elements['password'].value,
            age       : form.elements['age'].value,
            sex       : form.elements['sex'].value,
            events: []
        }
        LocalStorage.addClient( innerEvent , 
           sucess = () => { alert("You have sucessfully created an account")
            window.location.href = './events.html'}, 
           err    =  () => { alert("failed")}
        )

        var retrievedObject = LocalStorage.getClients();
        
    },
}
